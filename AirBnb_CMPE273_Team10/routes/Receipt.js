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

/*    doc = new PDFDocument

    var html;
    ejs.renderFile('./views/Receipt.ejs', function(err, result) {
        // render on success
        if (!err) {
            html = result;
        }
        // render or error
        else {
        }
    });

//# Pipe its output somewhere, like to a file or HTTP response
//# See below for browser usage
    doc.pipe (fs.createWriteStream('output.pdf'));

    doc.addPage()
        .text(html);
//# Embed a font, set the font size, and render some text
    doc
        .fontSize(25)
        .text('Some text with an embedded font!', 100, 100)

//# Add another page
    doc.addPage()
        .fontSize(25)
        .text('Here is some vector graphics...', 100, 100)

//# Draw a triangle
    doc.save()
        .moveTo(100, 150)
        .lineTo(100, 250)
        .lineTo(200, 250)
        .fill("#FF3300")

//# Apply some transforms and render an SVG path with the 'even-odd' fill rule
    doc.scale(0.6)
        .translate(470, -380)
        .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
        .fill('red', 'even-odd')
        .restore()

//# Add some text with annotations
    doc.addPage()
        .fillColor("blue")
        .text('Here is a link!', 100, 100)

    .link(100, 100, 160, 27, 'http://google.com/');

//# Finalize PDF file
    doc.end()*/



    /*var html;

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
    }*/


    MongoClient.connect(mongoURL, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
            console.log('Connection established to', mongoURL);

            console.log(req.session.username);
            var collection = db.collection('temp');
            collection.find({username: 'hiral@hiral.com'}).toArray(function(err,result){
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
                    console.log(result[0]);

                    console.log(result[0].trips[0].house_info);


                    console.log(result[0].trips[0].billing_info);
                    db.close();
                }
            });
        }
    });


}