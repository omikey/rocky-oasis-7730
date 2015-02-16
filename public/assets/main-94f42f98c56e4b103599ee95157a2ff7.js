


var app = angular.module('app', ['ngResource', 'ngRoute', 'ngSanitize', 'ngDragDrop', 'ui.bootstrap']);

app.factory('Dashboard', ['$resource', function ($resource) {
    return $resource('/main/dashboard');
}]);
app.controller("MasterCtrl", ['$scope', 'Dashboard', function ($scope, Dashboard) {
$scope.data = [];
angular.element(document).ready(function() {
    Dashboard.get(function (resp) {
        $scope.data = resp;

        var canvas = document.getElementById('thisGraph');
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;
        var radius = 200;
        context.lineWidth = 3;
        context.strokeStyle = '#000000';

        for (var i = 0; i < 7; i++) {
            context.beginPath();
            context.arc(centerX, centerY, radius, 0, (i * (2 / 7)) * Math.PI, false);
            context.lineTo(centerX, centerY);
            context.stroke();
            context.closePath();
        }
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 0, false);
        context.lineTo(centerX, centerY);
        context.stroke();
        context.closePath();
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.stroke();

        context.font = "20px Arial";
        context.fillText("Previous", 520, 30);
        context.fillText("Now", 520, 60);

        var cos = 0.62348980185873353052500488400424;
        var sin = 0.78183148246802980870844452667406;
        var greenX = [7];
        var greenY = [7];
        var blueX = [7];
        var blueY = [7];
        var newX = centerX + (radius * cos);
        var newY = centerY + (radius * sin);
        var oldX;
        var oldY;
        greenX[0] = newX;
        greenY[0] = newY;
        blueX[0] = newX;
        blueY[0] = newY;

        for (var i = 0; i < 6; i++) {
            oldX = newX - centerX;
            oldY = newY - centerY;
            newX = centerX + (oldX * cos) - (oldY * sin);
            newY = centerY + (oldX * sin) + (oldY * cos);
            greenX[i + 1] = newX;
            greenY[i + 1] = newY;
            blueX[i + 1] = newX;
            blueY[i + 1] = newY;
        }

        for (var i = 0; i < 4; i++)
        {
            var myPart = $scope.data.listening[i].score;
            var yourPart = 100 - myPart;
            greenX[(i+5) % 7] = ((greenX[(i+5) % 7] * myPart) + (centerX * yourPart)) / 100;
            greenY[(i+5) % 7] = ((greenY[(i+5) % 7] * myPart) + (centerY * yourPart)) / 100;
        }
        for (var i = 0; i < 3; i++)
        {
            var myPart = $scope.data.reading[i].score;
            var yourPart = 100 - myPart;
            greenX[(i+2) % 7] = ((greenX[(i+2) % 7] * myPart) + (centerX * yourPart)) / 100;
            greenY[(i+2) % 7] = ((greenY[(i+2) % 7] * myPart) + (centerY * yourPart)) / 100;
        }
        context.font = "16px Arial";
        var xshift = [0, -22,-50,-50,-22,0,7];
        var yshift = [20,22,10,0,-10,-10,5];
        for (var i = 0; i < 7; i++)
        {
            context.fillText("Part " + ((i+2)%7 + 1), blueX[i%7] + xshift[i], blueY[i%7] + yshift[i]);

            var myPart = $scope.data.improvement[i];
            var yourPart = 100 - myPart;
            blueX[i%7] = ((blueX[i%7] * myPart) + (centerX * yourPart)) / 100;
            blueY[i%7] = ((blueY[i%7] * myPart) + (centerY * yourPart)) / 100;
        }

        context.strokeStyle = '#8888ff';
        context.lineTo(centerX, centerY);
        context.beginPath();
        context.stroke();
        for (var i = 0; i < 8; i++) {
            context.lineTo(blueX[i % 7], blueY[i % 7]);
            context.stroke();
        }
        context.closePath();

        context.strokeStyle = '#0000ff';
        context.lineTo(centerX, centerY);
        context.beginPath();
        context.stroke();
        for (var i = 0; i < 8; i++) {
            context.lineTo(greenX[i % 7], greenY[i % 7]);
            context.stroke();
        }
        context.closePath();

        for (var i = 0; i < 2; i++)
        {
            context.strokeStyle = ['#8888ff','#0000ff'][i];
            context.beginPath();
            context.lineTo(490, 15 + (30 * i));
            context.stroke();
            context.lineTo(510, 15 + (30 * i));
            context.stroke();
            context.lineTo(510, 30 + (30 * i));
            context.stroke();
            context.lineTo(490, 30 + (30 * i));
            context.stroke();
            context.lineTo(490, 15 + (30 * i));
            context.stroke();
            context.closePath();
        }
    });
});
}]);
