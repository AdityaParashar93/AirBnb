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
	var approve_flag		= msg.approve_flag;

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
					password : hash,
					approve_flag : approve_flag
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


exports.handle_admin_list_user_request = function (msg, callback) {

	console.log("IN handle_admin_approve_user_request:");
	console.log(msg);
	var json_responses = {};

	var username 	= msg.username;

	console.log("LISTENING TO A handle_admin_list_user_request WITH msg_payload AS: ");
	console.log(msg);
	
	mongo.connect(mongoURL, function() {
		console.log('CONNECTED TO MONGO IN handle_admin_list_user_request');
		var collection_login = mongo.collection('login');
		var json_response= {};
		
		collection_login.find({
			approve_flag : {
				$eq : "NO"
			}
		}).toArray(function(err, items) {

			json_response = {
				"users" : items
			};
			console.log(json_response);
			callback(null, json_response);
		});

	});

};

exports.handle_admin_approve_user_queue_request = function (msg, callback) {

	console.log("IN handle_admin_approve_user_queue_request:");
	console.log(msg);
	var json_responses = {};
	var flag		= msg.flag;
	var user_id		= msg.user_id;
	var username 	= msg.username;

	console.log("LISTENING TO A handle_admin_approve_user_queue_request WITH msg_payload AS: ");
	console.log(msg);
	
	mongo.connect(mongoURL, function() {
		console.log('CONNECTED TO MONGO IN handle_admin_approve_user_queue_request');
		var collection_login = mongo.collection('login');
		var json_response= {};
		
		collection_login.update({
			_id	: ObjectId(user_id) 
		}, {
			$set : {
				approve_flag : "YES"
			}
		},

		function(err, user) {
			if (user) {
				json_responses = {
					"statusCode" : 200
				};
				callback(null, json_responses);

			} else {
				console.log("returned false");
				json_responses = {
					"statusCode" : 401
				};
				callback(null, json_responses);
			}
		});

	});

};


exports.handle_register_new_property = function (msg, callback) {
	console.log("Hey Call is here");	
	console.log(msg.property.country);
	var res={};
	var json_responses;
	console.log("In handle request:"+ msg.username);
	mongo.connect(mongoURL,function(connection){
		console.log("Connected to mongo at:"+mongoURL);
		var coll=mongo.collection('property_test');
		coll.insert({"property_test":msg.property},function(err,user){
			if(user){
				console.log("data inserted successfully in products");
				connection.close();
				res.json_responses = {"statusCode" : 200};
				callback(null,res);
			}
			else{
				connection.close();
				console.log("returned false");
				res.json_responses = {"statusCode" : 406};
				callback(null,res);
			}
		});
	});
};
