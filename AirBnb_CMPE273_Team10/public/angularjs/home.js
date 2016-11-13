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


//login
app.controller('airbnb', function($scope, $http) {

	console.log("I AM IN AIRBNB CONTROLLER");
	$scope.invalid_login = true;

	$scope.signin = function() {

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
				window.location.assign("/successLogin");
			} else {
				console.log("render the Invalid LogIn Message here");
				$scope.invalid_login = false;
			}

		});
	};

});

// register
app
		.controller(
				'register',
				function($scope, $http) {

					console.log("I AM INSIDE register CONTROLLER");
					$scope.invalid_login = true;
					$scope.valid_login = true;
					$scope.already_exists = true;

					$scope.register = function() {

						console.log("REGISTER BUTTON CLICKED");

						var RegisterCredentials = {
							"first_name" : $scope.first_name,
							"last_name" : $scope.last_name,
							"inputUsername" : $scope.inputUsername,
							"inputPassword" : $scope.inputPassword,
							"confirmPassword" : $scope.confirmPassword
						};

						if (RegisterCredentials.inputPassword === RegisterCredentials.confirmPassword) {
							console.log(RegisterCredentials.inputPassword);
							console.log(RegisterCredentials.confirmPassword);
							console.log("BOTH PASSWORDS ARE SIMILAR, RECORD CAN BE INSERTED IN DB");
							$http({
								method : "POST",
								url : '/registerNewUser',
								data : RegisterCredentials
							}).success(function(data) {

								if (data.statusCode === 200) {
									console.log("USER INSERTED");
									$scope.invalid_login = true;
									$scope.already_exists = true;
									$scope.valid_login = false;
								} else if (data.statusCode === 401) {
									console.log("INVALID ENTRY RECEIVED");
									$scope.valid_login = true;
									$scope.already_exists = true;
									$scope.invalid_login = false;
								} else {
									console.log("USER ALREADY EXISTS");
									$scope.already_exists = false;
									$scope.invalid_login = true;
									$scope.valid_login = true;
								}
							});
						} else {
							$scope.invalid_login = false;
						}
					};

				});

