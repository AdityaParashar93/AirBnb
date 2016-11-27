var app = angular.module('airbnb_admin', [ 'ngRoute', 'nvd3' ]);

console.log("I AM INSIDE THE ANGULARJS FILE admin.js baraka");

// FOLLOEING PART WILL CONFIGURE ALL MY ROUTES
//configure our routes
app.config(function($routeProvider) {
	console.log("I AM IN $routeProvider admin.js");
	$routeProvider

	.when("/login", {
		templateUrl : "templates/login.html"
	})
	
	.when("/tasks", {
		templateUrl : "templates/admin/tasks.html",
		controller	: "adminApproveUserTasksController"
	})
	
	.when("/display", {
		templateUrl : "templates/admin/display.html",
		controller	: "adminListCityNamesController"
	})
	
	.when("/citylist/:city", {
		templateUrl : "templates/admin/citylist.html",
		controller : "adminListCityHostsController"
	})
	
	.when("/topTenPropertiesAsRevenue", {
		templateUrl : "templates/admin/topTenPropertiesAsRevenue.html",
		controller : "topTenPropertiesAsRevenueController"
	})
	
	.when("/citywiseRevenue", {
		templateUrl : "templates/admin/citywiseRevenue.html",
		controller : "citywiseRevenueController"
	})
	;
});

//login
app.controller('airbnb_admin', function($scope, $http) {

	console.log("I AM INSIDE airbnb_admin CONTROLLER");
	$scope.invalid_login = true;

	$scope.signin = function() {

		console.log("ADMIN SIGN IN BUTTON CLICKED");

		var credentials = {
			"username" : $scope.inputUsername,
			"password" : $scope.inputPassword
		};

		console.log(credentials);

		$http({
			method : "POST",
			url : '/afterAdminLogin',
			data : credentials
		}).success(function(data) {

			if (data.statusCode === 200) {
				console.log("RENDER THE SUCCESSFUL LOGGED IN ADMIN PAGE HERE");
				window.location.assign("/successAdminLogin");
			} else {
				console.log("RENDER THE INVALID LOGIN MESSAGE HERE");
				$scope.invalid_login = false;
			}

		});
	};

});

app.controller("adminApproveUserTasksController", function($scope, $http) {
	console.log("I AM INSIDE CONTROLELR: adminApproveUserTasksController. I LIST ADMIN TASK ON THE PAGE");

	$http({
		method : "get",
		url : '/adminApproveUserTasks'
	}).success(function(data) {
		console.log("SUCCESSFULLY LISTED PENDING APPROVAL HOSTS");
		console.log(data);
		$scope.results = data.users;
	}).error(function(error) {

	});

});

app.controller("adminListCityHostsController", function($scope, $http, $routeParams) {
	console.log("I AM INSIDE CONTROLELR: adminListCityHostsController. I LIST HOSTS OF CITY ON THE PAGE");
	console.log($routeParams.city);
	$scope.city = $routeParams.city;
	
	var city_credentials = {
			"city" : $scope.city
		};
	
	console.log(city_credentials);

	$http({
		method : "POST",
		url : '/adminListCityHosts',
		data : city_credentials
	}).success(function(data) {
		console.log("SUCCESSFULLY LISTED HOSTS OF A CITY");
		console.log(data);
		$scope.city = data.users[0].city;
		$scope.results = data.users;
		console.log("hie");
		console.log($scope.city);
	}).error(function(error) {

	});

});

app.controller("adminListCityNamesController", function($scope, $http) {
	console.log("I AM INSIDE CONTROLELR: adminListCityNamesController. I LIST THE CITY NAMES ON DISPLAY PAGE");

	$http({
		method : "get",
		url : '/adminListCityNames'
	}).success(function(data) {
		console.log("SUCCESSFULLY LISTED DISTINCT CITY NAMES");
		console.log(data);
		$scope.results = data.users;
	}).error(function(error) {

	});

});

app.controller('admin_approve', function($scope, $http) {
	console.log("I AM INSIDE admin_approve CONTROLLER");
	
	$scope.approveUser = function(flag, id) {
		var user_credentials = {
			"flag" : flag,
			"user_id" : id
		};
		console.log(user_credentials);
		$http({
			method : "POST",
			url : '/adminApproveUser',
			data : user_credentials
		}).success(function(data) {

			if (data.statusCode === 200) {
				console.log("USER APPROVED AND ADDED TO SYSTEM");
				// console.log(data);
			} else {
				console.log("SOMETHING WENT WRONG");
			}
		});
	};
	
});

