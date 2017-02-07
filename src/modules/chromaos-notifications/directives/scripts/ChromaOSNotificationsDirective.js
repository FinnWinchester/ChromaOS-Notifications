(function(angular) {
  'use strict';

  function ChromaOSNotificationsDirective($, $rootScope, ChromaOSNotificationsService) {

    function $init($scope, $element, $controller) {
      var delay, easing, timeout, timeoutId, remaining, start, openedNotifications, closeable = true;

      $element.addClass('chromaos-notification-wrapper');
      $scope.nId = 'ch_n_' + ChromaOSNotificationsService.getIter();
      $element.attr('data-n-id', $scope.nId);

      var close = function() {
        $($element).animate({
          right: '-=365px'
        }, delay, easing);
        ChromaOSNotificationsService.closed($scope.nId);
      };

      var startTimeout = function(time) {
        start = new Date();
        timeoutId = setTimeout(function() {
          close();
        }, time);
      };

      var pauseTimeout = function() {
        clearTimeout(timeoutId);
        remaining -= new Date() - start;
      };

      $rootScope.$on('chromaos-notifications.notification.relocate', function(e, args) {
        if (ChromaOSNotificationsService.getParsedNId($scope.nId) >= args.from) {
          $($element).animate({
            top: '-=130px'
          }, delay, easing);
        }
      });

      $scope.$on('chromaos-notifications.notification.opened', function(e, args) {
        ChromaOSNotificationsService.opened();
        delay = args.delay;
        easing = args.easing;
        timeout = args.timeout;
        openedNotifications = args.openedNotifications;
        remaining = args.delay + args.timeout;

        if (timeout) startTimeout(delay + timeout);

        $($element).css('top', (130 * openedNotifications + 10) + 'px');
        $($element).animate({
          right: '+=365px'
        }, delay, easing);
      });

      $($element).on('mouseenter', function() {
        remaining -= new Date() - start;
        pauseTimeout();
      });

      $($element).on('mouseleave', function() {
        if (timeout) startTimeout(remaining);
      });

      $($element).on('click', function() {
        if (closeable) {
          closeable = false;
          close();
        }
      });

      $element.addClass('chromaos-notification-' + $scope.nId);
    }

    var directive = {
      restrict: 'EA',
      scope: {
        notificationTitle: '@title',
        notificationText: '@text',
        notificationIcon: '@icon'
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

  ChromaOSNotificationsDirective.$inject = ['$', '$rootScope', 'ChromaOSNotificationsService'];
})(window.angular);
