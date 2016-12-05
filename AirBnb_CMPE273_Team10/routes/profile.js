var ejs         = require("ejs");
//var mysql     = require('./mysql');
//var bid       = require('./bid');
var bcrypt      = require('bcrypt-nodejs');
var mongo       = require("./mongo");
var ObjectId    = require('mongodb').ObjectID;
var mq_client   = require('../rpc/client');
var winston     = require('winston');
var fs          = require('fs');
var passport    = require("passport");
var logDir      = 'log';
var env         = process.env.NODE_ENV || 'development';
var mongoURL    = "mongodb://localhost:27017/AirbnbDatabaseMongoDB";

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
  /*  mq_client.make_request('handle_get_profile_info', msg_payload, function(err, results){
        console.log(results);
        if(err){
            logger.warn("AN ERROR OCCURED IN adminApproveUserTasks");
            throw err;
        }
        else {
            res.send(results);
        }
    });*/


    MongoClient.connect(mongoURL, function (err, db) {
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
                    response={"statusCode" : 200, "Result"  :   result};
                    res.send(response);
                    //done(null, result);
                }
            });
        }
    });
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
    req.session.billDetails = property_details;
    json_responses = {
        "statusCode" : 200
    };

    res.send(json_responses);

}


exports.update_ImgPath = function(req,res)
{
    var imgPath = req.param("imgURL");

    console.log("IN update_ImgPath");
    var login = mongo.collection('login');
    login.update(
        { username: req.session.username},
        { $set: { "imgPath": imgPath} },
        {upsert:true}
    )

    json_responses = {
        "statusCode" : 200
    };
    res.send(json_responses);

}

exports.deleteTrip=function(req,res){		
    var username=req.body.username;		
    var city=req.body.city;		
    var property_title=req.body.property_title;		
    msg_payload={"username": username,"city":city,"property_title":property_title,"actionType":"deleteTrip"};		
    winston.info('making call to change_trip_data queue for deleting trip');		
    mq_client.make_request('change_trip_data',msg_payload,function(err,result){		
        winston.info( 'inside callback for change_trip_data queue for deleting trip');		
        if(err){		
            winston.info("error returned for deleting data");		
            res.send({"success":'false'});		
        }		
        else{		
            if(result.success){		
                    winston.info("inside callback:: successfully deleted the trip");		
                    res.send({"success":'true'});		
             }		
             else{		
                 winston.info("error returned for deleting data");		
                 res.send({"success":'false'});		
             }		
        }		
    });		
};		
exports.editTrip = function(req,res){		
    winston.info("inside client:: profile.js route file:: editTrip function");		
    var username=req.body.username;		
    var property_title=req.body.property_title;		
    var city=req.body.property_city;		
    var newToDate=req.body.newToDate;		
    var newFromDate=req.body.newFromDate;		
    winston.info("to date ", newToDate);		
    winston.info("from date ",newFromDate)		
    winston.info(city);		
    winston.info(property_title);		
    msg_payload={"username":username,"property_title":property_title,"city":city,"newToDate":newToDate,"newFromDate":newFromDate,"actionType":"editTrip"};		
    winston.info("makinf call to change_trip_data queue:: editTrip function");		
    mq_client.make_request('change_trip_data',msg_payload,function(err,result){		
         winston.info( 'inside callback for change_trip_data queue for deleting trip');		
         var response={};		
        if(err){		
            winston.info("error returned for editing trip data");		
            res.send({"success":false});		
        }		
        else{		
              winston.info("returned from rabbitmq server; inside callback profile.js");		
            winston.info("user details ercieved: ", result.trips);		
        if(result.trips!=null){		
            var res_final=new Array();		
            var all_trips=result.trips;		
            winston.info("all_trips:: ", all_trips);		
            var i=0;		
            for (var x=0;x<all_trips.length;x++){		
                res_final.push(all_trips[x]);		
            }		
            winston.info("response sent to the controller: ", res_final);		
            res.send({"response":res_final,"success":true});		
        }		
        else{		
            winston.info("result not received from the rabbitMq server");		
            res.send({"response":[],"success":false});		
        }		
        }		
    });		
};



