
/**
 * Module dependencies.
 */
var express		= require('express');
var routes		= require('./routes');
var http		= require('http');
var path		= require('path');
var LocalStrategy = require("passport-local").Strategy;
var passport 	= require('passport');
require('./routes/passportj')(passport);
var property 		= require('./routes/property');

//Routes files below
var user 		= require('./routes/user');
var index 		= require('./routes/index');
var home 		= require('./routes/home');
var profile 	= require('./routes/profile');
var admin 		= require('./routes/admin');
var editprofile = require('./routes/EditProfile');
var account 	= require('./routes/Account');
var receipt 	= require('./routes/Receipt');
var host_dashboard 		= require('./routes/host_dashboard');


//URL for the sessions collections in mongoDB
var mongoSessionConnectURL 	= "mongodb://localhost:27017/AirbnbDatabaseMongoDB";
var expressSession 			= require("express-session");
var mongoStore 				= require("connect-mongo/es5")(expressSession);
var mongo 					= require("./routes/mongo");

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
			
			console.log('BEFORE SENDING USER');
			console.log(user);
			res.send({
				'statusCode' : 200,
				'username' : user.username
				
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
app.post('/logMyEvent', admin.logMyEvent);

app.post('/register_new_property', home.register_new_property);
app.post('/adminListCityHosts', admin.adminListCityHosts);

app.post('/view_profile', profile.view_profile);
app.post('/edit_profile', editprofile.edit_profile);
app.post('/change_password', profile.change_password);
app.post('/confirm_receipt', receipt.confirm_receipt);
app.post('/getPropertyList', property.getPropertyList);



//GET
app.get('/getProperties',function(req,res){
	res.send(req.session.properties);
});


app.get('/', routes.index);
app.get('/successLogin', home.redirectToHomepage);
app.get('/Profile', profile.land);
app.get('/admin', admin.land);
app.get('/successAdminLogin', admin.redirectToAdminHomepage);
app.get('/adminApproveUserTasks', admin.adminApproveUserTasks);

app.get('/become_a_host', routes.index);
app.get('/propertyList', routes.index);

app.get('/host_dashboard', host_dashboard.host_dashboard);

app.get('/adminListCityNames', admin.adminListCityNames);
app.get('/adminTopTenPropertiesAsRevenue', admin.adminTopTenPropertiesAsRevenue);
app.get('/adminCitywiseRevenue', admin.adminCitywiseRevenue);

app.get('/EditProfile', editprofile.land);
app.get('/Account', account.land);
app.get('/Receipt', receipt.land);

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
