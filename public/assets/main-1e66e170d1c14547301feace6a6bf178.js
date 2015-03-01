var app = angular.module('app', ['ngResource', 'ngRoute', 'ngSanitize', 'ngDragDrop', 'ui.bootstrap']);

app.factory('Dashboard', ['$resource', function ($resource) {
    return $resource('/main/dashboard');
}]);

app.factory('Community', ['$resource', function ($resource) {
    return $resource('/main/community');
}]);

app.factory('SendPost', ['$resource', function ($resource) {
    return $resource('/main/postit');
}]);

app.factory('SignOut', ['$resource', function ($resource) {
    return $resource('/main/signout');
}]);
app.controller("CommunityCtrl", ['$scope', '$window', '$document', 'Community', 'SendPost', function ($scope, $window, $document, Community, SendPost) {
    $scope.data = [];
    $scope.copylink = '';
    $scope.postsCount = 0;
    var swag = {};
    for (var i = 0; i < 10000; i++) {
        swag[i] = [0, 0, 0, 0];
    }

    $scope.deleteMe = function (id) {
        Community.get({'get': 'deletepost', 'id': $('#pickme').attr('name')}, function () {
            $scope.postulate($scope.data[0]['query']);
        })
    };

    $scope.cancelMe = function () {
        window.scrollTo(0, 0);
        $('#posts').fadeOut(500);
        $scope.forumulate($scope.data[0]['query']);
    };

    $scope.submit = function (id) {
        var swagSaver = {};
        for (var i = 0; i < 10000; i++) {
            if ((swag[i][0] != 0) || (swag[i][1] != 0) || (swag[i][2] != 0) || (swag[i][3] != 0))
                swagSaver[i] = swag[i];
        }

        SendPost.get({
            editid: $('#pickme').attr('name'),
            post: $('#textarea').html(),
            query: $scope.data[0]['query'],
            swag: swagSaver
        }, function () {
            $scope.postulate($scope.data[0]['query']);
        });
    };

    $scope.bolder = function (style) {
        var range = window.getSelection().getRangeAt(0);
        var node = range.startContainer;
        if (node.parentNode.id.length < 1) {
            node = node.parentNode;
        }
        var nodes = node.parentNode.childNodes;
        var offset = 0;
        var start = 0;
        var end = 0;
        var k = 0;
        while (nodes[k] != node) {
            start += $(nodes[k]).text().length;
            k++;
        }
        start += range.startOffset;
        var b = $(node).text().length - range.startOffset;
        var selectSpan = range.toString().length;

        if (b < selectSpan) {
            var nextLength = $(node.nextSibling).text().length;
            while ((b + nextLength) < selectSpan) {
                b += nextLength;
                if (node.nextSibling) {
                    node = node.nextSibling;
                    nextLength = $(node.nextSibling).text().length;
                }
            }
            b += range.endOffset;
            end = b + start;
        }
        else {
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i] == node) {
                    i = nodes.length;
                }
                else {
                    offset += $(nodes[i]).text().length;
                }
            }
            start = range.startOffset + offset;
            end = range.endOffset + offset;
        }

        var reverser = true;
        for (var i = start; i < end; i++) {
            if (swag[i] && (swag[i][style] == 0)) {
                reverser = false;
            }
            swag[i][style] = 1;
        }
        if (reverser) {
            for (var i = start; i < end; i++) {
                swag[i][style] = 0;
            }
        }

        stylize();
    };

    function stylize() {
        var text = $('#textarea').text();
        var size = text.length;
        var offset = 0;
        var bold = false;
        var italics = false;
        var underline = false;
        var link = false;

        for (var i = 0; i < size; i++) {
            if (swag[i]) {
                var clipped = false;
                var first = text.substring(0, offset + i);
                var last = text.substring(offset + i);
                var tag = '';
                if (((swag[i][0] == 0) && bold) || ((swag[i][1] == 0) && italics) || ((swag[i][2] == 0) && underline) || ((swag[i][3] == 0) && link)) {
                    bold = false;
                    italics = false;
                    underline = false;
                    link = false;
                    tag += '</m>';
                    clipped = true;
                }
                if (((swag[i][0] == 1) && (!bold || clipped)) || ((swag[i][1] == 1) && (!italics || clipped)) || ((swag[i][2] == 1) && (!underline || clipped)) || ((swag[i][3] == 1) && (!link || clipped))) {
                    var anyTrue = '';
                    anyTrue += bold ? 'font-weight: 600;' : '';
                    anyTrue += italics ? 'font-style: italic;' : '';
                    anyTrue += underline ? 'text-decoration: underline;' : '';
                    anyTrue += link ? ('color: blue; cursor: pointer;" onclick="window.location.href=\'' + $scope.copylink + "'") : '';
                    var anyChanged = false;

                    tag += '<m style="';
                    if ((swag[i][0] == 1) && (!bold || clipped)) {
                        anyChanged = true;
                        bold = true;
                        tag += 'font-weight: 600;';
                    }
                    if ((swag[i][1] == 1) && (!italics || clipped)) {
                        anyChanged = true;
                        italics = true;
                        tag += 'font-style: italic;';
                    }
                    if ((swag[i][2] == 1) && (!underline || clipped)) {
                        anyChanged = true;
                        underline = true;
                        tag += 'text-decoration: underline;';
                    }
                    if ((swag[i][3] == 1) && (!link || clipped)) {
                        anyChanged = true;
                        link = true;
                        tag += 'color: blue; cursor: pointer;" onclick="window.location.href=\'' + $scope.copylink + "'";
                    }

                    if ((anyTrue.length > 0) && anyChanged) {
                        tag = '</m>' + tag + anyTrue;
                    }
                    tag += '">';

                    clipped = false;
                }
                text = first + tag + last;
                offset += tag.length;
            }
        }

        if (bold || italics || underline || link) {
            text = text + '</m>';
        }

        $('#textarea').html(text);
    }

    $scope.selector = function () {
        var s = window.getSelection();
        var p = $('#textarea').get(0);
        var r = document.createRange();
        r.setStart(p, 0);
        r.setEnd(p, 0);
        s.removeAllRanges();
        s.addRange(r);
    };

    $scope.forumulate = function (id) {
        Community.get({'get': 'forum', 'id': id}, function (resp) {
            $('#forums').fadeOut(500);
            $scope.data = resp.queries;
            $('#queries').fadeIn(500);
        });
    };


    $scope.edit = function (id) {
        Community.get({'get': 'edit', 'id': id}, function (resp) {
            for (var i = 0; i < 10000; i++) {
                swag[i] = [0, 0, 0, 0];
            }
            if (resp.post.swag) {
                var hash = JSON.parse(resp.post.swag);
                for (var i = 0; i < 10000; i++) {
                    swag[i] = hash[i] || [0, 0, 0, 0];
                }
            }

            $('#textarea').html(resp.post.message);
            $('#textarea').html($('#textarea').text());

            stylize();
        })
    };

    $scope.postulate = function (id) {
        $scope.postsCount = 0;
        Community.get({'get': 'post', 'id': id}, function (resp) {
            $('#queries').fadeOut(500);
            $scope.data = resp.posts;

            $('#posts').fadeIn(500, function () {
                $('#alterHeight').css('height', parseInt($('#posts').css('height').replace('px', '')) + 100 + 'px');
            });
        });

    };

    $scope.format = function (post) {
        if (post) {
            $('#posts').prepend('<div style="display:none" id="p' + $scope.postsCount + '">' + post + '</div>');
            $scope.postsCount++;
        }
    };

    $scope.last = function (index) {
        if ($('#p' + index).text().length > 0) {
            $('#post' + index).html($('#p' + index).html());
        }
        return '';
    };

    angular.element(document).ready(function () {
        Community.get({'get': 'index'}, function (resp) {
            $scope.data = resp.forums;
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
            dash.css('top', '0');

            if (($(window).width() > 1200) && ($('body').attr('chrome') == 'true')) {
                var canv = $('canvas').get(0);
                dash.append('<img style="border: solid gray 5px; ' +
                'border-radius: 20px; background-color: #f0f0ff; margin-left: 4em; ' +
                'margin-bottom: 6em; height:25em;" src="' +
                canv.toDataURL() + '" />');
                canv.outerHTML = '';
            }

            dash.fadeIn(500);
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
        $(".sliders").fadeOut(1500);
        $.wait(1500).then(function () {
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

            var cell = (($(window).width() > 1200) && ($('body').attr('chrome') == 'true')) ? 10 : 1;
            $('#thisGraph').attr('width', 620 * cell);
            $('#thisGraph').attr('height', 450 * cell);

            var canvas = $('#thisGraph').get(0);
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            var centerX = canvas.width / 2;
            var centerY = canvas.height / 2;
            var radius = 200 * cell;
            context.lineWidth = 3 * cell;
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

            context.font = "" + (20 * cell) + "px Arial";
            context.fillText("Previous", 520 * cell, 30 * cell);
            context.fillText("Now", 520 * cell, 60 * cell);

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
            context.font = "" + (16 * cell) + "px Arial";
            var xshift = [-20 * cell, 5 * cell, 8 * cell, -10 * cell, -30 * cell, -50 * cell, -45 * cell];
            var yshift = [-7 * cell, -5 * cell, 10 * cell, 25 * cell, 25 * cell, 10 * cell, -5 * cell];
            for (var i = 0; i < 7; i++) {
                context.fillText("Part " + ((i) % 7 + 1), blueX[i % 7] + xshift[i], blueY[i % 7] + yshift[i]);

                var myPart = $scope.data.improvement[i];
                var yourPart = 100 - myPart;
                blueX[i % 7] = ((blueX[i % 7] * myPart) + (centerX * yourPart)) / 100;
                blueY[i % 7] = ((blueY[i % 7] * myPart) + (centerY * yourPart)) / 100;
            }

            context.strokeStyle = '#8AB2C3';
            context.lineTo(centerX, centerY);
            context.beginPath();
            context.stroke();
            for (var i = 0; i < 8; i++) {
                context.lineTo(blueX[i % 7], blueY[i % 7]);
            context.stroke();
            }
            context.closePath();

            context.strokeStyle = '#2994c3';
            context.lineTo(centerX, centerY);
            context.beginPath();
            context.stroke();
            for (var i = 0; i < 8; i++) {
                context.lineTo(greenX[i % 7], greenY[i % 7]);
                context.stroke();
            }
            context.closePath();

            for (var i = 0; i < 2; i++) {
                context.strokeStyle = ['#8AB2C3', '#2994c3'][i];
            context.beginPath();
                context.lineTo(490 * cell, 15 * cell + (30 * cell * i));
            context.stroke();
                context.lineTo(510 * cell, 15 * cell + (30 * cell * i));
                context.stroke();
                context.lineTo(510 * cell, 30 * cell + (30 * cell * i));
                context.stroke();
                context.lineTo(490 * cell, 30 * cell + (30 * cell * i));
                context.stroke();
                context.lineTo(490 * cell, 15 * cell + (30 * cell * i));
                context.stroke();
            context.closePath();
            }

            var xLines = [10];
            var yLines = [10];
            context.strokeStyle = "#000000";
            context.font = "" + (10 * cell) + "px Arial";
            for (var i = 0; i < 5; i++) {
                xLines[0 + (2 * i)] = centerX - 5 * cell;
                yLines[0 + (2 * i)] = centerY - (40 * cell * (i + 1));
                xLines[1 + (2 * i)] = centerX + 5 * cell;
                yLines[1 + (2 * i)] = centerY - (40 * cell * (i + 1));
                context.fillText("" + ((i + 1) * 20), centerX + 8 * cell + (i == 4 ? -3 * cell : 0), centerY - (40 * cell * (i + 1)) + 5 * cell + (i == 4 ? 7 * cell : 0));
            }
            context.lineWidth = cell;
            for (var i = 0; i < 7; i++) {
                for (var j = 0; j < 4; j++) {
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
