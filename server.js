var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;
 
 app.use(bodyParser.json());

app.get('/todos', function(req, res) {
	res.json(todos);
})

app.get('/todos/:id', function(req, res) {
	var matchedTodo = _.findWhere(todos, {id: parseInt(req.params.id)});
	// todos.forEach(function(todo) {
	// 	console.log(todo.id);
	// 	if (parseInt(req.params.id) === todo.id) {
	// 		matchedTodo = todo;
			
	// 	}
	// });

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
})

// Create new todo
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0 ) {
		return res.status(400).send();
	}

	body.description = body.description.trim();

	body.id = todoNextId++;

	todos.push(body);

	res.json(body);

});

// DELETE
app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (matchedTodo) {
		todos = _.without(todos, matchedTodo);
		return res.json(matchedTodo);
	} else {
		return res.status(404).json({"error": "no todo found "});
	}
	
});

// Update
app.put('/todos/:id', function(req, res) {
	
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};
	
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	if (!matchedTodo) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).json({"error": "completed not valid 1"});
	} else {
		return res.status(400).json({"error": "completed not valid 2"});
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) &&
	 body.description.length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).json({"error": "description not valid "});
	} else {
		return res.status(400).json({"error": "description not valid "});
	}

	_.extend(matchedTodo, validAttributes);
	return res.json(matchedTodo);
	
});

// Listner
app.listen(PORT, function() {
	console.log('server started at:- ' + PORT);
})