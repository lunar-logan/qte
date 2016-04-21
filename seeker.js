var crypto = require('crypto');
var datetime = require('node-datetime');

var TEST_SUM = "d42ad5cab6db57c93d1909b5953985789114c174";
var FILE_NAME = "Project"
var UID = 4072;

var p = "2016-04-20 23:20:00";
var q = "2016-04-20 23:45:59";

var a = datetime.create(p);
var b = datetime.create(q);

var found = false;

var diff = b.now() - a.now();
console.log("Running for: " + (diff / 1000));

for(var i=a.now(); 	i <= b.now(); i++) {
	var shaSum = crypto.createHash('sha1');
	var ts = parseInt(i/1000);
	shaSum.update(FILE_NAME + UID + '' + ts);
	var hex = shaSum.digest('hex');
	if(hex === TEST_SUM) {
		var dt = datetime.create(i);
		console.log('Sum found at: ' + dt.format('d/m/Y H:M:S'));
		found = true;
		break;
	}
}

if(!found) {
	console.log("Not found");
}