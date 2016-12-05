/**
 * 
 */
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var loginDatabase = "mongodb://localhost:27017/AirbnbDatabaseMongoDB";
var mongo = require('./mongo');
var bcrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
	console.log("PASSPORT CONNECTION ESTABLISHED WITH USER!");
	passport.use('signin_user', new LocalStrategy(function(username, password,
			done) {

		var dt = new Date();
		var myPlaintextPassword = password;

		mongo.getConnection(loginDatabase, function() {

			console.log('CONNECTED TO MONGO IN passportJS');
			var collection_login = mongo.collection('login');
			var json_responses;

			collection_login.findOne({
				username : username
			}, function(err, user) {
				console.log("placees re");
				console.log(user.approve_flag);
				
				
					var password = user.password;

					console.log("The password is: " + password);
					console.log("The username is: " + username);
					console.log(user);

					if (bcrypt.compareSync(myPlaintextPassword, password)) {
						console.log("password match");
						done(null, user);
					} else {
						done(null, false);
					}

				 
			});

		});

	}));
	
	passport.use('signin_admin', new LocalStrategy(function(username, password,
			done) {

		var dt = new Date();
		var myPlaintextPassword = password;

		mongo.getConnection(loginDatabase, function() {

			console.log('CONNECTED TO MONGO IN passportJS');
			var collection_login = mongo.collection('login_admin');
			var json_responses;

			collection_login.findOne({
				username : username
			}, function(err, user) {
				if (user) {
					var password = user.password;

					console.log("The password is: " + password);
					console.log("The username is: " + username);
					console.log(user);

					if (bcrypt.compareSync(myPlaintextPassword, password)) {

						done(null, user);
					} else {
						done(null, false);
					}

				} else {
					done(null, false);
				}
			});

		});

	}));
};