var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
})

var User = sequelize.define('user', {
	email: Sequelize.STRING
});

// Setting RelationShip
Todo.belongsTo(User);
User.hasMany(Todo);

sequelize.sync({
	//force: true
}).then(function() {

	User.findById(1).then(function(user) {
		user.getTodos({where: { completed: false} }).then(function(todos) {
			todos.forEach(function(todo) {
				console.log(todo.toJSON());
			}); 
		});
	});
	// User.create({
	// 	email: "a@a.com",
	// 	completed: false
	// }).then(function() {
	// 	return Todo.create({
	// 		description: "Hello world123"
	// 	});
	// }).then(function(todo) {
	// 	User.findById(1).then(function(user) {
	// 		user.addTodo(todo);
	// 	});
	// }).catch(function(error) {
	// 	console.log(error);
	// });
	// Todo.findById(4).then(function(todo) {
	// 	if (todo) {
	// 		console.log(todo.toJSON());
	// 	} else {
	// 		console.log('no todo found');
	// 	}
	// }).catch(function(error) {
	// 	console.log(error);
	// });
	/*	console.log('everything is synced');
		Todo.create({
			description: "Hello world678",
			completed: false
		}).then(function(todo) {
			return Todo.create({
				description: "Hello world678",
				completed: false
			});
		}).then(function() {
			return Todo.findAll({
				where: {
					completed: false,
					description: {
						$like: "%123%"
					}
				}
			});
			console.log('finished:- ' + todo);
		}).then(function(todos) {
			if (todos) {
				todos.forEach(function(todo) {
					console.log(todo.toJSON()); 
				}) ;
			} else {
				console.log('no todo found');
			}
		}).catch(function(error) {
			console.log(error);
		});
		Todo.create({
			description: "Hello world123",
			completed: false
		}).then(function(todo) {
			console.log('finished:- ' + todo);
		}).catch(function(error) {
			console.log(error);
		});*/
});