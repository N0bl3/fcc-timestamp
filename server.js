'use strict';

var express = require('express');

var app = express();

var port = process.env.PORT || 8080;

app.get("/", function(req,res){
	res.end("Welcome! Pass a date in the url.<br>You can try <a href='https://fcc-timestamp-n0bl3.herokuapp.com/June%2023,2018'>June 23, 2018</a> or <a href='https://fcc-timestamp-n0bl3.herokuapp.com/1345678910'>timestamp unix style (1345678910)</a>");	
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