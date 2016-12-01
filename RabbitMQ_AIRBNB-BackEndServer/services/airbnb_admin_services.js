var ejs 		= require("ejs");
var mongo 		= require("./mongo");
var ObjectId 	= require('mongodb').ObjectID;
var mongoURL 	= "mongodb://localhost:27017/AirbnbDatabaseMongoDB";

exports.handle_admin_top_ten_hosts_request = function (msg, callback) {
	
	console.log("IN handle_admin_top_ten_hosts_request:");
	console.log(msg);
	
	console.log("LISTENING TO A handle_admin_top_ten_hosts_request WITH msg_payload AS: ");
	
	mongo.connect(mongoURL, function() {
		console.log('CONNECTED TO MONGO COLLECTION property IN handle_admin_top_ten_hosts_request');
		var collection_login = mongo.collection('login');
		var json_response= {};
		
		collection_login.find().sort( { revenue: -1 } ).limit( 5 )
		
		.toArray(function(err, items) {

			json_response = {
				"users" : items
			};
			console.log(json_response);
			callback(null, json_response);

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
				$eq : "APPROVE"
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

exports.handle_admin_list_property_request = function (msg, callback) {

	console.log("IN handle_admin_approve_user_request:");
	console.log(msg);
	var json_responses = {};

	var username 	= msg.username;

	console.log("LISTENING TO A handle_admin_list_property_request WITH msg_payload AS: ");
	console.log(msg);
	
	mongo.connect(mongoURL, function() {
		console.log('CONNECTED TO MONGO IN handle_admin_list_property_request');
		var collection_property = mongo.collection('property');
		var json_response= {};
		
		collection_property.find({
			approval_flag : {
				$eq : false
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


exports.handle_admin_list_city_names_request = function (msg, callback) {

	console.log("IN handle_admin_list_city_names_request:");
	console.log(msg);
	var json_responses = {};

	var username 	= msg.username;

	console.log("LISTENING TO A handle_admin_list_city_names_request WITH msg_payload AS: ");
	console.log(msg);
	
	mongo.connect(mongoURL, function() {
		console.log('CONNECTED TO MONGO IN handle_admin_list_city_names_request');
		var collection_login = mongo.collection('login');
		var json_response= {};
		

		collection_login.distinct("city", 
				{ "city" : { $nin : ["", null] }
		} ,
			function(err, user) {
			if (user) {
				json_responses = {
					"users" : user
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

exports.handle_admin_list_city_hosts_request = function (msg, callback) {

	console.log("IN handle_admin_list_city_hosts_request:");
	console.log(msg);
	
	var username 	= msg.username;
	var city 		= msg.city;

	console.log("LISTENING TO A handle_admin_list_city_hosts_request WITH msg_payload AS: ");
	console.log(msg);
	
	mongo.connect(mongoURL, function() {
		console.log('CONNECTED TO MONGO IN handle_admin_list_city_hosts_request');
		var collection_login = mongo.collection('login');
		var json_response= {};
		
		collection_login.find({
			city : {
				$eq : city
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

exports.handle_admin_top_ten_properties_request = function (msg, callback) {


	console.log("IN handle_admin_top_ten_properties_request:");
	console.log(msg);
	
	console.log("LISTENING TO A handle_admin_top_ten_properties_request WITH msg_payload AS: ");
	
	mongo.connect(mongoURL, function() {
		console.log('CONNECTED TO MONGO COLLECTION property IN handle_admin_top_ten_properties_request');
		var collection_properties = mongo.collection('properties');
		var json_response= {};
		
		collection_properties.find().sort( { revenue: 1 } ).limit( 5 )
		
		.toArray(function(err, items) {

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

exports.handle_admin_approve_property_request = function (msg, callback) {

	console.log("IN handle_admin_approve_property_request:");
	console.log(msg);
	var json_responses = {};
	var flag		= msg.flag;
	var user_id		= msg.user_id;
	var username 	= msg.username;

	console.log("LISTENING TO A handle_admin_approve_property_request WITH msg_payload AS: ");
	console.log(msg);
	
	mongo.connect(mongoURL, function() {
		console.log('CONNECTED TO MONGO IN handle_admin_approve_property_request');
		var collection_property = mongo.collection('property');
		var json_response= {};
		
		collection_property.update({
			_id	: ObjectId(user_id) 
		}, {
			$set : {
				approval_flag : "YES"
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

exports.handle_admin_citywise_revenue_request = function (msg, callback) {

	console.log("IN handle_admin_citywise_revenue_request:");
	console.log(msg);
	
	console.log("LISTENING TO A handle_admin_citywise_revenue_request WITH msg_payload AS: ");
	
	mongo.connect(mongoURL, function() {
		console.log('CONNECTED TO MONGO COLLECTION property IN handle_admin_citywise_revenue_request');
		var collection_properties = mongo.collection('properties');
		var json_response= {};
		
		collection_properties.find().sort( { revenue: 1 } ).limit( 5 )
		
		.toArray(function(err, items) {

			json_response = {
				"users" : items
			};
			console.log(json_response);
			callback(null, json_response);
		});

	});

};