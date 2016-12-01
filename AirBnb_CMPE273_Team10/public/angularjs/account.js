var account = angular.module('account', ['ui.router']);
-account.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('account', {
        url : '/Account',
        views: {
            'header': {
                templateUrl : 'templates/profileHeader.html',
            },
            'content': {
                templateUrl : 'templates/Account.html',

            },
        }
    })
    $urlRouterProvider.otherwise('/');
});


account.controller('editaccountprofile', function($scope, $http,$state,$window) {

    $scope.change_password = function()
    {

        $http({
            method : "POST",
            url : '/change_passoword'
        }).success(function(data) {

            if (data.statusCode == 200) {
                console.log("Success");
            } else {
                console.log("Failure");
            }

        });
    }

    $scope.Profile = function()
    {
        window.location.assign("/Profile");
    }

    $scope.EditProfile = function()
    {
        window.location.assign("/EditProfile");
    }

    $scope.ClickPage = function()
    {
        window.location.assign("/ClickPageGraph");
    }

    $scope.ClickProperty = function()
    {
        window.location.assign("/PropertyClickGraph");
    }
    $scope.TraceUser = function()
    {
        window.location.assign("/TraceUserGraph");
    }
    $scope.TraceBid = function()
    {
        window.location.assign("/TraceBidGraph");
    }

    $scope.logout = function(){
        $window.localStorage.removeItem("username");
        $http({
            method : "POST",
            url : '/logout',
            data : {}
        }).success(function(data) {

            window.location.assign("/");
        });

    };

});
