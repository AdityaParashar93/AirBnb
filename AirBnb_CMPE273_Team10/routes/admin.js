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


exports.land = function(req, res) {

    ejs.renderFile('./views/admin_views/admin_signin.ejs', function(err, result) {
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

//Redirects to the homepage
exports.redirectToAdminHomepage = function(req, res) {
	
	console.log("place");
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
	
	console.log("ADDING A POST REQUEST ON admin_list_user WITH msg_payload AS: ");
	console.log(msg_payload);
	
	mq_client.make_request('admin_list_user', msg_payload, function(err, results){
		console.log(results);
		if(err){
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
			"flag" 			: req.param("flag"),
			"user_id"		: req.param("user_id")
	
	};
	
	console.log("ADDING A POST REQUEST ON admin_approve_user QUEUE WITH msg_payload as:");
	console.log(msg_payload);
/*	logger.info("ADDING A POST REQUEST ON bid_queue QUEUE WITH msg_payload as:");
	logger.info(msg_payload);*/
	
	mq_client.make_request('admin_approve_user_queue', msg_payload, function(err, results){
		console.log(results);
		if(err){
			throw err;
		}
		else {
			res.send(results);
		}  
	});
	
};





