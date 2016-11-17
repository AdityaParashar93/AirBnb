var ejs 		= require("ejs");
var mongo 		= require("./mongo");
var ObjectId 	= require('mongodb').ObjectID;
var mongoURL 	= "mongodb://localhost:27017/AirbnbDatabaseMongoDB";

exports.handle_register_new_user_queue_request = function (msg, callback) {

	var json_responses = {};
	console.log("IN handle_register_new_user_queue_request:");

	var saltRounds 			= msg.saltRounds;
	var myPlaintextPassword = msg.myPlaintextPassword;
	var salt 				= msg.salt;
	var hash 				= msg.hash;
	var dt					= msg.dt;
	var first_name 			= msg.first_name;
	var last_name 			= msg.last_name;
	var inputUsername 		= msg.inputUsername;
	var inputPassword 		= msg.inputPassword;
	var dob                 = msg.dob;
	console.log("LISTENING TO handle_register_new_user_queue_request WITH msg_payload AS: ");
	console.log(msg);
	
	mongo.connect(mongoURL, function() {
		console.log('CONNECTED TO MONGO IN handle_register_new_user_queue_request');
		
		var collection_login 	= mongo.collection('login');
		var json_responses;

		collection_login.findOne({
			username : inputUsername
		}, function(err, user) {
			if (user) {
				console.log("USER ALREADY EXISTS");
				
				json_responses = {
					"statusCode" : 402
				};
				callback(null, json_responses);
			} else {
				collection_login.insert({
					user_id_ssn_format : "",
					fname 	: first_name,
					lname 	: last_name,
					dob     : dob,
					address : "",
					city	: "",
					state	: "",
					zip_code: "",
					phone_number	: "",
					rating	: "",
					reviews	: "",
					profile_image	: "",
					credit_card_details	: "",
					currentlogintime: dt,
					logintime 		: dt,
					username : inputUsername,
					password : hash
				}, function(err, user) {
					if (user) {
						
						json_responses = {
							"statusCode" : 200
						};
						callback(null, json_responses);

					} else {
						console.log("RETURNED FALSE");
						
						json_responses = {
							"statusCode" : 401
						};
						callback(null, json_responses);
					}
				});

			}

		});

	});

};
