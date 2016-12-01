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

var express = require('express');
//var mongoose = require('mongoose');
//var Schema = mongoose.Schema;



exports.land = function(req, res) {

    ejs.renderFile('./views/EditProfile.ejs', function(err, result) {
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


exports.edit_profile = function(req, res)
{
    console.log("IN EDIT PROFILE FUNCTION");


    var first_name		= req.param("first_name");
    var last_name		= req.param("last_name");
    var gender	        = req.param("gender");
    var city	        = req.param("city");
    var description     = req.param("description");

    var msg_payload = {
        "first_name": first_name,
        "last_name" : last_name,
        "gender" : gender,
        "city" : city,
        "description" : description,
        "username" : req.session.username
    };
    mq_client.make_request('handle_edit_profile', msg_payload, function(err, results){
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

                else if(result)
                {
                    console.log(result);

                    //collection.remove({username: req.session.username});

                    var saltRounds = 10;
                    var myPlaintextPassword = req.param("inputPassword");
                    //var salt = bcrypt.genSaltSync(saltRounds);
                    var hash = bcrypt.hashSync(myPlaintextPassword);
                    var dt = new Date();
                    var first_name		= req.param("first_name");
                    var last_name		= req.param("last_name");
                    var gender	        = req.param("gender");
                    var city	        = req.param("city");
                    var description     = req.param("description");

                    collection.update(
                        {username: req.session.username},
                        {$set:
                            {
                                "fname": first_name,
                                "lname": last_name,
                                "city": city
                            }}
                    );



                    response={"statusCode" : 200};
                    res.send(response);
                }
            });
        }
    });*/
}