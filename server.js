'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

var app = express();
require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

var port = process.env.PORT || 8080;

app.get("/:string", function(req, res){
	
	function renderDate(timestamp, date){
		var json = {};
		if(timestamp && !date){
			console.log("timestamp");
			json.unix = parseInt(timestamp);

			json.natural = new Date(json.unix);
			json.natural = json.natural.toLocaleDateString();

		}else if(!timestamp && date){
			console.log("natural");
			json.unix = new Date(date);
			json.unix = json.unix.getTime();
			
			json.natural = new Date(json.unix);
			json.natural = json.natural.toLocaleDateString();
		} else {
			json.unix = null;
			json.natural = null;
		}
		
		return JSON.stringify(json);
	}
	
	console.log(req.params.string);
	var timestampTest = /^[0-9]+$/;
	var naturalDateTest = /^\s*[a-zA-Z]+\s+\d\d?\s*\,\s*\d+$/;
	
	if (timestampTest.test(req.params.string)) {
		console.log("timestamp");
		var json = renderDate(req.params.string, null);
		res.end(json);
		
	} else if (naturalDateTest.test(req.params.string)) {
		console.log("natural");
		var json = renderDate(null,req.params.string);
		res.end(json);
		
	} else {
		console.log("Bad request");
		var json = renderDate(null, null);
		res.status(400).send(json).end("Bad request");
	}
});

app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});