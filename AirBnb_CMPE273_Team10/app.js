/**
 * Module dependencies.
 */
var express			= require('express');
var routes			= require('./routes');
var http			= require('http');
var path			= require('path');
var LocalStrategy 	= require("passport-local").Strategy;
var passport 		= require('passport');
require('./routes/passportj')(passport);
var property 		= require('./routes/property');
var bidding 		= require('./routes/bidding');

//Routes files below
var user 			= require('./routes/user');
var index 			= require('./routes/index');
var home 			= require('./routes/home');
var profile 		= require('./routes/profile');
var admin 			= require('./routes/admin');
var editprofile 	= require('./routes/EditProfile');
var account 		= require('./routes/Account');
var receipt 		= require('./routes/Receipt');
var host_dashboard 	= require('./routes/host_dashboard');

var clickPage 		= require('./routes/clicksPerPage');
var clickProperty 	= require('./routes/propertyClicks');
var traceBid 		= require('./routes/traceBidding');
var traceUser 		= require('./routes/traceUser');

//URL for the sessions collections in mongoDB
var mongoSessionConnectURL 	= "mongodb://localhost:27017/AirbnbDatabaseMongoDB";
var expressSession 			= require("express-session");
var mongoStore 				= require("connect-mongo/es5")(expressSession);
var mongo 					= require("./routes/mongo");
//redis
var redis 			= require('redis');
var redisStore 		= require('connect-redis')(expressSession);
var client 			= redis.createClient('6379','127.0.0.1'); //creates a new client
console.log('redis on:127.0.0.1:6379 ');
client.on('connect', function() {
    console.log('connected to redis.');
});

//redis test
client.set('Testing', 'Hello Sagar.', function(err, reply) {
    console.log(reply);
});
client.get('framework', function(err, reply) {
    console.log(reply);
});


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon("public/images/favicon.png"));
app.use(express.logger('dev'));
app.use(express.methodOverride());
app.use(express.json());
app.use(express.urlencoded());

app.use(expressSession({
	secret : 'cmpe273_AIRBNB_SECRET_STRING',
	resave : false, // don't save session if unmodified
	saveUninitialized : false, // don't create session until something stored
	duration : 30 * 60 * 1000,
	activeDuration : 5 * 60 * 1000,
	store : new mongoStore({
		url : mongoSessionConnectURL
	})
}));

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.use(passport.initialize());
app.use(passport.session());

//POST
app.post('/registerNewUser', home.registerNewUser);
app.post('/signin', function(req, res, next) {
	console.log("INSIDE POST METHOD signin_user");
	console.log(req.body);
	passport.authenticate('signin_user', function(err, user) {
		if (err) {
			console.log(err);
		}
		if (user) {
			req.session.username = user.username;
			console.log(req.session.username);
		if(user.credit_card_details){
				req.session.cc_num = true;
			}	
			else{
				req.session.cc_num = false;
			}			
			console.log('BEFORE SENDING USER');
			console.log(user);
			res.send({
				'statusCode' : 200,
				'username' : user.username,
				'cc_num' : req.session.cc_num
				
			});
		} else {
			res.send({
				'statusCode' : 401
			});
		}

		console.log("USER SESSION STARTED IN PASSPORT");
	})(req, res, next);
});

app.post('/afterAdminLogin', function(req, res, next) {
	console.log("INSIDE POST METHOD signin_admin");
	console.log(req.body);
	passport.authenticate('signin_admin', function(err, user) {
		if (err) {
			console.log(err);
		}
		if (user) {
			req.session.username = user.username;
			console.log(req.session.username);
			console.log('BEFORE SENDING ADMIN');
			res.send({
				'statusCode' : 200
			});
		} else {
			res.send({
				'statusCode' : 401
			});
		}

		console.log("ADMIN SESSION STARTED IN PASSPORT");
	})(req, res, next);
});

app.post('/logout', home.logout);
app.post('/adminApproveUser', admin.adminApproveUser);
app.post('/adminApproveProperty', admin.adminApproveProperty);
app.post('/logMyEvent', admin.logMyEvent);

