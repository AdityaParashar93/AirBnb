var mq_client 	= require('../rpc/client');
var winston 	= require('winston');
var env 		= process.env.NODE_ENV || 'development';
var tsFormat 	= (new Date()).toLocaleTimeString();
var logger 		= new (winston.Logger)({
	transports: [
	             new (winston.transports.File)({
	            	 filename: 'log/property.log',
	            	 timestamp: tsFormat,
	            	 level: env === 'development' ? 'debug' : 'info'
	             })
	             ]
		});
//redis
var redis = require('redis');
var redisclient = redis.createClient(6379, '127.0.0.1');


exports.getPropertyList = function(req, res){
	
	var city = req.param("city");
	var fromDate = req.param("fromDate");
	var toDate = req.param("toDate");
	var guest = req.param("guest");
	
	var msg_payload = { 
			"city" 					: city,
			"fromDate"				: fromDate,
			"toDate"				: toDate,
			"guest"					: guest,
			"username"				: req.session.username
	};
	
	console.log(msg_payload);
	logger.info("Adding a request on property_list_queue QUEUE WITH msg_payload as:");
	logger.info(msg_payload);
	
	mq_client.make_request('property_list_queue', msg_payload, function(err, results){
		console.log(results);
		if(err){
			logger.warn("AN ERROR OCCURED IN registerNewUser");
			throw err;
		}
		else {
			req.session.properties = results;
			res.send(results);
		}  
	});
	
	
};
	
	exports.propertyClicks = function(req, res){
	
	var property = req.param("property");

	
	var msg_payload = { 
			"property" : property
	};
	
	console.log(msg_payload);
	logger.info("Adding a request on property_clicks_queue QUEUE WITH msg_payload as:");
	logger.info(msg_payload);
	
	mq_client.make_request('property_clicks_queue', msg_payload, function(err, results){
		console.log(results);
		if(err){
			logger.warn("AN ERROR OCCURED IN registerNewUser");
			throw err;
		}
		else {
			res.send(results);
		}  
	});
};


exports.bookProperty = function(req, res){
	
	
	var property = req.param("property");
	var username = req.session.username;
	var bookFromDate = req.param("bookFromDate");
	var bookToDate = req.param("bookToDate");
	var bookGuests = req.param("bookGuests");
	
	console.log(":::"+bookToDate);
	console.log(":::"+bookFromDate);
	
	var timeDiff = Math.abs(new Date(bookToDate).getTime() - new Date(bookFromDate).getTime());
	var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
	
	console.log(diffDays);

	var msg_payload = { 
			"property" : property,
			"username" : username,
			"bookToDate" : bookToDate,
			"bookFromDate" : bookFromDate,
			"bookGuests" : bookGuests,
			"stayDuration" : diffDays
	};
	
	console.log(msg_payload);
	logger.info("Adding a request on property_book_queue QUEUE WITH msg_payload as:");
	logger.info(msg_payload);
	
	mq_client.make_request('property_book_queue', msg_payload, function(err, results){
		console.log(results);
		if(err){
			logger.warn("AN ERROR OCCURED IN booking property");
			throw err;
		}
		else {
			res.send(results);
		}  
	});
};