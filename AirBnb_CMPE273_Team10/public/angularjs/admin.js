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
	
	.when("/dashboard", {
		templateUrl : "templates/admin/dashboard.html",
		controller	: "dashboardController"
	})
	
	.when("/bill", {
		templateUrl : "templates/admin/bills.html",
		controller	: "billController"
	})
	
	.when("/hostGraphs", {
		templateUrl : "templates/admin/hostGraphs.html",
		controller	: "hostGraphsController"
	})
	
	.when("/clicksPerProperty", {
		templateUrl : "templates/admin/clicksPerProperty.html",
		controller	: "clicksPerPropertyController"
	})
	
	.when("/tasks", {
		templateUrl : "templates/admin/tasks.html",
		controller	: "adminApproveUserTasksController"
	})
	
	.when("/approvePropertyTask", {
		templateUrl : "templates/admin/approvePropertyTask.html",
		controller	: "adminApprovePropertyTaskController"
	})
	
	.when("/topTenHosts", {
		templateUrl : "templates/admin/topTenHosts.html",
		controller	: "adminApproveUsertopTenHostsController"
	})
	
	.when("/display", {
		templateUrl : "templates/admin/display.html",
		controller	: "adminListCityNamesController"
	})
	
	.when("/citylist/:city", {
		templateUrl : "templates/admin/citylist.html",
		controller : "adminListCityHostsController"
	})
	
	.when("/hostanalytics/:host", {
		templateUrl : "templates/admin/hostanalytics.html",
		controller : "adminHostAnalyticsController"
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

app.controller("dashboardController", function($scope, $http){
	console.log("I AM INSIDE CONTROLELR: dashboardController.");
	
	$http({
		method : "get",
		url : '/adminDashboardInfo'
	}).success(function(data) {
		console.log("SUCCESSFULLY FOUND ADMIN DASHBOARD INFO");
		console.log(data);
		$scope.number_of_users = data.count_users;
		$scope.number_of_properties = data.count_prop;
		$scope.number_of_hosts= data.count_host;
		$scope.results = data.users;
		$scope.tot_revenue= data.tot_revenue[0].totalrevenue;
		console.log("hi");
		console.log(data.tot_revenue[0].totalrevenue);
		
		
	}).error(function(error) {

	});
	
});

app.controller("billController", function($scope, $http) {
	console.log("I AM INSIDE CONTROLELR: billController");

	$http({
		method : "get",
		url : '/adminGetBillInfo'
	}).success(function(data) {
		console.log("SUCCESSFULLY OBTAINED BILL INFORMATION");
		console.log(data);
		$scope.results = data.users;
	}).error(function(error) {

	});

});

app.controller("hostGraphsController", function($scope, $http) {
	console.log("I AM INSIDE CONTROLELR: hostGraphsController");

	$http({
		method : "get",
		url : '/adminGetHostGraphs'
	}).success(function(data) {
		console.log("SUCCESSFULLY OBTAINED HOSTS FOR GRAPH INFORMATION");
		console.log(data);
		$scope.results = data.users;
	}).error(function(error) {

	});

});


app.controller("adminApproveUserTasksController", function($scope, $http) {
	console.log("I AM INSIDE CONTROLELR: adminApproveUserTasksController. I LIST ADMIN HOST APPROVAL TASK ON THE PAGE");

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

app.controller("adminApprovePropertyTaskController", function($scope, $http) {
	console.log("I AM INSIDE CONTROLELR: adminApprovePropertyTaskController. I LIST ADMIN PROPERTY APPROVAL TASK ON THE PAGE");

	$http({
		method : "get",
		url : '/adminApprovePropertyTask'
	}).success(function(data) {
		console.log("SUCCESSFULLY LISTED PENDING PROPERTY REQUESTS");
		console.log(data);
		$scope.results = data.users;
	}).error(function(error) {

	});

});

app.controller("adminApproveUsertopTenHostsController", function($scope, $http) {
	console.log("I AM INSIDE CONTROLELR: adminApproveUsertopTenHostsController. I LIST ADMIN PROPERTY APPROVAL TASK ON THE PAGE");

	$http({
		method : "get",
		url : '/adminTopTenHostsTask'
	}).success(function(data) {
		console.log("SUCCESSFULLY OBTAINED TOP TEN PROPERTY HOST NAMES");
		console.log(data);
		$scope.results = data.users;
		
		$scope.graph_formatting_host = {
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
		                    axisLabel: 'REVENUE',
		                    axisLabelDistance: -10
		                }
		            }
		};
		
        $scope.graph_data_host = [
             	            {
             	                key: "TOP TEN HOSTS BHAU WITH THEIR REVENUE/YEAR",
             	                values: [
             	                    {
             	                        "label" : data.users[0].username ,
             	                        "value" : data.users[0].revenue
             	                    } ,
             	                    {
             	                        "label" : data.users[1].username ,
             	                        "value" : data.users[1].revenue
             	                    } ,
             	                    {
             	                        "label" : data.users[2].username ,
             	                        "value" : data.users[2].revenue
             	                    } ,
             	                    {
             	                        "label" : data.users[3].username ,
             	                        "value" : data.users[3].revenue
             	                    } ,
             	                    {
             	                        "label" : data.users[4].username ,
             	                        "value" : data.users[4].revenue
             	                    } ,
             	                    {
             	                        "label" : data.users[5].username ,
             	                        "value" : data.users[5].revenue
             	                    } ,
             	                    {
             	                        "label" : data.users[6].username ,
             	                        "value" : data.users[6].revenue
             	                    } ,
             	                    {
             	                        "label" : data.users[7].username ,
             	                        "value" : data.users[7].revenue
             	                    } ,
             	                    {
             	                        "label" : data.users[8].username ,
             	                        "value" : data.users[8].revenue
             	                    } ,
             	                    {
             	                        "label" : data.users[9].username ,
             	                        "value" : data.users[9].revenue
             	                    }
             	                ]
             	            }
             	        ]
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
	
	$scope.approveUser = function(id) {
		var user_credentials = {
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
			} else {
				console.log("SOMETHING WENT WRONG");
			}
		});
	};
	
});

app.controller('admin_approve_property', function($scope, $http) {
	console.log("I AM INSIDE admin_approve_host CONTROLLER");
	
	$scope.approveProperty = function(id) {
		var user_credentials = {
			"user_id" : id
		};
		console.log(user_credentials);
		$http({
			method : "POST",
			url : '/adminApproveProperty',
			data : user_credentials
		}).success(function(data) {

			if (data.statusCode === 200) {
				console.log("USER APPROVED AND ADDED TO SYSTEM");
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
		console.log("SUCCESSFULLY OBTAINED TOP TEN PROPERTY BY REVENUE");
		console.log(data);
		$scope.results = data.users;
		
		console.log(data.users[0].property_title);
		
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
		                    axisLabel: 'PROPERTY NAME'
		                },
		                yAxis: {
		                    axisLabel: 'REVENUE',
		                    axisLabelDistance: -10
		                }
		            }
		};
		
        $scope.graph_data = [
             	            {
             	                key: "TOP TEN PROPERTIES BY REVENUE?YEAR",
             	                values: [
             	                    {
             	                        "label" : data.users[0].property_title ,
             	                        "value" : data.users[0].revenue
             	                    } ,
             	                    {
             	                        "label" : data.users[1].property_title ,
             	                        "value" : data.users[1].revenue
             	                    } ,
             	                    {
             	                        "label" : data.users[2].property_title ,
             	                        "value" : data.users[2].revenue
             	                    } ,
             	                    {
             	                        "label" : data.users[3].property_title ,
             	                        "value" : data.users[3].revenue
             	                    } ,
             	                    {
             	                        "label" : data.users[4].property_title ,
             	                        "value" : data.users[4].revenue
             	                    } ,
             	                    {
             	                        "label" : data.users[5].property_title ,
             	                        "value" : data.users[5].revenue
             	                    } ,
             	                    {
             	                        "label" : data.users[6].property_title ,
             	                        "value" : data.users[6].revenue
             	                    } ,
             	                    {
             	                        "label" : data.users[7].property_title ,
             	                        "value" : data.users[7].revenue
             	                    } ,
             	                    {
             	                        "label" : data.users[8].property_title ,
             	                        "value" : data.users[8].revenue
             	                    } ,
             	                    {
             	                        "label" : data.users[9].property_title ,
             	                        "value" : data.users[9].revenue
             	                    }
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
		console.log("SUCCESSFULLY OBTAINED TOP TEN CITY NAMES");
		console.log(data);
		$scope.results = data.users;
		
		console.log(data.users[0].city);
		console.log(data.users[0].revenue);
		
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
                                 key: data.users[0].city,
                                 y: data.users[0].revenue
                             },
                             {
                                 key: data.users[1].city,
                                 y: data.users[1].revenue
                             },
                             {
                                 key: data.users[2].city,
                                 y: data.users[2].revenue
                             },
                             {
                                 key: data.users[3].city,
                                 y: data.users[3].revenue
                             },
                             {
                                 key: data.users[4].city,
                                 y: data.users[4].revenue
                             }
                         ];
	}).error(function(error) {

	});
	
});

app.controller('clicksPerPropertyController', function($scope, $http) {
	
	console.log("I AM INSIDE CONTROLELR: clicksPerPropertyController. I CREATE GRAPHS");
	
	$http({
		method : "get",
		url : '/adminClicksPerProperty'
	}).success(function(data) {
		console.log("SUCCESSFULLY OBTAINED TOP TEN PROPERTY BY CLICKS");
		console.log(data);
		$scope.results = data.users;
		
		console.log(data.users[0].property_title);
		
		$scope.graph_formatting_click = {
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
		                    axisLabel: 'PROPERTY NAME'
		                },
		                yAxis: {
		                    axisLabel: 'CLICKS',
		                    axisLabelDistance: -10
		                }
		            }
		};
		
        $scope.graph_data_click = [
             	            {
             	                key: "TOP TEN CLICKS PER PROPERTY",
             	                values: [
             	                    {
             	                        "label" : data.users[0].property_title ,
             	                        "value" : data.users[0].clicks
             	                    } ,
             	                    {
             	                        "label" : data.users[1].property_title ,
             	                        "value" : data.users[1].clicks
             	                    } ,
             	                    {
             	                        "label" : data.users[2].property_title ,
             	                        "value" : data.users[2].clicks
             	                    } ,
             	                    {
             	                        "label" : data.users[3].property_title ,
             	                        "value" : data.users[3].clicks
             	                    } ,
             	                    {
             	                        "label" : data.users[4].property_title ,
             	                        "value" : data.users[4].clicks
             	                    } ,
             	                    {
             	                        "label" : data.users[0].property_title ,
             	                        "value" : data.users[0].clicks
             	                    } ,
             	                    {
             	                        "label" : data.users[1].property_title ,
             	                        "value" : data.users[1].clicks
             	                    } ,
             	                    {
             	                        "label" : data.users[2].property_title ,
             	                        "value" : data.users[2].clicks
             	                    } ,
             	                    {
             	                        "label" : data.users[3].property_title ,
             	                        "value" : data.users[3].clicks
             	                    } ,
             	                    {
             	                        "label" : data.users[4].property_title ,
             	                        "value" : data.users[4].clicks
             	                    }
             	                ]
             	            }
             	        ]
	}).error(function(error) {

	});
	
});


