var app = angular.module('airbnb', ['ui.router','ngRoute','ngResource','ngFileUpload','ngCookies']);

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
                controller : 'airbnb'
            },
            'content': {
                templateUrl : 'templates/index.html',
                controller : 'airbnb'
            },
		}
	}).state('home', {	
		url : '/home',
		views: {
            'header': {
                templateUrl : 'templates/header2.html',
                controller : 'airbnb'
            },
            'content': {
                templateUrl : 'templates/index.html',
                controller : 'airbnb'
            },
		}
	}).state('propertyList', {	
		url : '/propertyList',
		params: {
			properties: []
		   },
		views: {
            'header': {
                templateUrl : 'templates/header2.html',
                controller : 'airbnb'
            },
            'content': {
                templateUrl : 'templates/propertyList.html',
                controller : 'airbnb'
            },
		}
	}).state('become_a_host', {	
		url : '/become_a_host',
		views: {
            'header': {
                templateUrl : 'templates/header2.html',
                controller : 'airbnb'
            },
            'content': {
                templateUrl : 'templates/become_a_host.html',
                controller : 'airbnb'
            },	
		}
	}).state('host_dashboard', {	
		url : '/host_dashboard',
		views: {
            'header': {
                templateUrl : 'templates/host_dashboard_header.html',
            },
            'sidebar': {
                templateUrl : 'templates/host_dashboard_sidebar.html',
            },
            'content': {
                
                templateUrl : 'templates/host_dashboard.html',

            },	
		}
	}).state('property_landing', {	
		url : '/property_landing',

		views: {
            'header': {
                templateUrl : 'templates/header2.html',
                controller : 'airbnb'
            },
            'content': {

                templateUrl : 'templates/property_landing.html',
                controller : 'airbnb'
            },	
		}
	}).state('check_becomehost', {	
		url : '/check_becomehost',
		views: {
            'header': {
                templateUrl : 'templates/header2.html',
            },
            'content': {
                
                templateUrl : 'templates/check_becomehost.html',
            },	
		}
	});
});

