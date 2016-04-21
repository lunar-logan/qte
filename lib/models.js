var path = require('path');
var fs = require('fs');
var Sequelize = require('sequelize');
var crypto = require('crypto');

var sequelize = new Sequelize('qte.sqlite', 'root', '', {
	dialect: 'sqlite',
	storage: 'qte.sqlite'
});

var User = sequelize.define('user', {
	username: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
		validate: {
			notEmpty: true
		}
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
			len: [6, 64]
		}
	}
});

var Triple = sequelize.define('triple', {
	subject: {
		type: Sequelize.STRING,
		allowNull: false
	},
	predicate: {
		type: Sequelize.STRING,
		allowNull: false
	},
	object: {
		type: Sequelize.STRING,
		allowNull: false
	}
});

var TripleQuality = sequelize.define('qualities', {
	tripleId: {
		type: Sequelize.INTEGER
	},
	score: {
		type: Sequelize.INTEGER,
		defaultValue: 1,
		validate: { min: 1, max: 10 }
	}
});

User.sync();
Triple.sync();
TripleQuality.sync();


module.exports.User = User;
module.exports.Triple = Triple;
module.exports.TripleQuality = TripleQuality;

