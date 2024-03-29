'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
    /*
     * APPMain Controller
     */
controller('AppCtrl', function($scope, socket) {


    $scope.socketId = socket.id;
    //$scope.selectedUser = null;

    $scope.seletedUser = (selectedUser) => {
        selectedUser === $scope.socketId ? alert("Can't message to yourself.") : $scope.selectedUser = selectedUser;
    };

    $scope.sendMsg = ($event) => {
        const keyCode = $event.which || $event.keyCode;

        if (keyCode === 13 && $scope.message !== null) {
            socket.emit('getMsg', {
                toid: $scope.selectedUser,
                msg: $scope.message,
                name: $scope.username
            });
            $scope.message = null;
        }
    };


    // Socket listeners
    // ================

    socket.on('init', function(data) {
        $scope.name = data.name;
        $scope.users = data.users;
        $scope.id = data.id;
        $scope.userData = data;
    });

    socket.on('send:message', function(message) {
        $scope.messages.push(message);
        //$scope.messages = data.message;
    });

    socket.on('change:name', function(data) {
        changeName(data.oldName, data.newName);
    });

    socket.on('user:join', function(data) {
        $scope.messages.push({
            user: 'Chatroom-Bot ',
            text: 'Say Hi, User ' + data.name + ' has joined!'
        });
        $scope.users.push(data.name);
    });

    // add a message to the conversation when a user disconnects or leaves the room
    socket.on('user:left', function(data) {
        $scope.messages.push({
            user: 'chatroom',
            text: 'User ' + data.name + ' has left.'
        });
        var i, user;
        for (i = 0; i < $scope.users.length; i++) {
            user = $scope.users[i];
            if (user === data.name) {
                $scope.users.splice(i, 1);
                break;
            }
        }
    });

    // Private helpers
    // ===============

    var changeName = function(oldName, newName) {
        // rename user in list of users
        var i;
        for (i = 0; i < $scope.users.length; i++) {
            if ($scope.users[i] === oldName) {
                $scope.users[i] = newName;
            }
        }

        $scope.messages.push({
            user: 'chatroom',
            text: 'User ' + oldName + ' is now known as ' + newName + '.'
        });
    }

    // Methods published to the scope
    // ==============================

    $scope.changeName = function() {
        socket.emit('change:name', {
            name: $scope.newName
        }, function(result) {
            if (!result) {
                alert('There was an error changing your name');
            } else {

                changeName($scope.name, $scope.newName);

                $scope.name = $scope.newName;
                $scope.newName = '';
            }
        });
    };

    $scope.messages = [];

    $scope.sendMessage = function() {
        socket.emit('send:message', {
            message: $scope.message
        });

        // add the message to our model locally
        $scope.messages.push({
            user: $scope.name,
            text: $scope.message
        });

        // clear message box
        $scope.message = '';
    };

    /*
     *  Methods to Send Private Messages
     */
    $scope.SendPm = function() {
        socket.broadcast.to(data)
    }



});