/**
 * Created by Otto on 2/24/2017.
 */
var app = angular.module('plunker', []);

app.controller('MainCtrl', ['$scope', 'Fabric', function ($scope, Fabric) {

  $scope.nrOfObjects = 4000;
  $scope.objWidth = 50;
  $scope.objHeight = 50;
  $scope.generatedObjects = 0;
  $scope.totalTime = 0;
  $scope.canvasJSON = {};

  $scope.colors = {
    redStart: 100,
    redEnd: 200,
    greenStart: 0,
    greenEnd: 0,
    blueStart: 0,
    blueEnd: 0,
    redSensitivity: 0.4,
    greenSensitivity: 0.2,
    blueSensitivity: 0.2,
    redAntiSmooth: {
      frequency: 0,
      intensity: 0.1
    },
    greenAntiSmooth: {
      frequency: 0,
      intensity: 0.1
    },
    blueAntiSmooth: {
      frequency: 0,
      intensity: 0.1
    }
  };

  $scope.generateObjects = _.throttle(function () {
      if ($scope.nrOfObjects > 5000) {
        $scope.nrOfObjects = 5000;
      } else if ($scope.nrOfObjects + $scope.generatedObjects > 7000) {
        $scope.clearCanvas();
      }
      var tStart = performance.now();
      $scope.generatedObjects = $scope.fabric.addBulkObjects($scope.nrOfObjects);
      $scope.totalTime += performance.now() - tStart;
      console.log('painted in: %s ms', $scope.totalTime);
    }, 2000, {
      'leading': true,
      'trailing': false
    }
  );
  $scope.clearCanvas = function () {
    $scope.totalTime = 0;
    $scope.name = $scope.fabric.clearCanvas();
  };
  $scope.addRect = function () {
    $scope.fabric.addRect(parseInt($scope.objWidth, 10), parseInt($scope.objHeight, 10));
  };
  $scope.setPatternFill = function () {
    $scope.fabric.setPatternFill(null, $scope.colors['orange-100x100']);
  };
  $scope.setPatternFill2 = function () {
    $scope.fabric.setPatternFill2(null, $scope.colors['orange-100x100']);
  };
  $scope.getObjFill = function () {
    $scope.tempImg = $scope.fabric.getObjFill();
  };
  $scope.changeFill = function () {
    $scope.tempImg.width = 200;
  };
  $scope.toJSON = function () {
    return;
    $scope.canvasJSON = $scope.fabric.getJSON();
    console.log($scope.canvasJSON);
  };
  $scope.fromJSON = function () {
    return;
    if ($scope.canvasJSON) {
      $scope.fabric.loadJSON($scope.canvasJSON);
    }
  };
  $scope.updateProperties = function () {
    angular.extend($scope.fabric.colors, $scope.colors);
  };
  $scope.$on('canvas:created', function () {
    $scope.fabric = new Fabric();
    $scope.updateProperties();
  });
  console.log('fabric', $scope.fabric);
}]);

app.service('FabricCanvas', ['FabricWindow', '$rootScope', function (FabricWindow, $rootScope) {
  var self = {
    canvas: null,
    element: null,
    canvas: null
  };

  function createId() {
    return Math.floor(Math.random() * 10000);
  }

  var customCanvas = FabricWindow.util.createClass(FabricWindow.Canvas);

  self.setElement = function (element) {
    self.element = element;
    // $rootScope.$broadcast('canvas:element:selected');
  };
  self.createCanvas = function () {
    self.canvasId = 'fabric-canvas-' + createId();
    self.element.attr('id', self.canvasId);
    self.canvas = new customCanvas(self.canvasId);
    // self.canvas = new FabricWindow.Canvas(self.canvasId);
    $rootScope.$broadcast('canvas:created');
    console.log("canvas created");

    return self.canvas;
  };
  self.getCanvas = function () {
    return self.canvas;
  };
  self.getCanvasId = function () {
    return self.canvasId;
  };
  return self;
}]);

app.factory('FabricWindow', ['$window', function ($window) {
  console.log('$window', $window);
  return $window.fabric;
}]);

app.directive('fabric', ['FabricCanvas', function (FabricCanvas) {
  return {
    restrict: 'EA',
    priority: 0,
    scope: {
      fabric: '='
    },
    controller: function ($scope, $element) {
      console.clear();
      FabricCanvas.setElement($element);
      FabricCanvas.createCanvas();
    }
  };
}]);