app.controller("adminHostAnalyticsController", function($scope, $http, $routeParams) {
	console.log("I AM INSIDE CONTROLELR: adminHostAnalyticsController. I LIST HOSTS ANALYTICS");
	console.log($routeParams.host);
	$scope.host = $routeParams.host;
	
	var host_credentials = {
			"host" : $scope.host
		};
	
	console.log(host_credentials);

	$http({
		method : "POST",
		url : '/adminHostAnalytics',
		data : host_credentials
	}).success(function(data) {
		console.log("SUCCESSFULLY BROUGHT HOSTS INFORMATION FOR GRAPH");
		console.log(data);

		$scope.results = data.users;
		console.log("guruji talim");
		$scope.host_name = data.users[0].username;
		var length = data.users.length - 1;
		$scope.least_seen_area = data.users[length].page_id;
		
		$scope.graph_formatting_clickperpage = {
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
	                    axisLabel: data.users[0].username
	                },
	                yAxis: {
	                    axisLabel: 'NUMBER OF CLICKS',
	                    axisLabelDistance: -10
	                }
	            }
		};
	
		$scope.graph_data_clickperpage = [
         	            {
         	                key: "TOP TEN CLICKS BY THIS HOST",
         	                values: [
         	                    {
         	                        "label" : data.users[0].page_id ,
         	                        "value" : data.users[0].clicks_on_this_page
         	                    } ,
         	                    {
         	                        "label" : data.users[1].page_id ,
         	                        "value" : data.users[1].clicks_on_this_page
         	                    } ,
         	                    {
         	                        "label" : data.users[2].page_id ,
         	                        "value" : data.users[2].clicks_on_this_page
         	                    } ,
         	                    {
         	                        "label" : data.users[3].page_id ,
         	                        "value" : data.users[3].clicks_on_this_page
         	                    } ,
         	                    {
         	                        "label" : data.users[4].page_id ,
         	                        "value" : data.users[4].clicks_on_this_page
         	                    }
         	                ]
         	            }
         	        ];
		
		$scope.graph_formatting_timespent = {
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
	                    axisLabel: data.users[0].username
	                },
	                yAxis: {
	                    axisLabel: 'TIME SPENT ON THE PAGE',
	                    axisLabelDistance: -10
	                }
	            }
		};
	
		$scope.graph_data_timespent = [
         	            {
         	                key: "TOP TEN CLICKS BY THIS HOST",
         	                values: [
         	                    {
         	                        "label" : data.users[0].page_id ,
         	                        "value" : data.users[0].timeSpentOnPage
         	                    } ,
         	                    {
         	                        "label" : data.users[1].page_id ,
         	                        "value" : data.users[1].timeSpentOnPage
         	                    } ,
         	                    {
         	                        "label" : data.users[2].page_id ,
         	                        "value" : data.users[2].timeSpentOnPage
         	                    } ,
         	                    {
         	                        "label" : data.users[3].page_id ,
         	                        "value" : data.users[3].timeSpentOnPage
         	                    } ,
         	                    {
         	                        "label" : data.users[4].page_id ,
         	                        "value" : data.users[4].timeSpentOnPage
         	                    }
         	                ]
         	            }
         	        ];
    
		

	}).error(function(error) {

	});

});