app.post('/register_new_property', home.register_new_property);
app.post('/adminListCityHosts', admin.adminListCityHosts);
app.post('/adminHostAnalytics', admin.adminHostAnalytics);

app.post('/view_profile', profile.view_profile);
app.post('/edit_profile', editprofile.edit_profile);
app.post('/change_password', profile.change_password);
app.post('/confirm_receipt', receipt.confirm_receipt);
app.post('/getPropertyList', property.getPropertyList);
app.post('/propertyClicks', property.propertyClicks);
app.post('/bookProperty', property.bookProperty);

app.post('/host_confirmation', home.host_confirmation);
app.post('/send_host_approval',home.send_host_approval);
app.post('/submit_review',home.submit_review);
app.post('/getBillDetails', profile.getBillDetails);
app.post('/save_Bill', profile.save_Bill);
app.post('/get_bill_data', receipt.get_bill_data);
app.post('/update_ImgPath', profile.update_ImgPath);
app.post('/store_card_details',account.store_card_details);

//trip tab inside my profile
app.get('/trip',profile.tripListings);
app.post('/getTripListing',profile.getTripListing);
app.get('/previousTrip',profile.previousTrip);
app.post('/getPreviousTrip',profile.getPreviousTrip);
app.post('/delete_trip',profile.deleteTrip);		
app.post('/editTrip',profile.editTrip);
// Your Listing tab in user profile

app.get('/hostListings',profile.hostListings);  //renders your listing page 
app.post('/getHostListings',profile.getHostListings); //renders get details of Host Listing page
app.post('/getHostReservations',profile.getHostReservations); //renders host reservations details
app.get('/hostReservations',profile.hostReservations); // renders the page for hostReservations
app.post('/bidProperty', bidding.bidProperty);
	app.get('/getHighestBidders', bidding.getHighestBidders);
//GET
app.get('/getProperties',function(req,res){
	res.send(req.session.properties);
});


app.get('/', routes.index);
app.get('/successLogin', home.redirectToHomepage);
app.get('/Profile', profile.land);
app.get('/admin', admin.land);
app.get('/successAdminLogin', admin.redirectToAdminHomepage);


app.get('/become_a_host', routes.index);
app.get('/propertyList', routes.index);
app.get('/home', routes.index);
app.get('/property_landing', routes.index);

app.get('/host_dashboard', host_dashboard.host_dashboard);

app.get('/adminListCityNames', admin.adminListCityNames);
app.get('/adminTopTenPropertiesAsRevenue', admin.adminTopTenPropertiesAsRevenue);
app.get('/adminCitywiseRevenue', admin.adminCitywiseRevenue);
app.get('/adminGetBillInfo', admin.adminGetBillInfo);
app.get('/adminGetHostGraphs', admin.adminGetHostGraphs);
app.get('/adminClicksPerProperty', admin.adminClicksPerProperty);
app.get('/adminApproveUserTasks', admin.adminApproveUserTasks);
app.get('/adminTopTenHostsTask', admin.adminTopTenHostsTask);
app.get('/adminApprovePropertyTask', admin.adminApprovePropertyTask);
app.get('/adminDashboardInfo', admin.adminDashboardInfo);


app.get('/EditProfile', editprofile.land);
app.get('/Account', account.land);
app.get('/Receipt', receipt.land);

app.get('/TraceBidGraph',traceBid.land);
app.get('/TraceUserGraph', traceUser.land);
app.get('/PropertyClickGraph', clickProperty.land);
app.get('/ClickPageGraph', clickPage.land);



app.get('/check_becomehost', routes.index);

function isAuthenticated(req, res, next) {
	  if(req.session.username) {
	     console.log(req.session.username+"+++++"+req.session.lastlogin);
	     return next();
	  }
	  res.redirect('/');
	}



mongo.connect(mongoSessionConnectURL, function() {
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function() {
		console.log('Express server listening on port ' + app.get('port'));
	});
});