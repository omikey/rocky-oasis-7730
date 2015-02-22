var app = angular.module('app', ['ngResource', 'ngRoute', 'ngSanitize', 'ngDragDrop', 'ui.bootstrap']);

app.factory('Dashboard', ['$resource', function ($resource) {
    return $resource('/main/dashboard');
}]);

app.factory('Community', ['$resource', function ($resource) {
    return $resource('/main/community');
}]);

app.factory('SignOut', ['$resource', function ($resource) {
    return $resource('/main/signout');
}]);
app.controller("CommunityCtrl", ['$scope', 'Community', function ($scope, Community) {
    $scope.data = [];


    angular.element(document).ready(function () {
        Community.get(function (resp) {
            $scope.data = resp.hello + '!!!';
        });
    });
}]);
app.controller("MasterCtrl", ['$scope', '$timeout', 'Dashboard', 'SignOut', function ($scope, $timeout, Dashboard, SignOut) {
    $scope.data = [];
    $scope.loginId = '';
    $scope.loginPass = '';
    var clock = 0;


    $scope.focusTab = function (event) {
        $('.tabs').css('background-color', '#262626');
        $(event.target).css('background-color', 'gray');
        var getSlider = $('#' + $(event.target).attr('name'));
        $('.sliders').not(getSlider).fadeOut(500);
        getSlider.fadeIn(500);
        getSlider.css('top', '0');
    };

    $scope.alert = function (message) {
        clock++;
        if (clock == 6) {
            if (message) {
                $scope.messenger(message, 300, 200, "Welcome!", ["Cool!"]);
            }
            $('.sliders').not('#Dashboard').fadeOut(500);
            var dash = $('#Dashboard');
            dash.fadeIn(500);
            dash.css('top', '0');

            dash.append('<img style="border: solid gray 5px; ' +
            'border-radius: 20px; background-color: #f0f0ff; margin-left: 4em; ' +
            'margin-bottom: 6em; height:30em;" src="' +
            $('canvas').get(0).toDataURL() + '" />');
            $('canvas').get(0).outerHTML = '';

        }
    };

    $scope.doLogin = function () {
        alert($scope.loginId);
        alert($scope.loginPass);
    };

    $scope.regLog = function (switcher) {
        switch (switcher) {
            case 1:
                register();
                break;
            case 2:
                login();
                break;
            case 3:
                signOut();
                break;
            case 4:
                profile();
                break;
        }
    };

    function signOut() {
        SignOut.get();
        $scope.refresh();
    }

    function login() {
        $scope.messenger($('#login').html(), 300, 270, "Sign-in", ["Cancel", "Submit"]);
        $('.ui-button:last').attr('onclick', '$("input:last").click()');
        $('form').attr('onsubmit', '$("#refresh").click()');
    }

    $scope.refresh = function () {
        $(".sliders").fadeOut(1000);
        $.wait(1000).then(function () {
            window.location.href = "http://rocky-oasis-7730.herokuapp.com"
        });
    };

    $.wait = function (ms) {
        var defer = $.Deferred();
        setTimeout(function () {
            defer.resolve();
        }, ms);
        return defer;
    };

    function profile() {

    }

    function register() {
        $scope.messenger($('#register').html(), 300, 440, "Register for free!", ["Cancel", "Submit"]);
        $('.ui-button:last').attr('onclick', '$("input:last").click()');
        $('form').attr('onsubmit', '$("#verify").click()');
    }

    $scope.messenger = function (message, x, y, title, array) {
        $('#message').html(message);
        var dialogConfirm = $('#dialog-confirm');
        dialogConfirm.attr('title', title);
        $('#ui-id-1').html(title);
        var labelHash = [0];
        for (i in array) {
            labelHash[i] = {
                text: array[i],
                click: function () {
                    $(this).dialog("close");
                }
            };
        }
        dialogConfirm.dialog({
            resizable: false,
            height: y,
            width: x,
            modal: true,
            buttons: labelHash
        });
    };

    angular.element(document).ready(function () {
        Dashboard.get(function (resp) {
            $scope.data = resp;

            var canvas = $('#thisGraph').get(0);
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            var centerX = canvas.width / 2;
            var centerY = canvas.height / 2;
            var radius = 2000;
            context.lineWidth = 30;
            context.strokeStyle = '#000000';
            context.lineCap = 'round';
            context.lineJoin = 'round';

            for (var i = 0; i < 7; i++) {
                context.beginPath();
                context.arc(centerX, centerY, radius, 0, (((i * (2 / 7)) * Math.PI) + (1.5 * Math.PI)) % (2 * Math.PI), false);
                context.lineTo(centerX, centerY);
                context.stroke();
                context.closePath();
            }
            context.beginPath();
            context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            context.stroke();
            context.closePath();

            context.font = "200px Arial";
            context.fillText("Previous", 5200, 300);
            context.fillText("Now", 5200, 600);

            var cos = 0.62348980185873353052500488400424;
            var sin = 0.78183148246802980870844452667406;
            var greenX = [7];
            var greenY = [7];
            var blueX = [7];
            var blueY = [7];
            var newX = centerX;
            var newY = centerY - radius;
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

            for (var i = 0; i < 4; i++) {
                var myPart = $scope.data.listening[i].score;
                var yourPart = 100 - myPart;
                greenX[(i + 7) % 7] = ((greenX[(i + 7) % 7] * myPart) + (centerX * yourPart)) / 100;
                greenY[(i + 7) % 7] = ((greenY[(i + 7) % 7] * myPart) + (centerY * yourPart)) / 100;
            }
            for (var i = 0; i < 3; i++) {
                var myPart = $scope.data.reading[i].score;
                var yourPart = 100 - myPart;
                greenX[(i + 4) % 7] = ((greenX[(i + 4) % 7] * myPart) + (centerX * yourPart)) / 100;
                greenY[(i + 4) % 7] = ((greenY[(i + 4) % 7] * myPart) + (centerY * yourPart)) / 100;
            }
            context.font = "160px Arial";
            var xshift = [-200, 50, 80, -100, -300, -500, -450];
            var yshift = [-70, -50, 100, 250, 250, 100, -50];
            for (var i = 0; i < 7; i++) {
                context.fillText("Part " + ((i) % 7 + 1), blueX[i % 7] + xshift[i], blueY[i % 7] + yshift[i]);

                var myPart = $scope.data.improvement[i];
                var yourPart = 100 - myPart;
                blueX[i % 7] = ((blueX[i % 7] * myPart) + (centerX * yourPart)) / 100;
                blueY[i % 7] = ((blueY[i % 7] * myPart) + (centerY * yourPart)) / 100;
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

            for (var i = 0; i < 2; i++) {
                context.strokeStyle = ['#8888ff', '#0000ff'][i];
                context.beginPath();
                context.lineTo(4900, 150 + (300 * i));
                context.stroke();
                context.lineTo(5100, 150 + (300 * i));
                context.stroke();
                context.lineTo(5100, 300 + (300 * i));
                context.stroke();
                context.lineTo(4900, 300 + (300 * i));
                context.stroke();
                context.lineTo(4900, 150 + (300 * i));
                context.stroke();
                context.closePath();
            }

            var xLines = [10];
            var yLines = [10];
            context.strokeStyle = "#000000";
            context.font = "100px Arial";
            for (var i = 0; i < 5; i++) {
                xLines[0 + (2 * i)] = centerX - 50;
                yLines[0 + (2 * i)] = centerY - (400 * (i + 1));
                xLines[1 + (2 * i)] = centerX + 50;
                yLines[1 + (2 * i)] = centerY - (400 * (i + 1));
                context.fillText("" + ((i + 1) * 20), centerX + 80 + (i == 4 ? -30 : 0), centerY - (400 * (i + 1)) + 50 + (i == 4 ? 70 : 0));
            }
            context.lineWidth = 10;
            for (var i = 0; i < 7; i++) {
                for (var j = 0; j < 5; j++) {
                    context.beginPath();
                    context.moveTo(xLines[j * 2], yLines[j * 2]);
                    context.lineTo(xLines[(j * 2) + 1], yLines[(j * 2) + 1]);
                    context.stroke();
                    context.closePath();
                }
                for (var j = 0; j < 10; j++) {
                    oldX = xLines[j] - centerX;
                    oldY = yLines[j] - centerY;
                    xLines[j] = centerX + (oldX * cos) - (oldY * sin);
                    yLines[j] = centerY + (oldX * sin) + (oldY * cos);
                }
            }
        });
    });
}]);
