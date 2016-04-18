var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var session = require('express-session')({secret: 'keyboard-cat', cookie: {}});
var colors = require('colors/safe');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session);
app.use(express.static(path.join(__dirname, 'public')));




app.get('/', function(req, res) {
	if(req.session.authToken) {
		res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
	} else {
		res.sendFile(path.join(__dirname, 'views', 'enter.html'));
	}
});


app.post('/auth', function(req, res) {
	res.send(req.body);
});

var port = process.env.PORT || 3000;

http.listen(port, function () {
    console.log('listening on 0.0.0.0:' + port);
});