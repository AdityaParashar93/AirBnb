var ejs 		= require("ejs");
//var mysql		= require('./mysql');
//var bid 		= require('./bid');
var bcrypt 		= require('bcrypt-nodejs');
var mongo 		= require("./mongo");
var ObjectId 	= require('mongodb').ObjectID;
var mq_client 	= require('../rpc/client');
var winston 	= require('winston');
var fs 			= require('fs');
var passport 	= require("passport");
var logDir		= 'log';
var env 		= process.env.NODE_ENV || 'development';
var mongoURL 	= "mongodb://localhost:27017/AdminAirbnbDatabaseMongoDB";


var tsFormat = (new Date()).toLocaleTimeString();
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      filename: 'log/admin.log',
      timestamp: tsFormat,
      level: env === 'development' ? 'debug' : 'info'
    })
  ]
});

var logger_fe = new (winston.Logger)({
	  transports: [
	    new (winston.transports.File)({
	      filename: 'log/fe_admin.log',
	      timestamp: tsFormat,
	      level: env === 'development' ? 'debug' : 'info'
	    })
	  ]
	});

logger.info("ADMIN LOG SESSION STARTS");
logger.warn("THIS IS A SAMPLE WARNING LOG MESSAGE");

exports.logMyEvent = function(req, res) {
	
	var msg_payload = { 
			"username"	 		: req.session.username,
			"clicklog"	 		: req.param("clicklog"),
			"timeSpentOnPage" 	: req.param("timeSpentOnPage")
	};
	
	console.log("LOGGING EVENT IN logMyEvent WITH msg_payload as:");
	console.log(msg_payload);
	logger_fe.info("LOGGING EVENT IN logMyEvent WITH msg_payload as:");
	logger_fe.info(msg_payload);
	res.send({"statusCode" : 200});
	
};


exports.land = function(req, res) {

    ejs.renderFile('./views/admin_views/admin_signin.ejs', function(err, result) {
        // render on success
        if (!err) {
            res.end(result);
            console.log("successfully rendered the signin module");
            logger.info("SUCCESSFULLY RENDERED THE SIGNIN MODULE");
        }
        // render or error
        else {
            res.end('An error occurred');
            logger.warn("AN ERROR OCCURED");
            console.log(err);
        }
    });
};

//Redirects to the homepage
exports.redirectToAdminHomepage = function(req, res) {
	
	if (req.session.username) {

		res.header('Cache-Control',
						'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('./admin_views/successAdminLogin.ejs', {
			username : req.session.username
		});
	} else {
		res.redirect('/');
	}
};

exports.adminApproveUserTasks = function(req, res) {
	
	var username = req.session.username;
	var msg_payload = { 
			"username": username
	};
	
	console.log("ADDING A POST REQUEST ON admin_list_user QUEUE WITH msg_payload AS: ");
	console.log(msg_payload);
	logger.info("ADDING A POST REQUEST ON admin_list_user QUEUE WITH msg_payload as:");
	logger.info(msg_payload);
	
	mq_client.make_request('admin_list_user', msg_payload, function(err, results){
		console.log(results);
		if(err){
			logger.warn("AN ERROR OCCURED IN adminApproveUserTasks");
			throw err;
		}
		else {
			res.send(results);
		}  
	});
};


exports.adminApprovePropertyTask = function(req, res) {
	
	var username = req.session.username;
	var msg_payload = { 
			"username": username
	};
	
	console.log("ADDING A POST REQUEST ON admin_list_property QUEUE WITH msg_payload AS: ");
	console.log(msg_payload);
	logger.info("ADDING A POST REQUEST ON admin_list_property QUEUE WITH msg_payload as:");
	logger.info(msg_payload);
	
	mq_client.make_request('admin_list_property', msg_payload, function(err, results){
		console.log(results);
		if(err){
			logger.warn("AN ERROR OCCURED IN adminApprovePropertyTask");
			throw err;
		}
		else {
			res.send(results);
		}  
	});
};

exports.adminTopTenHostsTask = function(req, res) {
	
	var username = req.session.username;
	var msg_payload = { 
			"username": username
	};
	
	console.log("ADDING A POST REQUEST ON admin_top_ten_hosts QUEUE WITH msg_payload AS: ");
	console.log(msg_payload);
	logger.info("ADDING A POST REQUEST ON admin_top_ten_hosts QUEUE WITH msg_payload as:");
	logger.info(msg_payload);
	
	mq_client.make_request('admin_top_ten_hosts', msg_payload, function(err, results){
		console.log(results);
		if(err){
			logger.warn("AN ERROR OCCURED IN adminTopTenHostsTask");
			throw err;
		}
		else {
			res.send(results);
		}  
	});
};


