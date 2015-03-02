//= require_self
//= require_tree ./angular

var app = angular.module('app', ['ngResource', 'ngRoute', 'ngSanitize', 'ngDragDrop', 'ui.bootstrap']);

app.factory('Dashboard', ['$resource', function ($resource) {
    return $resource('/main/dashboard');
}]);

app.factory('Community', ['$resource', function ($resource) {
    return $resource('/main/community');
}]);

app.factory('RegisterNew', ['$resource', function ($resource) {
    return $resource('/users/create');
}]);

app.factory('SendPost', ['$resource', function ($resource) {
    return $resource('/main/postit');
}]);

app.factory('Register', ['$resource', function ($resource) {
    return $resource('/users/register');
}]);

app.factory('SignOut', ['$resource', function ($resource) {
    return $resource('/main/signout');
}]);
