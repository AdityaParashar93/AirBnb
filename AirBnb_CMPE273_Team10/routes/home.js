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
var mongoURL 	= "mongodb://localhost:27017/AirbnbDatabaseMongoDB";

var tsFormat 	= (new Date()).toLocaleTimeString();
var logger 		= new (winston.Logger)({
	transports: [
	             new (winston.transports.File)({
	            	 filename: 'log/results.log',
	            	 timestamp: tsFormat,
	            	 level: env === 'development' ? 'debug' : 'info'
	             })
	             ]
});

exports.land = function(req, res) {

	ejs.renderFile('./views/signin.ejs', function(err, result) {
		// render on success
		if (!err) {
			res.end(result);
			console.log("successfully rendered the signin module");
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
};

exports.registerNewUser = function(req, res) {
	
	var saltRounds = 10;
	var myPlaintextPassword = req.param("inputPassword");
	//var salt = bcrypt.genSaltSync(saltRounds);
	var hash = bcrypt.hashSync(myPlaintextPassword);
	var dt = new Date();
	var first_name		= req.param("first_name");
	var last_name		= req.param("last_name");
	var inputUsername	= req.param("inputUsername");
	var inputPassword	= hash;
	var dob = req.param("dob");
	var msg_payload = { 
			"saltRounds"			: saltRounds,
			"myPlaintextPassword"	: req.param("inputPassword"),
			"salt"					: bcrypt.genSaltSync(saltRounds),
			"hash"					: bcrypt.hashSync(myPlaintextPassword),
			"dt"					: dt,
			"first_name"			: req.param("first_name"),
			"last_name"				: req.param("last_name"),
			"inputUsername"			: req.param("inputUsername"),
			"inputPassword"			: hash,
			"dob"                   :dob
	
	};
	console.log(dob);
	console.log("ADDING A POST REQUEST register_new_user_queue QUEUE WITH msg_payload as:");
	console.log(msg_payload);
	logger.info("ADDING A POST REQUEST ON register_new_user_queue QUEUE WITH msg_payload as:");
	logger.info(msg_payload);
	
	mq_client.make_request('register_new_user_queue', msg_payload, function(err, results){
		console.log(results);
		if(err){
			throw err;
		}
		else {
			res.send(results);
		}  
	});
};



//Redirects to the homepage
exports.redirectToHomepage = function(req, res) {

	logger.info("THIS PART CHECKS IF THE SESSION IS VALID BEFORE REDIRECTING");
	if (req.session.username) {

		res.header('Cache-Control',
						'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("successLogin", {
			username : req.session.username
		});
	} else {
		res.redirect('/');
	}
};

exports.logout = function(req, res) {
	console.log("IN DESTROY SESSION FUNCTION");
	logger.info("IN DESTROY SESSION FUNCTION");
	req.session.destroy();
	res.redirect('/');
};
exports.subscribe=function(req,res){
	console.log("inside subscriptions");
	var subscriber_email=req.param("subscriber_email");
	console.log(subscriber_email);
	mongo.connect(mongoURL, function() {
		console.log('CONNECTED TO MONGO');
		var subscriber={subscriber:subscriber_email};
		var collection = mongo.collection('subcription');
		collection.insert(subscriber,function(err,result){
			if(err){
				console.log(err);
			}
			else{
				console.log("data inserted into the db");
				response={'statusCode':200};
				//res.send(response);
			}
		});
	});
};