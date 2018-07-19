var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var bodyParser = require('body-parser');
// var todos = [{
// 	id: 1,
// 	description: 'take holidays',
// 	completed: false
// }, {
// 	id: 2,
// 	description: 'meet team',
// 	completed: false
// }, {
// 	id: 3,
// 	description: 'lunch',
// 	completed: true
// }];

// app.get('/', function(req, res) {
// 	res.send('todo api call');
// })
var todos = [];
var todoNextId = 1;
 
 app.use(bodyParser.json());

app.get('/todos', function(req, res) {
	res.json(todos);
})

app.get('/todos/:id', function(req, res) {
	var matchedTodo;
	todos.forEach(function(todo) {
		console.log(todo.id);
		if (parseInt(req.params.id) === todo.id) {
			matchedTodo = todo;
			
		}
	});

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
})

app.post('/todos', function(req, res) {
	var body = req.body;
	

	body.id = todoNextId++;

	todos.push(body);

	res.json(body);

});


app.listen(PORT, function() {
	console.log('server started at:- ' + PORT);
})