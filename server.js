'use strict';

var express = require('express');

var app = express();

var port = process.env.PORT || 8080;

app.set("views", __dirname + 'public');

app.get("/", function(req,res){
	res.render("index");	
});

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