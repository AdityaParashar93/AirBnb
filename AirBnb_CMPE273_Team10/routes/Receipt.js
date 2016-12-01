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
var fs = require('fs');
//var pdf = require('html-pdf');
//var html = fs.readFileSync('./test/businesscard.html', 'utf8');
var options = { format: 'Letter' };

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

//var jsreport = require('jsreport');
//var jsPDF = require('jspdf');
///var phantom = require('node-phantom');
//PDFDocument = require ('pdfkit');
var wkhtmltopdf = require('wkhtmltopdf');

exports.land = function(req, res) {
    console.log("********************************here ********************************");
    ejs.renderFile('./views/Receipt.ejs', function(err, result) {
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



exports.confirm_receipt = function(req,res)
{
    console.log("IN CONFIRM RECEIPT FUNCTION");

    var html;

    ejs.renderFile('./views/Receipt.ejs', function(err, result) {
        // render on success
        if (!err) {
           html = result;
        }
        // render or error
        else {
            throw err;
        }
    });

    try
    {
        wkhtmltopdf(html, { pageSize: 'letter' })
            .pipe(fs.createWriteStream('out.pdf'));
        response={"statusCode" : 200};
        res.send(response);
    }
    catch(e)
    {
        console.log(e.message);
    }

}