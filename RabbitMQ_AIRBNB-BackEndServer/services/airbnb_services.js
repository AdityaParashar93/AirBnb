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


exports.handle_register_new_property = function(msg, callback) {
	console.log("Hey Call is here");
	console.log(msg.property);

	var res = {};
	var json_responses;
	console.log("In handle request:" + msg.property_owner);
	mongo.connect(mongoURL, function(connection) {
		console.log("Connected to mongo at:" + mongoURL);
		var coll = mongo.collection('property');
		coll.insert({
			"property_owner" : msg.property_owner,
			"availability_to" : msg.property.availability.to,
			"availability_from" : msg.property.availability.from,
			"revenue" : msg.property.revenue,
			"ratings" : msg.property.revenue,
			"owner" : msg.username,
			"country" : msg.property.revenue,
			"street_address" : msg.property.revenue,
			"city" : msg.property.city,
			"state" : msg.property.state,
			"zip_code" : msg.property.zip_code,
			"latitude" : msg.property.co_ordinates.lat,
			"longitude" : msg.property.co_ordinates.lng,
			"room_type" : msg.property.room_type,
			"number_of_beds" : msg.property.number_of_beds,
			"number_of_guests" : msg.property.number_of_guests,
			"shared_amenities" : msg.property.shared_amenities,
			"shared_spaces" : msg.property.shared_spaces,
		//"property_images" : [],
			"property_title" : msg.property.property_title,
			"property_description" : msg.property.property_description,
			"price" : msg.property.property_price,
			"cc_num" : msg.property.cc_num,
			"bid_status" : msg.property.bid_status,
			"approval_flag":false
		}, function(err, user) {
			if (user) {
				console.log("data inserted successfully in products");
				connection.close();
				res.json_responses = {
					"statusCode" : 200
				};
				callback(null, res);
			} else {
				connection.close();
				console.log("returned false");
				res.json_responses = {
					"statusCode" : 406
				};
				callback(null, res);
			}
		});
	});
};

exports.handle_get_property_list_request = function(msg,callback){
	

	console.log("IN handle_property_list_request:");
	console.log(msg);
	var json_responses = {};
	var city		= msg.location;
	var guest		= (msg.guest).toString;
	var fromDate 	= msg.fromDate;
	var toDate      = msg.toDate;
	
	mongo.connect(mongoURL, function() {
		console.log('CONNECTED TO MONGO IN handle_get_property_list_request');
		var listing = mongo.collection('property');
		var json_response= {};
		
		console.log(msg.city);
		console.log(msg.guest);
		listing.find({ city: msg.city, number_of_guests: guest }).toArray(

				function(err, user) {

					json_responses = {
						"properties" : user
					};
					console.log(user);
					callback(null, json_responses);
			});
	});	
};