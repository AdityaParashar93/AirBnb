var app = angular.module('airbnb', ['ui.router','ngRoute','ngResource','ngFileUpload']);

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
	}).state('become_a_host', {	
		url : '/become_a_host',
		views: {
            'header': {
                templateUrl : 'templates/header.html',
            },
            'content': {
                
                templateUrl : 'templates/become_a_host.html',

            },	
		}
	});
});

var flag = 0;
//login
app.controller('airbnb', function ($scope,$http,$window,$state,$document,$timeout,Upload) {
	$scope.validate_property=true;
	$scope.validate_property1=true;
	$scope.validate_property2=true;
	
	var location;
	$scope.myfunction=function (pos){
		console.log(pos);
		location=pos;
	};
	
	$scope.property_input={};
	$scope.stepsModel = [];

	
	$scope.guest = 1;
	$scope.fromDate= "2016-12-05";
	$scope.toDate = "2016-12-25";
	
	$scope.imageUpload = function(element){
        var reader = new FileReader();
        reader.onload = $scope.imageIsLoaded;
        reader.readAsDataURL(element.files[0]);
    };
    
    $scope.imageIsLoaded = function(e){
        $scope.$apply(function() {
            $scope.stepsModel.push(e.target.result);
        });
    };
	

	$scope.amenities = [
		                  {text: "Essentials"},
		                  {text: "Towels, bed sheets, soap, and toilet paper"},
		                  {text: "Wifi"},
		                  {text: "Shampoo"},
		                  {text: "Closet/drawers"},
		                  {text: "TV"},
		                  {text: "Heat"},
		                  {text: "Air conditioning"},
		                  {text: "Breakfast, coffee, tea"},
		                  {text: "Desk/workspace"},
		                  {text: "Fireplace"},
		                  {text: "Iron"},
		                  {text: "Hair dryer"},
		                  {text: "Pets in the house"}
					];
	$scope.selected_amenities=[];
	$scope.shares = [
		                  {text: "Kitchen"},
		                  {text: "Laundry - washer"},
		                  {text: "Laundry - dryer"},
		                  {text: "Parking"},
		                  {text: "Elevator"},
		                  {text: "Pool"},
		                  {text: "Hot tub"},
		                  {text: "Gym"}
		            ];
	$scope.selected_shares=[];
	
	  
	  $scope.sync = function(bool, item){
		    if(bool){
		      
		      $scope.selected_amenities.push(item);
		    }
	};

	$scope.sync1 = function(bool, item){
	    if(bool){
	      
	      $scope.selected_shares.push(item);
	    } 
	};
	
	if($window.localStorage.getItem("username")){
			console.log("here");
			$scope.username = $window.localStorage.getItem("username");
			console.log($window.localStorage.getItem("username"));
			$state.go('home');
			//	$window.localStorage.removeItem("username");
		}
		
	$scope.test=function(){
		$scope.validate_property=false;
		$scope.validate_property1=true;
		$scope.validate_property2=true;
		var temp={from:new Date(),to:new Date()};
		
		$scope.property_input.availability=[];
		$scope.property_input.availability.push(temp);
		console.log($scope.property_input.availability);
		$scope.property_input.revenue=0;
		$scope.property_input.ratings=0;
		$scope.property_input.owner="test";
		
		
		if($scope.country!=="" && $scope.street_address!=="" && $scope.city!=="" && $scope.state!==""  && $scope.property_description!=="" && $scope.price!=="" && $scope.cc_num!=="" /* && $scope.selected_amenities.length>0 && $scope.selected_amenities.shares>0*/){
			$scope.validate_property=true;
			$scope.validate_property1=true;
			$scope.validate_property2=false;
		}
		if($scope.validate_property){
			$scope.property_input.country=$scope.country;
			$scope.property_input.street_address=$scope.street_address;
			$scope.property_input.city=$scope.city;
			$scope.property_input.state=$scope.state;
			$scope.property_input.zip_code=$scope.zip_code;
			$scope.property_input.co_ordinates=location;
			$scope.property_input.property_type=$scope.property_type;
			$scope.property_input.room_type=$scope.room_type;
			$scope.property_input.number_of_beds=$scope.number_of_beds;
			$scope.property_input.number_of_guests=$scope.number_of_guests;
			$scope.property_input.number_of_bathrooms=$scope.number_of_bathrooms;
			$scope.property_input.shared_amenities=$scope.selected_amenities;
			$scope.property_input.shared_spaces=$scope.selected_shares;
			$scope.property_input.property_images=$scope.stepsModel;
			$scope.property_input.property_title=$scope.property_title;
			$scope.property_input.property_description=$scope.property_description;
			$scope.property_input.property_price=$scope.price;
			$scope.property_input.cc_num=$scope.cc_num;
			$scope.property_input.bid_status=$scope.bid_status;
			
			console.log($scope.property_input);
			$http({
				method : "POST",
				url : '/register_new_property',
				data : {
					"property_input":$scope.property_input,
				}
			}).success(function(data) {

				if (data.statusCode === 200) {
					$scope.response_message="Hey your propeerty has been added to our db";
					$scope.validate_property2=false;
					$scope.validate_property1=true;
				} else {
					$scope.response_message="Hey we faced some technical difficulties.Please try again later.";
					$scope.validate_property1=false;
					$scope.validate_property2=true;
				}
			});
		}
		else{
			console.log("Hey incomplete form");
			$scope.response_message="Please fill all the fields";
			$scope.validate_property1=false;
			$scope.validate_property2=true;
		}
	};
	
	 $scope.submit = function() {
	      if ($scope.files.$valid && $scope.files) {
	        $scope.upload($scope.files);
	        console.log($scope.files);
	      }
	      console.log($scope.files);
	 };
	 $scope.uploadFiles = function (files) {
	      if (files && files.length) {
	        for (var i = 0; i < files.length; i++) {
	          Upload.upload({ data: {file: files[i]}});
	          console.log(files);
	        }
	        // or send them all together for HTML5 browsers:
	        Upload.upload({data: {file: files}});
	        console.log(files);
	      }
	    };
	
	
	
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
		$window.location.assign("/Profile");
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