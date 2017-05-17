'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  /*
   * APPMain Controller
   */
  controller('AppCtrl', function ($scope, socket) {

    socket.on('init', function (data) {
      $scope.name = data.name;
    });

    socket.on('send:name', function (data) {
      $scope.name = data.name;
    });

  }).
  /*
   * APP1 Controller
   */
  controller('MyCtrl1', function ($scope, socket) {
    socket.on('send:time', function (data) {
      $scope.time = data.time;
    });
  }).
  /*
   * APP2 Controller
   */
  controller('MyCtrl2', function ($scope) {
    // write Ctrl here
  });
