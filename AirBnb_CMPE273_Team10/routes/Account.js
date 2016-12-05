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


exports.land = function(req, res) {

    ejs.renderFile('./views/Account.ejs', function(err, result) {
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


exports.store_card_details = function(req,res)
{
    var cardNo = req.param("cardNo");
    var Month = req.param("Month");
    var Year = req.param("Year");
    var CCV = req.param("CCV");

    var login = mongo.collection('login');
    login.update(
        { username: req.session.username},
        { $set:
            {
                "credit_card_details.0.CardNo": cardNo,
                "credit_card_details.0.Month": Month,
                "credit_card_details.0.Year": Year,
                "credit_card_details.0.CCV": CCV
            }
        },
        {upsert:true}
    )
    json_responses = {
        "statusCode" : 200
    };
    res.send(json_responses);

}