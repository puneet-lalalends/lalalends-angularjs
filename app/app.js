'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.scoreField',
    'myApp.config',
    'myApp.version'
]).config(['$locationProvider', '$routeProvider','$httpProvider', function ($locationProvider, $routeProvider,$httpProvider) {
    $locationProvider.hashPrefix('!');

    // $httpProvider.defaults.useXDomain = true;
    // $httpProvider.defaults.headers.common = 'Content-Type: application/json';
    // delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $routeProvider.otherwise({redirectTo: '/scoreField'});
}]);
