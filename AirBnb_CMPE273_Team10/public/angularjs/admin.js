var app = angular.module('airbnb_admin', [ 'ngRoute' ]);

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
	});
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
		console.log("tasksController")
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