exports.adminListCityNames = function(req, res) {
	
	var username = req.session.username;
	var msg_payload = { 
			"username": username
	};
	
	console.log("ADDING A POST REQUEST ON admin_list_city_names QUEUE WITH msg_payload AS: ");
	console.log(msg_payload);
	logger.info("ADDING A POST REQUEST ON admin_list_city_names QUEUE WITH msg_payload as:");
	logger.info(msg_payload);
	
	mq_client.make_request('admin_list_city_names', msg_payload, function(err, results){
		console.log(results);
		if(err){
			logger.warn("AN ERROR OCCURED IN adminListCityNames");
			throw err;
		}
		else {
			res.send(results);
		}  
	});
};

exports.adminListCityHosts = function(req, res) {
	
	var username = req.session.username;
	var msg_payload = { 
			"username": username,
			"city" : req.param("city")
	};
	
	console.log("ADDING A POST REQUEST ON admin_list_city_hosts QUEUE WITH msg_payload AS: ");
	console.log(msg_payload);
	logger.info("ADDING A POST REQUEST ON admin_list_city_hosts QUEUE WITH msg_payload as:");
	logger.info(msg_payload);
	
	mq_client.make_request('admin_list_city_hosts', msg_payload, function(err, results){
		console.log(results);
		if(err){
			logger.warn("AN ERROR OCCURED IN adminListCityHosts");
			throw err;
		}
		else {
			res.send(results);
		}  
	});
};

exports.adminApproveUser = function(req, res) {
	
	var msg_payload = { 
			"username"	 	: req.session.username,
			"user_id"		: req.param("user_id")
	
	};
	
	console.log("ADDING A POST REQUEST ON admin_approve_user QUEUE WITH msg_payload as:");
	console.log(msg_payload);
	logger.info("ADDING A POST REQUEST ON admin_approve_user QUEUE WITH msg_payload as:");
	logger.info(msg_payload);
	
	mq_client.make_request('admin_approve_user_queue', msg_payload, function(err, results){
		console.log(results);
		if(err){
			logger.warn("AN ERROR OCCURED IN adminApproveUser");
			throw err;
		}
		else {
			res.send(results);
		}  
	});
	
};


exports.adminApproveProperty = function(req, res) {
	
	var msg_payload = { 
			"username"	 	: req.session.username,
			"user_id"		: req.param("user_id")
	};
	
	console.log("ADDING A POST REQUEST ON admin_approve_property QUEUE WITH msg_payload as:");
	console.log(msg_payload);
	logger.info("ADDING A POST REQUEST ON admin_approve_property QUEUE WITH msg_payload as:");
	logger.info(msg_payload);
	
	mq_client.make_request('admin_approve_property_queue', msg_payload, function(err, results){
		console.log(results);
		if(err){
			logger.warn("AN ERROR OCCURED IN adminApproveProperty");
			throw err;
		}
		else {
			res.send(results);
		}  
	});
	
};



exports.adminTopTenPropertiesAsRevenue = function(req, res) {
	var username = req.session.username;
	var msg_payload = { 
			"username": username
	};
	
	console.log("ADDING A POST REQUEST ON Admin_Top_Ten_Properties QUEUE WITH msg_payload as:");
	console.log(msg_payload);
	logger.info("ADDING A POST REQUEST ON Admin_Top_Ten_Properties QUEUE WITH msg_payload as:");
	logger.info(msg_payload);
	
	mq_client.make_request('admin_top_ten_properties', msg_payload, function(err, results){
		console.log(results);
		if(err){
			logger.warn("AN ERROR OCCURED IN adminTopTenPropertiesAsRevenue");
			throw err;
		}
		else {
			res.send(results);
		}  
	});
	
};

exports.adminCitywiseRevenue = function(req, res) {
	var username = req.session.username;
	var msg_payload = { 
			"username": username
	};
	
	console.log("ADDING A POST REQUEST ON admin_citywise_revenue QUEUE WITH msg_payload as:");
	console.log(msg_payload);
	logger.info("ADDING A POST REQUEST ON admin_citywise_revenue QUEUE WITH msg_payload as:");
	logger.info(msg_payload);
	
	mq_client.make_request('admin_citywise_revenue', msg_payload, function(err, results){
		console.log(results);
		if(err){
			logger.warn("AN ERROR OCCURED IN adminCitywiseRevenue");
			throw err;
		}
		else {
			res.send(results);
		}  
	});
	
};


exports.adminDashboardInfo = function(req, res) {
	var username = req.session.username;
	var msg_payload = { 
			"username": username
	};
	
	console.log("ADDING A POST REQUEST ON admin_dashboard_info QUEUE WITH msg_payload as:");
	console.log(msg_payload);
	logger.info("ADDING A POST REQUEST ON admin_dashboard_info QUEUE WITH msg_payload as:");
	logger.info(msg_payload);
	
	mq_client.make_request('admin_dashboard_info', msg_payload, function(err, results){
		console.log(results);
		if(err){
			logger.warn("AN ERROR OCCURED IN adminCitywiseRevenue");
			throw err;
		}
		else {
			res.send(results);
		}  
	});
	
};

