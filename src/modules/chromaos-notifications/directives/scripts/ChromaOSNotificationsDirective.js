(function(angular) {
  'use strict';

  function ChromaOSNotificationsDirective($, $rootScope, ChromaOSNotificationsParameter, $timeout) {

    function $init($scope, $element, $controller) {
      var delay, easing, timeout;

      $element.addClass('chromaos-notification-wrapper');
      if (!$scope.nId) {
        $scope.nId = (Math.floor(Math.random() * 90000) + 10000);
      }

      var close = function() {
        $($element).animate({
          right: '-=365px'
        }, delay, easing);
      };

      $scope.$on('chromaos-notifications.notification.opened', function(e, args) {
        delay = args.delay;
        easing = args.easing;
        timeout = args.timeout;

        $($element).animate({
          right: '+=365px'
        }, delay, easing);

        setTimeout(function() {
          close();
        }, delay + timeout);
      });

      $element.addClass('chromaos-notification-' + $scope.nId);
      // $element.find('.chromaos-notification').attr('data-notifications-id', $scope.nId);
      // $controller.$init($element.find('.chromaos-notifications'), $scope.commands);

      $rootScope.$on('chromaos-notifications.username.set', function(e, args) {
        if (args.nId === $scope.nId) {
          $controller.$changeUsername(args.username);
        }
      });

      $rootScope.$on('chromaos-notifications.glue.set', function(e, args) {
        if (args.nId === $scope.nId) {
          $controller.$changeGlue(args.glue);
        }
      });

      $rootScope.$on('chromaos-notifications.environment.set', function(e, args) {
        if (args.nId === $scope.nId) {
          $controller.$changeEnvironment(args.environment);
        }
      });

      $rootScope.$on('chromaos-notifications.input.set', function(e, args) {
        if (args.nId === $scope.nId) {
          $controller.$changeInput(args.input);
        }
      });

      $rootScope.$on('chromaos-notifications.username.reset', function(e, args) {
        if (args.nId === $scope.nId) {
          $controller.$resetUsername();
        }
      });

      $rootScope.$on('chromaos-notifications.glue.reset', function(e, args) {
        if (args.nId === $scope.nId) {
          $controller.$resetGlue();
        }
      });

      $rootScope.$on('chromaos-notifications.environment.reset', function(e, args) {
        if (args.nId === $scope.nId) {
          $controller.$resetEnvironment();
        }
      });

      $rootScope.$on('chromaos-notifications.input.reset', function(e, args) {
        if (args.nId === $scope.nId) {
          $controller.$resetInput();
        }
      });

      $rootScope.$on('chromaos-notifications.all.reset', function(e, args) {
        if (args.nId === $scope.nId) {
          $controller.$resetAll();
        }
      });
    }

    var directive = {
      restrict: 'EA',
      scope: {
        notificationTitle: '@title',
        notificationText: '@text',
        notificationIcon: '@icon',
        nId: '@'
      },
      templateUrl: 'modules/chromaos-notifications/directives/views/ChromaOSNotificationsDirectiveTemplate.html',
      compile: function(element, attributes) {
        return {
          post: function($scope, $element, $attributes, $controller) {
            $init($scope, $element, $controller);
          }
        };
      },
      controller: 'ChromaOSNotificationsDirectiveController'
    };

    return directive;
  }

  angular.module('ChromaOSNotifications.Modules.Notifications')

    .directive('chromaosNotification', ChromaOSNotificationsDirective);

  ChromaOSNotificationsDirective.$inject = ['$', '$rootScope', '$timeout'];
})(window.angular);
