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


profile.controller('userprofile', function($scope, $http,$state) {


});