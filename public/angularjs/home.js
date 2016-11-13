var app = angular.module('airbnb', [ 'ngRoute' ]);

console.log("I AM INSIDE THE ANGULARJS FILE home.js");

// FOLLOEING PART WILL CONFIGURE ALL MY ROUTES
app.config(function($routeProvider) {
	console.log("I AM INSIDE $ROUTEPROVIDER FUNCTION OF ANGULARJS");
	$routeProvider

	.when("/login", {
		templateUrl : "templates/login.html"
	})
	
	.when("/register", {
		templateUrl : "templates/register.html"
	});
});