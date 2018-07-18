var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

app.get('/', function(req, res) {
	res.send('todo api call');
})

app.listen(PORT, function() {
	console.log('server started at:- ' + PORT);
})