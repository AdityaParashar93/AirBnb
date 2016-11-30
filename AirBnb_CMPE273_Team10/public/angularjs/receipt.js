var receipt = angular.module('receipt', ['ui.router']);
-receipt.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('receipt', {
        url : '/Receipt',
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


receipt.controller('RECEIPT', function($scope, $http,$state) {



    $scope.Confirm = function()
    {

        $http({
            method : "POST",
            url : '/confirm_receipt'
        }).success(function(data) {

            if (data.statusCode == 200) {
                console.log("Success");
                window.location.assign("/Profile");
            } else {
                console.log("Failure");
            }

        });
    }
});