// Fabric factory
///////////////////////
app.factory('Fabric', ['FabricCanvas', 'FabricWindow', function (FabricCanvas, FabricWindow) {
  return function () {
    var canvas;
    var self = {
      colors: {
        redStart: 0,
        redEnd: 0,
        greenStart: 0,
        greenEnd: 0,
        blueStart: 0,
        blueEnd: 0,
        redSensitivity: 0,
        greenSensitivity: 0,
        blueSensitivity: 0,
        redAntiSmooth: {
          frequency: 0,
          intensity: 0
        },
        greenAntiSmooth: {
          frequency: 0,
          intensity: 0
        },
        blueAntiSmooth: {
          frequency: 0,
          intensity: 0
        }
      }
    };

    function _getRandomInt(min, max) {
      // var randomVar = Math.random();
      // var randomVarMinMax = randomVar * (max - min + 1);
      // var randomVarFloored = Math.floor(randomVarMinMax);
      // var finalVar = randomVarFloored + min;
      // console.log('Random Vars: ', randomVar, randomVarMinMax, randomVarFloored, finalVar);
      // return finalVar;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // add bulk objects
    self.addBulkObjects = function (nrOfObjects, patternCanvas) {
      currentCanvas = patternCanvas || canvas;

      for (var i = 0; i < nrOfObjects; i++) {
        // setup
        var width = _getRandomInt(2, 40),
          height = _getRandomInt(40, 60),
          left = _getRandomInt(-30, 400),
          top = _getRandomInt(-30, 400),
          angle = _getRandomInt(0, 180),
          opacity = Math.random() * 0.4,
          // redChannel = _laCeaun(130, 255, top, 'asc'),
          redChannel = _laCeaun({
            start: parseInt(self.colors.redStart),
            end: parseInt(self.colors.redEnd),
            directionAdjustment: top,
            order: 'asc',
            weightSensitivity: self.colors.redSensitivity,
            antiSmooth: self.colors.redAntiSmooth
          }),
          greenChannel = _laCeaun({
            start: parseInt(self.colors.greenStart),
            end: parseInt(self.colors.greenEnd),
            directionAdjustment: top,
            order: 'asc',
            weightSensitivity: self.colors.greenSensitivity,
            antiSmooth: self.colors.greenAntiSmooth
          }),
          // blueChannel = greenChannel,
          blueChannel = _laCeaun({
            start: parseInt(self.colors.blueStart),
            end: parseInt(self.colors.blueEnd),
            directionAdjustment: top,
            order: 'asc',
            weightSensitivity: self.colors.blueSensitivity,
            antiSmooth: self.colors.blueAntiSmooth
          }),
          fill = 'rgba(' + redChannel + ',' + greenChannel + ',' + blueChannel + ',1)';

        // frequency: [0, 1] > bigger means higher frequency
        // intensity: [0, 1] > bigger means more drastic results
        function _getAntiSmoothFactor(antiSmoothParams) {
          var frequency = parseFloat(antiSmoothParams.frequency) || 0;
          if (frequency == 0) {
            return 1;
          }
          var intensity = parseFloat(antiSmoothParams.intensity) || 0;
          var result = Math.random() + (frequency - 0.5);
          console.log('asf', result, frequency, Math.round(result));
          return Math.round(result) >= 1 ? intensity + 1 : 1;
        }

        function _laCeaun(params) {
          var upperThreshold = 255;
          var lowerThreshold = 0;
          // weight sensitivity > higher values emphasizes it's effects
          var weightSensitivity = params.weightSensitivity || 0;
          var antiSmoothFactor;
          if (params && params.hasOwnProperty('antiSmooth')) {
            antiSmoothFactor = _getAntiSmoothFactor(params.antiSmooth);
          }
          var directionAdjustment = params.directionAdjustment || 0;
          var order = params.order || 'asc';
          var start = params.start || 0;
          var end = params.end || 0;

          // weight our random color range value
          var colorRangeValue = _getRandomInt(start, end);
          console.log(colorRangeValue, start, end);
          if (order == 'asc') {
            weightedValue = (colorRangeValue + directionAdjustment * weightSensitivity) * antiSmoothFactor;
            // weightedValue = (colorRangeValue + directionAdjustment * weightSensitivity);
          } else if (order == 'desc') {
            weightedValue = (colorRangeValue - directionAdjustment * weightSensitivity) * antiSmoothFactor;
          }

          console.log("WV: %s > colorRangeValue: %s > directionAdjustment: %s > Sensitivity: %s > ASF: %s", weightedValue, colorRangeValue, directionAdjustment, weightSensitivity, antiSmoothFactor);
          // apply threshold
          weightedValue = weightedValue < lowerThreshold ? 0 : weightedValue;
          weightedValue = weightedValue > upperThreshold ? 255 : weightedValue;
          return parseInt(weightedValue, 10);
        }

        /*var rect = new fabric.Rect({
         left: left,
         top: top,
         opacity: opacity,
         angle: angle,
         // fill: 'rgba(' + _getRandomInt(100, 255) + ',29,28,' + Math.random() + ')',
         fill: fill,
         width: width,
         height: height
         });*/
        // circle
        /*var circle = new fabric.Ellipse({
         // radius: _getRandomInt(5, 60),
         fill: fill,
         opacity: opacity,
         angle: angle,
         top: top,
         left: left,
         rx: _getRandomInt(5, 20),
         ry: _getRandomInt(20, 50),
         });*/
        var startPoints = [{
          x: 30,
          y: 0
        }, {
          x: _getRandomInt(30, 70),
          y: 0
        }, {
          x: _getRandomInt(40, 100),
          y: _getRandomInt(10, 60)
        }, {
          x: _getRandomInt(20, 60),
          y: _getRandomInt(20, 60)
        }];

        var clonedStartPoints = startPoints.map(function (o) {
          return fabric.util.object.clone(o);
        });

        var trapezoid = new fabric.Polygon(clonedStartPoints, {
          left: left,
          top: top,
          fill: fill,
          opacity: opacity,
          // angle: angle,
        });

        // console.log(fill);
        currentCanvas.add(trapezoid);
      }
      currentCanvas.renderAll();
      return currentCanvas.getObjects().length;
    };

    self.clearCanvas = function (obj) {
      canvas.clear();
    };

    self.init = function () {
      canvas = FabricCanvas.getCanvas();
      canvas.renderOnAddRemove = false;
      canvas.stateful = false;
    };

    self.init();
    return self;
  };
}]);
