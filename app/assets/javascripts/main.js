//= require_self
//= require_tree ./angular

var app = angular.module('app', ['ngResource', 'ngRoute', 'ngSanitize', 'ngDragDrop', 'ui.bootstrap']);

app.factory('Dashboard', ['$resource', function ($resource) {
    return $resource('/main/dashboard');
}]);
