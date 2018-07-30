var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

if (env === 'production') {
	console.log('DB-URL:- ' + process.env.DATABASE_URL);
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		'dialect': 'postgres',
	});
} else {
	sequelize = new Sequelize(undefined, undefined, undefined, {
		'dialect': 'sqlite',
		'storage': __dirname + '/data/dev-todo-api.sqlite'
	});
}

var db = {};

db.todo = sequelize.import(__dirname + '/models/todo.js');
console.log('path:- ' + __dirname + '/models/todo.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;