//login
app.controller('airbnb', function($scope, $http, $state, $window,$document,$timeout ,$stateParams,$route ,Upload, $cookies, $cookieStore) {
	$scope.test_login=false;
	$scope.property = $cookieStore.get('property');
	$scope.login = true;
	$scope.bookSuccess = true;
	$scope.bid_added = true;
	$scope.bid_error = true;

	console.log("I AM IN AIRBNB CONTROLLER");
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
	$scope.username = $window.localStorage.getItem("username");

	$scope.priceRange = 100000;
	$scope.guest = 1;
	$scope.chkbox1 = true;
	$scope.chkbox2 = true;
	$scope.chkbox3 = true;
	$scope.fromDate= "2016-12-05";
	$scope.toDate = "2016-12-25";
	
	$scope.invalid_login = true;
	console.log(":State Params:"+$scope.stateParams);
	/*$scope.imageUpload = function(element){
        var reader = new FileReader();
        reader.onload = $scope.imageIsLoaded;
        reader.readAsDataURL(element.files[0]);
    };
    
    $scope.imageIsLoaded = function(e){
        $scope.$apply(function() {
            $scope.stepsModel.push(e.target.result);
        });
    };*/
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
	
	/*if($window.localStorage.getItem("username")){
		if($window.localStorage.getItem("state")==="home"){
			$state.go('home');
		}
		if($window.localStorage.getItem("state")==="propertyList"){
			$state.go('propertyList');
		}
	}*/
	$scope.send_host_approval=function(){
		console.log("check this");
		
		$http({
			method : "POST",
			url : '/send_host_approval',
			data : {
			}
		}).success(function(data) {
			if (data.statusCode === 200) {
				
				
			}
			else {
			}
		});
	};
	
	$scope.test=function(){
		if($window.localStorage.getItem("username")){
			$scope.test_login=true;
			console.log("check for flag1"+$window.localStorage.getItem("host_status_flag1"));
			if($window.localStorage.getItem("host_status_flag1")){
				console.log("Flag1 found false");
				$('#myModal2').modal({show:true});
			}
			console.log("Check for flag sagar	"+$window.localStorage.getItem("host_status_flag"));
			if($window.localStorage.getItem("host_status_flag")=='false'){
				console.log("Flag found false");
				$('#myModal1').modal({show:true});
			}
			var lat = parseFloat(document.getElementById('Latitude').value);
			var lng = parseFloat(document.getElementById('Longitude').value);
			

			console.log(typeof(lat));
			//var location = {"lat":lat,"lng":lng};
			var location = {lat:parseFloat((lat).toFixed(3)),lng:parseFloat((lng).toFixed(3))};
			
			console.log(typeof(location.lat));
	
			console.log(location);
			//console.log(location2);

				$scope.validate_property=false;
				$scope.validate_property1=true;
				$scope.validate_property2=true;
				var temp={from:$scope.availableFrom,to:$scope.availableTo};
			
			$scope.property_input.availability=[];
			$scope.property_input.availability.push(temp);
			console.log($scope.property_input.availability);
			$scope.property_input.revenue=0;
			$scope.property_input.ratings=0;
			$scope.property_input.owner="test";
			
			var test=$scope.selected_amenities;
			var test1=$scope.selected_shares;

			if( test.length>0 && test.length>0 && $scope.country && $scope.city && $scope.state && location && $scope.property_type && $scope.room_type &&$scope.number_of_beds && $scope.number_of_guests && $scope.number_of_bathrooms && $scope.stepsModel && $scope.property_title && $scope.property_description && $scope.price && $scope.cc_num  && $scope.bid_status){
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
				$scope.property_input.property_images=$scope.property_image;
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
					console.log(data);
					if (data.json_responses.statusCode == 200) {
						$scope.response_message="Hey your propeerty has been added to our db";
						$scope.validate_property2=false;
						$scope.validate_property1=true;
						//$state.go('host_dashboard');
					}else if(data.json_responses.statusCode == 405){
						$scope.response_message="Please Log in to submit the form ";
						$scope.validate_property1=false;
						$scope.validate_property2=true;
					} else {
						$scope.response_message="Hey we faced some technical difficulties.Please try again later.";
						$scope.validate_property1=false;
						$scope.validate_property2=true;
					}
				}).error(function(error){
					console.log(error);
				});
			}
			else{
				console.log("Hey incomplete form");
				$scope.response_message="Please fill all the fields";
				$scope.validate_property1=false;
				$scope.validate_property2=true;
			}
		
		}else{
			$scope.test_login=false;
			$('#myModal').modal({show:true});
			console.log("login required");
			$scope.login = false;
		}
	};
	
	$scope.propertyPage = function(property){
		$scope.storeClicks(property);
		console.log(property);
		$cookieStore.put('property',property);
		$scope.property = property;
		$state.go('property_landing');
	};
	
	$scope.validateCard = function(property){
		if($scope.CardNo!==null && $scope.Month!==null && $scope.Year!==null && $scope.CVV!==null){
			console.log($scope.CardNo);
			console.log($scope.Month);
			console.log($scope.Year);
			console.log($scope.CCV);
			$window.localStorage.setItem("cc","true");
			$scope.bookProperty(property);
			
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

$scope.bidProperty = function(property,bid_amount){
	    	if($window.localStorage.getItem("username")){
	    		console.log(property.price);
	    		console.log(bid_amount);
	    		if(bid_amount > property.price){
	    	    	var now = new Date();
	    			var list_time = new Date(property.list_time);
	    			console.log(now);
	    			console.log(list_time);
	    			var diffDays =  Math.abs((now.getTime() - list_time.getTime()) / (1000 * 3600 * 24)); 
	    			console.log(diffDays);
	    			if(diffDays < 4)
	    			{
	    			console.log(bid_amount);
	    			$http({
	    				method : "POST",
	    				url : '/bidProperty',
	    				data : {
	    					"property" : property,
	    					"amount" : bid_amount,
	    					"bookToDate" : $scope.bookToDate,
	    					"bookFromDate": $scope.bookFromDate,
	    					"bookGuests" : $scope.bookGuests
	    				}
	    			}).success(function(data) {
	    				$scope.amount = 1;

	    				if (data.statusCode === 401) {
	    					console.log("error loading cart");
	    					$scope.bid_added = true;
	    					$scope.bid_error = false;
	    				} else {
	    					$scope.quantity = 1;
	    					console.log("bidding donee");
	    					$scope.unknown_error = true;
	    					$scope.bid_added = false;
	    				}
	    			}).error(function(error) {
	    				$scope.unknown_error = true;
	    			});
	    			}else{
	    				$scope.bidding_over = false;
	    			}
	    		}else{
	    			console.log("not so easy");
	    			$scope.bid_err1 = false;
	    		}
	    	}else{
	    		$('#login').modal({show:true});
	    	}
	    };
	    
	    
	    
	    
		$scope.getBiddersList = function(property){
			
			var property_title = property.property_title;
			console.log(property_title);
			var bidList;
			var winList;
				$http({
					method : "GET",
					url : '/getHighestBidders',
					data : { }
				}).success(function(data) {
					console.log("here get bid");
					// checking the response data for statusCode
					if (data.statusCode === 401) {
						console.log("getting it");
						$scope.unknown_error = false;
					} else {
						// Making a get call to the '/redirectToHomepage' API
						bidList = data.bidList;
						winList = data.winList;
						console.log("winList");
						
						console.log(winList);
						var currentBidder = [];
						var cityWinner = [];
						for(var i=0;i<winList.length;i++){
							if(property_title === winList[i].property_title){
								
								cityWinner.push(winList[i]);
							
							}
						}
						
						for(var i=0;i<bidList.length;i++){
							if(property_title === bidList[i].property_title){
								currentBidder.push(bidList[i]);
							}
						}
						
						console.log(cityWinner);
						console.log("currentBidder");
						
						console.log(currentBidder);
						$scope.winList = winList;
						$scope.cityWinner = cityWinner;
						$scope.bidList = bidList;
						$scope.currentBidder = currentBidder;
						// $scope.items = items;
						$scope.unknown_error = true;
					}
				}).error(function(error) {
					$scope.unknown_error = true;
				});
		};
		$scope.bookProperty = function(property){
		
		if($window.localStorage.getItem("username")){
			console.log($window.localStorage.getItem("cc"));
			if($window.localStorage.getItem("cc")=== "true"){
				console.log(property);
				console.log("Specific property info:: ");
				console.log(property.availability[0].from);
				console.log($scope.bookFromDate);
				console.log("");
				console.log(property.availability[0].to);
				console.log($scope.bookToDate);
				
				if(new Date(property.availability[0].from) <= new Date($scope.bookFromDate) && new Date(property.availability[0].to) >= new Date($scope.bookToDate)){
					console.log("booking done");
					
								var json = {
							property : property,	
							bookToDate : $scope.bookToDate,
							bookFromDate : $scope.bookFromDate,
							bookGuests : $scope.bookGuests
								};
						
						$http({
							method : "POST",
							url : '/bookProperty',
							data : json
						}).success(function(data) {
							if (data.statusCode === 200) {
								console.log("book Property");
								$scope.bookSuccess = false;
							} else {
								console.log("sorry ");
							}
						});
					
				
				}
				else{
					console.log("sorry");
				}
			}else{
				$('#creditCard').modal({show:true});
			}
		}else{
			$('#login').modal({show:true});
		}
	};

	$scope.storeClicks = function(property){
		
		var json = {
			property : property	
		};
		
		$http({
			method : "POST",
			url : '/propertyClicks',
			data : json
		}).success(function(data) {
			if (data.statusCode === 200) {
				console.log("stored clicks");
			} else {
				console.log("not stored");
			}
		});
	};
	
	
	$http({
		method : "GET",
		url : '/getProperties',
	}).success(function(data) {
		console.log("hello");
		$scope.stateParams = data.properties;
	});
	
	$scope.searchProperties = function(){
		$cookieStore.put('city',$scope.city);
		console.log("here");
		$http({
			method : "POST",
			url : '/getPropertyList',
			data : {
			'city' : $scope.city,
			'fromDate' : $scope.fromDate,
			'toDate' : $scope.toDate,
			'guest' : $scope.guest
			}
		}).success(function(data) {
			$scope.properties = data.properties;
			$state.go('propertyList',{properties:data.properties});
			
		}).error(function(error){
			console.log(error);
		});
	};


	$scope.room_Type = ['Entire home','private_room'];
    
	$scope.add_type = function(type){
		console.log(type);
		var i = $.inArray(type, $scope.room_Type);
        if (i > -1) {
            $scope.room_Type.splice(i, 1);
        } else {
            $scope.room_Type.push(type);
        }
    };
	$scope.filterRoom = function(property){
		if ($.inArray(property.room_type, $scope.room_Type) < 0){
			return;
		}
		return property;
	};
    
	$scope.searchProperties2 = function(){
		var city = 	$cookieStore.get('city');
		
		console.log($scope.toDate);
		console.log($scope.fromDate);
		console.log($scope.guest);
		console.log($scope.chkbox1);
		console.log($scope.chkbox2);
		console.log($scope.chkbox3);
		console.log($scope.priceRange);
		
		var property = $cookieStore.get('properties');
		var prop = [];
		console.log(property);
		
		for(var i=0;i<property.length;i++){
			if(property[i].price < $scope.priceRange){
				
			}
		}
		
	};

	
	
	$scope.logout = function(){
		$window.localStorage.removeItem("username");
		$window.localStorage.removeItem("state");
		
		$scope.username = "";
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
	
	$scope.host_confirmation=function(){
		$window.localStorage.removeItem("host_status_flag");
		$window.localStorage.removeItem("host_status_flag1");
		$scope.host_status_flag=true;
		console.log("In host confirmation function");
		$http({
			method : "POST",
			url : '/host_confirmation',
			data : {
			}
		}).success(function(data) {
			if (data.statusCode === 200) {
				console.log(data.user.approve_flag);
				if(data.user.approve_flag=='NO'){
					console.log("Flag found as NO......");
					$scope.host_status_flag=false;
					$window.localStorage.setItem("host_status_flag", $scope.host_status_flag);
				}
				else if(data.user.approve_flag=='APPROVE'){
					console.log("Flag found as APPROVE......");
					$scope.host_status_flag1=false;
					$window.localStorage.setItem("host_status_flag1", $scope.host_status_flag1);
				}
				else{
					console.log("Flag found as Yes......");	
					$scope.host_status_flag=true;
					$window.localStorage.setItem("host_status_flag", $scope.host_status_flag);
				}
			} else {
			}
		});
	};
	
	
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
				$scope.host_confirmation();
				console.log("render the successful login page here");
				$scope.username = data.username;
				//$window.localStorage.setItem("state", "home");
				$window.localStorage.setItem("cc",data.cc_num);
				console.log(data.cc_num);
		
				$window.localStorage.setItem("username", data.username);
				//if(!$scope.test_login){
					$state.go('home');
				//}
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
app.controller('register',
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



