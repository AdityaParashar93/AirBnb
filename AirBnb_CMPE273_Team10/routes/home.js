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
	            	 filename: 'log/host.log',
	            	 timestamp: tsFormat,
	            	 level: env === 'development' ? 'debug' : 'info'
	             })
	             ]
});

logger.info("HOST LOG SESSION STARTS");
logger.warn("THIS IS A SAMPLE WARNING LOG MESSAGE");

exports.land = function(req, res) {

	ejs.renderFile('./views/signin.ejs', function(err, result) {
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

exports.registerNewUser = function(req, res) {
	
	var saltRounds = 10;
	var myPlaintextPassword = req.param("inputPassword");
	//var salt = bcrypt.genSaltSync(saltRounds);
	var hash = bcrypt.hashSync(myPlaintextPassword);
	var dt = new Date();
	var first_name		= req.param("first_name");
	var last_name		= req.param("last_name");
	var inputUsername	= req.param("inputUsername");
	var dob 			= req.param("dob");
	var inputPassword	= hash;
	
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
			"dob"                   : dob,
			"approve_flag"			: "NO"
	
	};

	console.log("ADDING A POST REQUEST register_new_user_queue QUEUE WITH msg_payload as:");
	console.log(msg_payload);
	logger.info("ADDING A POST REQUEST ON register_new_user_queue QUEUE WITH msg_payload as:");
	logger.info(msg_payload);
	
	mq_client.make_request('register_new_user_queue', msg_payload, function(err, results){
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


exports.register_new_property= function(req, res) {
	
	var msg_payload={"property":req.param("property_input")};
	console.log(req.param("property_input").owner);
	if(req.session.username){
	var msg_payload={"property":req.param("property_input"),"property_owner":req.session.username};
	
	console.log(req.session.username+"trying to host"+msg_payload);
	
	mq_client.make_request('register_new_property', msg_payload, function(err, results){
		console.log("Results: \n\n\n\n"+results);
		if(err){
			throw err;
		}
		else {
			res.send(results);
		}  
	});
	}else{
		var result={json_responses:{statusCode:405}};
		res.send(result);
	}
};
exports.host_confirmation=function(req,res){
	var msg_payload={"username":req.session.username};
	mq_client.make_request('host_confirmation', msg_payload, function(err, results){
		console.log("Results: \n\n\n\n"+results);
		if(err){
			throw err;
		}
		else {
			console.log(results);
			res.send(results);
		}  
	});
};

exports.send_host_approval=function(req,res){
	console.log(req.session.username);
	var msg_payload={"username":req.session.username};
	mq_client.make_request('send_host_approval', msg_payload, function(err, results){
		if(err){
			throw err;
		}
		else{
			if(results.statusCode==200){
				console.log("host approved ",results);	
			}
			else{
				console.log("Error");
			}
		}
		
	});
	
};

exports.submit_review=function(req,res){
	var temp=req.param("review");
	temp.user=req.session.username;
	console.log(temp);
	var msg_payload={"id":req.param("id"),"review":temp};
	mq_client.make_request('submit_review', msg_payload, function(err, results){
		console.log("Results: \n\n\n\n"+results);
		if(err){
			throw err;
		}
		else {
			console.log(results);
			res.send(results);
		}  
	});
};

