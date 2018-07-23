var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

// Get /todos?completed=false&q=work
app.get('/todos', function(req, res) {
	var query = req.query;
	var where = {};

	if (query.hasOwnProperty('completed') && (query.completed === 'true')) {
		where.completed = true
	} else if (query.hasOwnProperty('completed') && (query.completed === 'false')) {
		where.completed = false
	}
	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q.toLowerCase() + '%'
		}
	}
	console.log(where);
	db.todo.findAll({
		where: where
	}).then(function(todos) {
		res.json(todos);
	}, function(error) {
		res.status(500).send();
		console.log(error);
	});
	/*var filteredTodos = todos;
	if (queryParams.hasOwnProperty('completed') && (queryParams.completed === 'true')) {
		filteredTodos = _.where(filteredTodos, {
			completed: true
		})
	} else if (queryParams.hasOwnProperty('completed') && (queryParams.completed === 'false')) {
		filteredTodos = _.where(filteredTodos, {
			completed: false
		})
	}
	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		filteredTodos = _.filter(filteredTodos, function(todo) {
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		});
	}
	res.json(filteredTodos);*/
});

// Get /todos/:id
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id);
	db.todo.findById(todoId).then(function(todo) {
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}

	}, function(error) {
		res.status(500).send();
		console.log('no todo found');
	}).catch(function(error) {
		res.status(404).send();
		console.log(error);
	});
	/*var matchedTodo = _.findWhere(todos, {
		id: parseInt(req.params.id)
	});

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}*/
});

// Create new todo
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	db.todo.create(body).then(function(todo) {
		res.json(todo.toJSON());
	}, function(error) {
		res.status(400).json(error);
	}).catch(function(error) {
		res.status(400).json(error);
	});
	// if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
	// 	return res.status(400).send();
	// }

	// body.description = body.description.trim();

	// body.id = todoNextId++;

	// todos.push(body);

	// res.json(body);

});

// DELETE
app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id);
	db.todo.destroy({
		where: {
			id: todoId
		}
	}).then(function(rows) {
		if (rows === 0) {
			res.status(404).json({
				error: 'No todo with id'
			})
		} else {
			console.log("Delete successfully:- " + rows);
			res.status(204).send();
		}

	}, function(error) {
		res.status(500).send();
		console.log('no todo found');
	}).catch(function(error) {
		res.status(404).send();
		console.log(error);
	});


	/*var matchedTodo = _.findWhere(todos, {
		id: todoId
	});

	if (matchedTodo) {
		todos = _.without(todos, matchedTodo);
		return res.json(matchedTodo);
	} else {
		return res.status(404).json({
			"error": "no todo found "
		});
	}*/

});

// Update
app.put('/todos/:id', function(req, res) {

	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});
	if (!matchedTodo) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).json({
			"error": "completed not valid 1"
		});
	} else {
		return res.status(400).json({
			"error": "completed not valid 2"
		});
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) &&
		body.description.length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).json({
			"error": "description not valid "
		});
	} else {
		return res.status(400).json({
			"error": "description not valid "
		});
	}

	_.extend(matchedTodo, validAttributes);
	return res.json(matchedTodo);

});

// Sync
db.sequelize.sync().then(function() {
	// Listner
	app.listen(PORT, function() {
		console.log('server started at:- ' + PORT);
	})
});