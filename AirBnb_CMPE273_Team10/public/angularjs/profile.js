var profile = angular.module('UserProfile', ['ui.router']);
profile.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('UserProfile', {
        url : '/Profile',
        views: {
            'header': {
                templateUrl : 'templates/profileHeader.html',
            },
            'content': {
                templateUrl : 'templates/profileContent.html',

            },
        }
    })
    $urlRouterProvider.otherwise('/');
});


profile.controller('userprofile', function($scope, $http,$state,$window) {

    $scope.Init = function()
    {

        $http({
            method : "POST",
            url : '/view_profile',
        }).success(function(data) {

            if (data.statusCode === 200) {
                console.log("Success");
                $scope.fname = data.Result[0].fname;
                $scope.lname = data.Result[0].lname;
                $scope.username = data.Result[0].username;

                if(data.Result[0].approve_flag === "NO")
                    $scope.isHost = false;
                else
                    $scope.isHost = true;

            } else {
                console.log("Failure");
            }

        });
    }

    $scope.getBillInfo = function()
    {
        $http({
            method : "POST",
            url : '/getBillDetails',
        }).success(function(data) {

            if (data.statusCode === 200) {
                console.log("Success");
                $scope.city = data.Result[0].city;
                $scope.address = data.Result[0].address;
                $scope.propertyname = data.Result[0].propertyname;


                $scope.bills = data.Result;


                if(data.Result[0].approve_flag === "NO")
                    $scope.isHost = false;
                else
                    $scope.isHost = true;

            } else {
                console.log("Failure");
            }

        });
    }




    $scope.Account = function()
    {
        window.location.assign("/Account");
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


    $scope.GenerateBill = function(property)
    {
        console.log("++++++++++++++++++++++++++ PROPERTY DETAILS ++++++++++++++++++++++++++++++++++")
        console.log(property);
        $http({
            method : "POST",
            url : '/save_Bill',
            data : {
                "property" : property
            }
        }).success(function(data) {
            if(statuscode === 200)
            window.location.assign("/Receipt");
        });

    }

});