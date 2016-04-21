var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var path = require('path');
var logger = require('morgan');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var session = require('express-session')({secret: 'keyboard-cat', cookie: {}});
var colors = require('colors/safe');
var models = require('./lib/models');
var multer = require('multer');


var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(process.cwd(), 'uploads'));
    },
    filename: function (req, file, callback) {
        var md5sum = crypto.createHash('md5');
        md5sum.update(file.originalname);

        callback(null, Math.random().toString(36).slice(2, 10) + '_' + md5sum.digest('hex') + '_' + Date.now());
    }
});
var upload = multer({storage: storage, fileSize: 2 * 1024 * 1024}).single('file');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session);
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));


app.get('/', function(req, res) {
	if(req.session.authToken) {
		res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
	} else {
		res.sendFile(path.join(__dirname, 'views', 'enter.html'));
	}
});


app.post('/auth', function(req, res) {
	var username = req.body.username;
	var password = req.body.pwd;

	var sha1 = crypto.createHash('sha1');
	sha1.update(password);

	models.User.findOne({
		username: username,
		password: sha1.digest('hex')
	}).then(function(u) {
		if(u) {
			res.json({code: 0, msg: {id: u.id, username: u.username, createdAt: u.createdAt}});
		} else {
			res.json({code: -1, msg: 'Could not authenticate'})
		}
	});
});

app.get('/upload', function(req, res) {
	res.sendFile(path.join(__dirname, 'views', 'upload.html'))
});	
app.post('/upload', function(req, res) {
	upload(req, res, function (err) {
            if (err) {
                console.log(err);
                return res.json({code: -1, msg: 'Could not upload your file'});
            } else {
            	res.json({code: 0, msg: {
            		name: req.file.originalname
            	}});
            }
    });
});

var port = process.env.PORT || 3000;

http.listen(port, function () {
    console.log('listening on 0.0.0.0:' + port);
});