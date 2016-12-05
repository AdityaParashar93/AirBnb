var ejs = require("ejs");
var mongo = require("./mongo");
var ObjectId = require('mongodb').ObjectID;
var mongoURL = "mongodb://localhost:27017/AirbnbDatabaseMongoDB";

exports.handle_property_clicks_request = function(msg, callback) {

	console.log("IN handle_property_clicks_request:");
	console.log(msg);
	var json_responses = {};
	var property_title = msg.property.property_title;
	var property_id = msg.property._id;

	mongo.getConnection(mongoURL, function() {

		console.log('CONNECTED TO MONGO IN handle_get_property_list_request');
		console.log('updating clicks');

		var propertyClicks = mongo.collection('property');
		var json_response = {};
		console.log(msg.property);
		propertyClicks.update({
			property_title : property_title
		}, {
			$inc : {
				clicks : 1
			}
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
	});
};


var updateUserRevenue = function(username,property_revenue){
	mongo.getConnection(mongoURL, function() {
		console.log('CONNECTED TO MONGO IN handle_get_property_list_request');
		var property = mongo.collection('login');
		var json_response = {};

		property.update({
			username : username
		},{ $set : {
			revenue : property_revenue
		}
		}, function(err, user) {
			if (user) {
				console.log("revenue added");
			} else {
				console.log("revenue update error");
			}
		});
	});
};

var updateUserHousingInfo = function(username,property,bookToDate,bookFromDate,bookGuests,stayDurations){
	mongo.getConnection(mongoURL, function() {
		console.log('CONNECTED TO MONGO IN handle_get_property_list_request');
		var login = mongo.collection('login');
		var json_response = {};
	});
	};
			


var updateUserBillingInfo = function(username,property,bookToDate,bookFromDate,bookGuests,stayDurations){
	mongo.getConnection(mongoURL, function() {
		console.log('CONNECTED TO MONGO IN handle_get_property_list_request');
		var property = mongo.collection('login');
		var json_response = {};

		var json = {
				transcation_id : ""
		};
		property.update({
			username : username
		},{ $push : {
			billing_info : json
		}
		}, function(err, user) {
			if (user) {
				console.log("billinginfo added");
			} else {
				console.log("billinginfo update error");
			}
		});
	});
};


var updateUserTrips = function(username,property,bookToDate,bookFromDate,bookGuests){
	mongo.getConnection(mongoURL, function() {
		console.log('CONNECTED TO MONGO IN handle_get_property_list_request');
		var login = mongo.collection('login');
		var json_response = {};

		var json3 = {
				transcation_id : ""
		};
		
		var json2 = {
				shared_amenities 	 : property.shared_amenities,
				shared_spaces		 : property.shared_spaces,
				number_of_bedrooms   : property.number_of_beds,
				room_type 			: property.room_type,
				number_of_beds : property.number_of_beds,
				number_of_guests : bookGuests,
				property_title : property.property_title,
				property_description : property.property_description,
				price : property.price,
				bid_status : property.bid_status,
				approval_flag : property.approval_flag			
		
			};
		
		
		var json = {
			to_date 	 : bookToDate,
			from_date		 : bookFromDate,
			listing_address1   : property.street_address,
			listing_address2 	: "",
			listing_city : property.city,
			listing_state : property.state,
			listing_zip_code : property.zip_code,
			host_phone_number : "",
			house_info : [json2],
			billing_info :[json3],
		};
		
		login.update({
			username : username
		},{ $push : {
			trips : json
		}
		}, function(err, user) {
			if (user) {
				console.log("trip updated ");
			} else {
				console.log("trips update error");
			}
		});
	});
};



var createBill = function(username,property,bookToDate,bookFromDate,bookGuests,stayDuration,total_cost){
	mongo.getConnection(mongoURL, function() {
		console.log('CONNECTED TO MONGO IN handle_get_property_list_request');
		var bills = mongo.collection('bills');
		var json_response = {};
		
		bills.insert({
		 	custName : username,
		 	property_owner : property.property_owner,
			city : property.city,
			address : property.street_address,
			property_name : property.property_title,
			room_type : property.room_type,
			number_of_guests : bookGuests,
			dateFrom : bookFromDate,
			dateTo : bookToDate,
			stayDuration : stayDuration,
			securityDeposit : 200,
			total_cost : total_cost
		}, function(err, user) {
			if (user) {
				console.log("bill generated");
			} else {
				console.log("bill error");
			}
		});
	});
};

exports.handle_property_book_request = function(msg, callback) {
	console.log("IN handle_property_book_request:");
	console.log(msg);
	
	var json_responses = {};
	var property = msg.property;
	var username = msg.username;
	var property_title = msg.property.property_title;
	var property_id = msg.property._id;
	var property_revenue = msg.property.revenue;
	var property_price = msg.property.price;

	var bookToDate = msg.bookToDate;
	var bookFromDate = msg.bookFromDate;
	var stayDuration = msg.stayDuration;
	var bookGuests = msg.bookGuests;

	property_revenue = property_revenue + (property_price * stayDuration * bookGuests); 

	var total_cost = (property_price * stayDuration * bookGuests);
	console.log("property_revenue::"+property_revenue);
	
	updateUserRevenue(username,property_revenue);
	updateUserTrips(username,property,bookToDate,bookFromDate,bookGuests,stayDuration);
	createBill(username,property,bookToDate,bookFromDate,bookGuests,stayDuration,total_cost);
	//updateUserBillingInfo(username,property,bookToDate,bookFromDate,bookGuests,stayDuration);
	//updateUserHousingInfo(username,property,bookToDate,bookFromDate,bookGuests,stayDuration);
	
	mongo.getConnection(mongoURL, function() {

		console.log('CONNECTED TO MONGO IN handle_get_property_list_request');
		var property = mongo.collection('property');
		var json_response = {};

		console.log(msg.property);

		property.update({
			property_title : property_title
		},{ $set : {
			revenue : property_revenue
		}
		}, function(err, user) {
			if (user) {
				json_responses = {
						"statusCode" : 200
					};
					callback(null, json_responses);

				} else {
					console.log("FALSE");
					
					json_responses = {
						"statusCode" : 401
					};
					callback(null, json_responses);
				}

		});
	});
};


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
	
	mongo.getConnection(mongoURL, function() {
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
					reviews	: {},
					profile_image	: "",
					credit_card_details	: {},
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

exports.handle_register_new_property = function(msg, callback) {
	console.log("Hey Call is here");
	console.log(msg.property);

	var res = {};
	var json_responses;
	console.log("In handle request:" + msg.property_owner);
	mongo.getConnection(mongoURL, function(connection) {
		console.log("Connected to mongo at:" + mongoURL);
		var coll = mongo.collection('property');
		coll.insert({
			"property_owner" : msg.property_owner,
			"availability" : msg.property.availability,
			"revenue" : msg.property.revenue,
			"ratings" : msg.property.ratings,
			"country" : msg.property.country,
			"street_address" : msg.property.street_address,
			"city" : msg.property.city,
			"state" : msg.property.state,
			"zip_code" : msg.property.zip_code,
			"latitude" : msg.property.co_ordinates.lat,
			"longitude" : msg.property.co_ordinates.lng,
			"room_type" : msg.property.room_type,
			"number_of_beds" : msg.property.number_of_beds,
			"number_of_guests" : msg.property.number_of_guests,
			"shared_amenities" : msg.property.shared_amenities,
			"list_time" : new Date(),
			"shared_spaces" : msg.property.shared_spaces,
			"property_images" : msg.property.property_images,
			"property_title" : msg.property.property_title,
			"property_description" : msg.property.property_description,
			"price" : msg.property.property_price,
			"cc_num" : msg.property.cc_num,
			"bid_status" : msg.property.bid_status,
			"bidStay" : 4,
			"approval_flag":false,
			"review":[]
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
	
	if(msg.username == null){
		msg.username = "Guest";
	}
	
	mongo.getConnection(mongoURL, function(db) {

		console.log('CONNECTED TO MONGO IN handle_get_property_list_request');
		var listing = mongo.collection('property');
		var json_response= {};

		
		console.log(msg.city);
		console.log(msg.guest);
		listing.find({ property_owner:{$ne: msg.username}, city: msg.city, number_of_guests: guest , approval_flag : true}).toArray(

				function(err, user) {

					json_responses = {

						"properties" : user
					};
					console.log(user);
					callback(null, json_responses);


			});
	});	
};





exports.handle_submit_review = function(msg, callback){
	mongo.getConnection(mongoURL, function() {
		console.log(msg);
		console.log('CONNECTED TO MONGO IN handle_get_property_list_request');
		var property = mongo.collection('property');
		var json_response = {};

		property.update({
			property_title : msg.id
		},{ $push : {
			review : msg.review
		}},
		{
			upsert:false
		}
		, function(err, user) {
			if (user) {
				console.log("review added");
				json_responses={"statusCode":"200"};
				callback(null, json_responses);
			} else {
				console.log("review update error");
				json_responses={"statusCode":"404"};
				callback(null, json_responses);
			}
		});
	});
	callback(null, json_responses);
};