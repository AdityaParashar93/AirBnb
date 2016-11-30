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