app.controller('topTenPropertiesAsRevenueController', function($scope, $http) {
	
	console.log("I AM INSIDE CONTROLELR: topTenPropertiesAsRevenueController. I CREATE GRAPHS");
	
	$http({
		method : "get",
		url : '/adminTopTenPropertiesAsRevenue'
	}).success(function(data) {
		console.log("SUCCESSFULLY OBTAINED TOP TEN PROPERTY HOST NAMES");
		console.log(data);
		$scope.results = data.users;
		console.log("KUTRA");
		
		console.log(data.users[0].host_id);
		
		$scope.graph_formatting = {
					chart: {
						type: 'discreteBarChart',
		                height: 450,
		                margin : {
		                    top: 20,
		                    right: 20,
		                    bottom: 50,
		                    left: 55
		                },
		                x: function(d){return d.label;},
		                y: function(d){return d.value + (1e-10);},
		                showValues: true,
		                valueFormat: function(d){
		                    return d3.format(',.4f')(d);
		                },
		                duration: 500,
		                xAxis: {
		                    axisLabel: 'HOST NAME'
		                },
		                yAxis: {
		                    axisLabel: 'REVENUE PER YEAR',
		                    axisLabelDistance: -10
		                }
		            }
		};
		
        $scope.graph_data = [
             	            {
             	                key: "TOP TEN PROPERTIES WITH ITS REVENUE/YEAR",
             	                values: [
             	                    {
             	                        "label" : data.users[0].host_id ,
             	                        "value" : data.users[0].revenue
             	                    } ,
             	                    {
             	                        "label" : data.users[1].host_id ,
             	                        "value" : data.users[1].revenue
             	                    } ,
             	                    {
             	                        "label" : data.users[2].host_id ,
             	                        "value" : data.users[2].revenue
             	                    } ,
             	                    {
             	                        "label" : data.users[3].host_id ,
             	                        "value" : data.users[3].revenue
             	                    } ,
             	                    {
             	                        "label" : data.users[4].host_id ,
             	                        "value" : data.users[4].revenue
             	                    }/* ,
             	                    {
             	                        "label" : data.users[0].host_id ,
             	                        "value" : data.users[0].revenue
             	                    } ,
             	                    {
             	                        "label" : data.users[1].host_id ,
             	                        "value" : data.users[1].revenue
             	                    } ,
             	                    {
             	                        "label" : data.users[2].host_id ,
             	                        "value" : data.users[2].revenue
             	                    } ,
             	                    {
             	                        "label" : data.users[3].host_id ,
             	                        "value" : data.users[3].revenue
             	                    } ,
             	                    {
             	                        "label" : data.users[4].host_id ,
             	                        "value" : data.users[4].revenue
             	                    }*/
             	                ]
             	            }
             	        ]
	}).error(function(error) {

	});
	
});


app.controller('citywiseRevenueController', function($scope, $http) {
	
	console.log("I AM INSIDE CONTROLELR: citywiseRevenueController. I CREATE GRAPHS");
	
	$http({
		method : "get",
		url : '/adminCitywiseRevenue'
	}).success(function(data) {
		console.log("SUCCESSFULLY OBTAINED TOP TEN PROPERTY HOST NAMES");
		console.log(data);
		$scope.results = data.users;
		
		var colors = ["red", "green", "blue", "orange", "pink"];
		
		$scope.graph_formatting = {
	            chart: {
	                type: 'pieChart',
	                height: 500,
	                x: function(d){return d.key;},
	                y: function(d){return d.y;},
	                showLabels: true,
	                transitionDuration: 500,
	                labelThreshold: 0.01,
	                legend: {
	                    margin: {
	                        top: 5,
	                        right: 35,
	                        bottom: 5,
	                        left: 0
	                    }
	                },
	                color: function(d,i){
	                  return colors[i % colors.length]
	                }
	            }
		};
		
        $scope.graph_data = [
                             {
                                 key: "California",
                                 y: 1
                             },
                             {
                                 key: "Bhayankar Nagar",
                                 y: 2
                             },
                             {
                                 key: "New York",
                                 y: 3
                             },
                             {
                                 key: "Pune",
                                 y: 4
                             },
                             {
                                 key: "Nanded",
                                 y: 5
                             },
                             {
                                 key: "Mumbai",
                                 y: 6
                             },
                             {
                                 key: "Katraj",
                                 y: 7
                             }
                         ];
	}).error(function(error) {

	});
	
});