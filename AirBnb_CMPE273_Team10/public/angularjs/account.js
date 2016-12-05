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
 //   $urlRouterProvider.otherwise('/');
});


account.controller('editaccountprofile', function($scope, $http,$window) {

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

                $scope.cardNo = data.Result[0].credit_card_details[0].CardNo;
                $scope.Month = data.Result[0].credit_card_details[0].Month;
                $scope.Year = data.Result[0].credit_card_details[0].Year;

                if(data.Result[0].approve_flag === "NO")
                    $scope.isHost = false;
                else
                    $scope.isHost = true;

            } else {
                console.log("Failure");
            }

        });
    }

    $scope.Landing = function()
    {
        window.location.assign("/")
    }


    $scope.change_password = function()
    {

        $http({
            method : "POST",
            url : '/change_passoword'
        }).success(function(data) {

            if (data.statusCode == 200) {
                console.log("Success");
                $scope.fname = data.Result[0].fname;
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


    $scope.validateCard = function()
    {
        var cardNo = $scope.CardNo;
        var Month = $scope.Month;
        var Year = $scope.Year;
        var CCV = $scope.CCV;

        $http({
            method : "POST",
            url : '/store_card_details',
            data : {
                "cardNo" : cardNo,
                "Month" : Month,
                "Year" : Year,
                "CCV" : CCV
            }
        }).success(function(data) {
            if(data.statusCode == 200)
                window.location.assign("/Account");
        });


    }

});
