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

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;



exports.land = function(req, res) {
	console.log("********************************here ********************************");
    ejs.renderFile('./views/Profile.ejs', function(err, result) {
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


exports.view_profile = function(req,res)
{

    console.log("IN VIEW PROFILE FUNCTION");

    var username = req.session.username;
    var msg_payload = {
        "username": username
    };
    mq_client.make_request('handle_get_profile_info', msg_payload, function(err, results){
        console.log(results);
        if(err){
            logger.warn("AN ERROR OCCURED IN adminApproveUserTasks");
            throw err;
        }
        else {
            res.send(results);
        }
    });


    /*MongoClient.connect(mongoURL, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
            console.log('Connection established to', mongoURL);

            console.log(req.session.username);
            var collection = db.collection('login');
            collection.find({username: req.session.username}).toArray(function(err,result){
                if(err)
                {
                    //console.log(result);
                    console.log("ERRR------------"+err);
                    //throw err;
                    db.close();
                    return done(err);
                }
                if(!result) {
                    console.log(result);
                    console.log("REsult not found!!!!!!!!-----");
                    return done(null, false);
                }

                else if(result)
                {
                    console.log(result);
                    console.log("Found it  bitch!!!!!!!!-----");
                    //console.log("found user." + result[0]);
                    db.close();
                    //req.session.username = username;1
                    response={"statusCode" : 200, "Result"	:	result};
                    res.send(response);
                    //done(null, result);
                }
            });
        }
    });
*/
}


exports.getBillDetails = function(req,res)
{
    console.log("IN getBillDetails");

    var bills = mongo.collection('bills');
    bills.find({ custName: req.session.username}).toArray(

        function(err, user) {



            json_responses = {
                "Result" : user,
                "statusCode" : 200
            };
            console.log(user);
            res.send(json_responses);
        });
}


exports.change_password = function(req, res)
{
    console.log("IN CHANGE PASSWORD");
}

exports.save_Bill = function(req,res)
{
    property_details = req.param("property");

}