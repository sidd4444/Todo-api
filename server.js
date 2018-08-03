var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
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


	// var matchedTodo = _.findWhere(todos, {
	// 	id: todoId
	// });

	// if (matchedTodo) {
	// 	todos = _.without(todos, matchedTodo);
	// 	return res.json(matchedTodo);
	// } else {
	// 	return res.status(404).json({
	// 		"error": "no todo found "
	// 	});
	// }

});


// Update
app.put('/todos/:id', function(req, res) {

	var body = _.pick(req.body, 'description', 'completed');
	var todoId = parseInt(req.params.id);
	var attributes = {};

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		console.log('inside description:- ' + body);
		attributes.description = body.description;
	}

	db.todo.findById(todoId).then(function(todo) {
		if (todo) {
			return todo.update(attributes);
		} else {
			res.status(404).send();
		}
	}, function() {
		res.status(500).send();
	}).then(function(todo) {
		console.log('inside');
		res.json(todo.toJSON());
	}, function(e) {
		console.log(e);
		res.status(400).json(e);
	});

});

//// User Apis

//
app.post('/users', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');
	db.user.create(body).then(function(todo) {
		res.json(todo.toPublicJSON());
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

/// Users Login
//
app.post('/users/login', function(req, res) {

			var body = _.pick(req.body, 'email', 'password');
			// db.user.authenticate(body).then(function(user) {
			// 	res.json(user.toPublicJSON());
			// }, function() {
			// 	res.status(401).send()
			// });
			db.user.authenticate(body).then(function(user) {
					var token = user.generateToken('authentication');
					if (token) {
						res.header('Auth', token).json(user.toPublicJSON());
						}
						else {
							res.status(401).send();
						}
					},
					function(error) {
						console.log(error);
						res.status(401).send();
					});
			});

		// Sync
		db.sequelize.sync({
			force: true
		}).then(function() {
			// Listner
			app.listen(PORT, function() {
				console.log('server started at:- ' + PORT);
			})
		});