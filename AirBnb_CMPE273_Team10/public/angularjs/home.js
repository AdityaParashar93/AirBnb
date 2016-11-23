var app = angular.module('airbnb', ['ui.router','ngRoute','ngResource']);
var username;
console.log("I AM INSIDE THE ANGULARJS FILE home.js");

// FOLLOWING PART WILL CONFIGURE ALL MY ROUTES
app.config(function($stateProvider, $urlRouterProvider, $locationProvider,$routeProvider) {
	console.log("I AM INSIDE $ROUTEPROVIDER FUNCTION OF ANGULARJS");
	$locationProvider.html5Mode(true);
	$routeProvider
	.when("/login", {
		templateUrl : "templates/login.html"
	})

	.when("/register", {
		templateUrl : "templates/register.html"
	});
	$stateProvider.state('landing', {	
		url : '/',
		views: {
            'header': {
                templateUrl : 'templates/header.html',
            },
            'content': {
                templateUrl : 'templates/index.html',
            },
		}
	}).state('home', {	
		url : '/',
		views: {
            'header': {
                templateUrl : 'templates/header2.html',
            },
            'content': {
                templateUrl : 'templates/index.html',
            },
		}
	});
});

var flag = 0;
//login
app.controller('airbnb', function($scope, $http, $state, $window,$timeout ) {
	$scope.guest = 1;
	$scope.fromDate= "2016-12-05";
	$scope.toDate = "2016-12-25";
	
	if($window.localStorage.getItem("username")){
			console.log("here");
			$scope.username = $window.localStorage.getItem("username");
			console.log($window.localStorage.getItem("username"));
			$state.go('home');
			//	$window.localStorage.removeItem("username");
		}
		
	$scope.searchProperties = function(){
		console.log($scope.location);
		console.log($scope.fromDate);
		console.log($scope.toDate);
		console.log($scope.guest);
		
		$http({
			method : "POST",
			url : '/getPropertyList',
			data : {
			'location' : $scope.location,
			'fromDate' : $scope.fromDate,
			'toDate' : $scope.toDate,
			'guest' : $scope.guest
				
			}
		}).success(function(data) {
			
			
		}).error(function(error){
			console.log(error);
		});
	
	
	
	
	
	};

	$scope.logout = function(){
		$window.localStorage.removeItem("username");
		$http({
			method : "POST",
			url : '/logout',
			data : {}
		}).success(function(data) {

			$timeout(function () {
			    // 0 ms delay to reload the page.
				$state.go('landing');
			}, 0);
		});
		
	};
	
	
	$scope.invalid_login = true;
	console.log("I AM IN AIRBNB CONTROLLER");
	$scope.signin = function() {
		console.log($scope.inputUsername);
	console.log("SIGN IN BUTTON CLICKED");
		var credentials = {
			"username" : $scope.inputUsername,
			"password" : $scope.inputPassword
		};

		console.log(credentials);

		$http({
			method : "POST",
			url : '/signin',
			data : credentials
		}).success(function(data) {

			if (data.statusCode === 200) {
				console.log("render the successful login page here");
				username = data.username;
				console.log(data.username);
				$window.localStorage.setItem("username", username);
				$state.go('home');
				$timeout(function () {
				    // 0 ms delay to reload the page.
				    $state.reload('home');
				}, 0);
				
				//	window.location.assign("/successLogin");
			} else {
				console.log("render the Invalid LogIn Message here");
				$scope.invalid_login = false;
				$scope.invalid_register = true;
				$scope.valid_register = true;
				$scope.already_exists = true;
			}
		});
	};
	
	$scope.Profile = function()
	{
		window.location.assign("/Profile");
	};
	
});

// register
app.controller(
				'register',
				function($scope, $http) {
					$scope.invalid_register = true;
					$scope.valid_register = true;
					$scope.already_exists = true;
					
					console.log("I AM INSIDE register CONTROLLER");

					$scope.register = function() {
						console.log($scope.dob);

						console.log("REGISTER BUTTON CLICKED");
						var RegisterCredentials = {
							"first_name" : $scope.first_name,
							"last_name" : $scope.last_name,
							"inputUsername" : $scope.inputUsername,
							"inputPassword" : $scope.inputPassword,
							"dob" : $scope.dob
						};

					//		console.log(RegisterCredentials.inputPassword);
					//		console.log(RegisterCredentials.confirmPassword);
					//		console.log("BOTH PASSWORDS ARE SIMILAR, RECORD CAN BE INSERTED IN DB");
							$http({
								method : "POST",
								url : '/registerNewUser',
								data : RegisterCredentials
							}).success(function(data) {

								if (data.statusCode === 200) {
									console.log("USER INSERTED");
									$scope.invalid_register = true;
									$scope.already_exists = true;
									$scope.valid_register = false;
								} else if (data.statusCode === 401) {
									console.log("INVALID ENTRY RECEIVED");
									$scope.valid_register = true;
									$scope.already_exists = true;
									$scope.invalid_register = false;
								} else {
									console.log("USER ALREADY EXISTS");
									$scope.already_exists = false;
									$scope.invalid_register = true;
									$scope.valid_register = true;
								}
							}); 
					};
				});

//subscribe
app.controller('subscribe', function($scope, $http) {
	$scope.subscribe = function() {
		console.log("inside subscribe");
		console.log($scope.subscriber_email);
		$http({
			method : "POST",
			url : '/subscribe',
			data : {"subscriber_email":$scope.subscriber_email}
		});
	};
});