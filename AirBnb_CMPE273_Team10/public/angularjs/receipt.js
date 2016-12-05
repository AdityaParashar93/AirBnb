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


        $http({
            method : "POST",
            url : '/get_bill_data'
        }).success(function(data) {

            if (data.statusCode == 200) {
                console.log("Success");

                $scope.custName = data.billDetails.custName;
                $scope.city = data.billDetails.city;
                $scope.address = data.billDetails.address;
                $scope.property_name = data.billDetails.property_name;
                $scope.room_type = data.billDetails.room_type;
                $scope.number_of_guests = data.billDetails.number_of_guests;
                $scope.dateFrom = data.billDetails.dateFrom;
                $scope.dateTo = data.billDetails.dateTo;
                $scope.stayDuration = data.billDetails.stayDuration;
                $scope.securityDeposit = data.billDetails.securityDeposit;
                $scope.total_cost = data.billDetails.total_cost;


                $scope.total_fees = parseInt(data.billDetails.total_cost) + 300;


                //window.location.assign("/Profile");
            } else {
                console.log("Failure");
            }

        });



    var timestamp = new Date().getUTCMilliseconds();
    console.log(timestamp);
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