exports.tripListings = function(req,res){
		
    ejs.renderFile('./views/tripListings.ejs',function(err,result){
        if(!err){
            res.end(result);
            console.log("successfully landed to tripListings page");
        }
        else{
            res.end('Error in displaying tripListings page');
            conssole.log(err);
        }
    })

};

exports.getTripListing = function(req,res){

    //define variables that will be passed  to msg_payload
    winston.info("session username:", req.body.username);
    msg_payload={'username':req.body.username,'tripType':'futureTrips'}
    mq_client.make_request('get_listings', msg_payload, function(err,result){

        winston.info("returned from rabbitmq server; inside callback profile.js");
        winston.info("user details ercieved: ", result.trips);

        if(result.trips!=null){
            var res_final=new Array();
            var all_trips=result.trips;
            winston.info("all_trips:: ", all_trips);
            var i=0;

            for (var x=0;x<all_trips.length;x++){
                res_final.push(all_trips[x]);
            }
            winston.info("response sent to the controller: ", res_final);
            res.send({"response":res_final});
        }
        else{
            winston.info("result not received from the rabbitMq server");
        }
    });
};

exports.previousTrip=function(req,res){

     ejs.renderFile('./views/previousTrip.ejs',function(err,result){
        if(!err){
            res.end(result);
            console.log("successfully landed to tripListings page");
        }
        else{
            res.end('Error in displaying tripListings page');
            conssole.log(err);
        }
    })
};

exports.getPreviousTrip= function(req,res){

    //define variables that will be passed  to msg_payload
    winston.info("session username:", req.body.username);
    msg_payload={'username':req.body.username,'tripType':'previousTrips'}
    mq_client.make_request('get_listings', msg_payload, function(err,result){

        winston.info("returned from rabbitmq server; inside callback profile.js");
        winston.info("user details ercieved: ", result.trips);

        if(result.trips!=null){
            var res_final=new Array();
            var all_trips=result.trips;
            winston.info("all_trips:: ", all_trips);
            var i=0;

            for (var x=0;x<all_trips.length;x++){
                res_final.push(all_trips[x]);
            }
            winston.info("response sent to the controller: ", res_final);
            res.send({"response":res_final});
        }
        else{
            winston.info("result not received from the rabbitMq server");
        }
    });
};

exports.hostListings=function(req,res){

    ejs.renderFile('./views/hostListing.ejs',function(err,result){
        if(!err){
            res.end(result);
            console.log("successfully landed to hostListing page");
        }
        else{
            res.end('Error in displaying hostListing page');
            console.log(err);
        }
});
};

exports.hostReservations=function(req,res){

    ejs.renderFile('./views/hostReservation.ejs',function(err,result){
        if(!err){
            res.end(result);
            console.log("successfully landed to hostReservation page");
        }
        else{
            res.end('Error in displaying hostReservation page');
            console.log(err);
        }
});
};

exports.getHostListings=function(req,res){

        winston.log("Inside Profile.js:: getHostListings method");
        winston.info("session username:", req.body.username);
        msg_payload={'username':req.body.username,"listingType":"hostListing"};
        mq_client.make_request('get_host_listing',msg_payload,function(err,result){

            winston.info("inside route:: profile.js:: getHostListings:: returned from rabbitmq server");
            winston.info("result received::", result);
            var res_final=result.property;
            res.send({"property":res_final});
        });

};

exports.getHostReservations= function(req,res){

        winston.info("Inside profile.js::getHostReservations method");
        winston.info("session username:",req.body.username);
        msg_payload={'username':req.body.username,"listingType":"hostReservation"};

        mq_client.make_request('get_host_listing',msg_payload,function(err,result){
             winston.info("inside route:: profile.js:: getHostReservations:: returned from rabbitmq server");
            winston.info("result received::", result);
            var res_final=result.bills;
            res.send({"bills":res_final});

        })
};

exports.renderAccount = function(req,res){

        ejs.renderFile("./views/Account.ejs",function(err,result){

            if(!err){
            res.end(result);
            console.log("successfully landed to Account page");
        }
        else{
            res.end('Error in displaying Account page');
            console.log(err);
        }
        });
};