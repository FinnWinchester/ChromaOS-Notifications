angular.module('ChromaOSNotifications.Templates', ['modules/chromaos-notifications/directives/views/ChromaOSNotificationsDirectiveTemplate.html']);

angular.module("modules/chromaos-notifications/directives/views/ChromaOSNotificationsDirectiveTemplate.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("modules/chromaos-notifications/directives/views/ChromaOSNotificationsDirectiveTemplate.html",
    "<div class=\"chromaos-notification\">\n" +
    "\n" +
    "  <div class=\"chromaos-notification-content\">\n" +
    "    <div class=\"chromaos-notification-content-icon\">\n" +
    "      <i class=\"{{notificationIcon}}\"></i>\n" +
    "    </div>\n" +
    "    <div class=\"chromaos-notification-content-body\">\n" +
    "      <div class=\"chromaos-notification-content-body-title\">\n" +
    "        {{notificationTitle}}\n" +
    "      </div>\n" +
    "      <div class=\"chromaos-notification-content-body-text\">\n" +
    "        {{notificationText}}\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
;/* global $:false */
(function(angular) {
  'use strict';

  angular.module('ChromaOSNotifications.Kernel', [])

  .constant('$', $);

})(window.angular);
;(function(angular) {
  'use strict';

  angular.module('ChromaOSNotifications.Services', []);

})(window.angular);
;(function(angular) {
  'use strict';

  function ChromaOSNotificationsService($, $q, $rootScope, $compile) {

    var notificationWrapper = '<div chromaos-notification title="__notification_title__" text="__notification_text__" icon="__notification_icon__"></div>';
    var openedNotifications = 0;
    var iter = 0;

    var prepareNotification = function(notification) {
      var prepared = notificationWrapper
        .replace('__notification_title__', notification.title)
        .replace('__notification_text__', notification.text)
        .replace('__notification_icon__', notification.icon);
      return prepared;
    };

    function open(notification, args) {
      var newScope = $rootScope.$new(true);
      var renderedApp = $compile(prepareNotification(notification))(newScope, function(a, b, c) {
        setTimeout(function() {
          var renderedHtml = $(a[0]);
          $('body').append(a[0]);
          var finalArgs = {
            html: a[0],
            openedNotifications: openedNotifications,
            delay: notification.delay ? notification.delay : 500,
            timeout: notification.timeout ? notification.timeout : notification.timeout === false ? false : 2000,
            easing: notification.easing ? notification.easing : 'easeOutExpo'
          };
          if (args) {
            angular.extend(finalArgs, args);
          }
          newScope.$broadcast('chromaos-notifications.notification.opened', finalArgs);
          newScope.$apply();
        }, 0);
      });
    }

    var getParsedNId = function(nId) {
      return +nId.replace('ch_n_', '');
    };

    function closed(nId) {
      openedNotifications--;
      if (openedNotifications < 0) openedNotifications = 0;
      $rootScope.$broadcast('chromaos-notifications.notification.relocate', {
        from: getParsedNId(nId)
      });
    }

    function opened() {
      openedNotifications++;
      iter++;
    }

    function getIter() {
      return iter;
    }

    var factory = {
      open: open,
      opened: opened,
      closed: closed,
      getIter: getIter,
      getParsedNId: getParsedNId
    };

    return factory;
  }

  angular.module('ChromaOSNotifications.Services')

    .factory('ChromaOSNotificationsService', ChromaOSNotificationsService);

  ChromaOSNotificationsService.$inject = ['$', '$q', '$rootScope', '$compile'];
})(window.angular);
;(function(angular) {
  'use strict';

  angular.module('ChromaOSNotifications.Modules', [
    'ChromaOSNotifications.Modules.Notifications'
  ]);

})(window.angular);
;(function(angular) {
  'use strict';

  angular.module('ChromaOSNotifications.Modules.Notifications', []);

})(window.angular);
;(function(angular) {
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
;(function(angular) {
  'use strict';

  function ChromaOSNotificationsDirectiveController($scope, $rootScope, $q, $timeout) {

  }

  angular.module('ChromaOSNotifications.Modules.Notifications')

    .controller('ChromaOSNotificationsDirectiveController', ChromaOSNotificationsDirectiveController);

  ChromaOSNotificationsDirectiveController.$inject = ['$scope', '$rootScope', '$q', '$timeout'];
})(window.angular);
;(function(angular) {
  'use strict';

  angular.module('ChromaOSNotifications', [
    'ChromaOSNotifications.Kernel',
		'ChromaOSNotifications.Templates', // Needed when grunting templates (HTML2JS).
		'ChromaOSNotifications.Modules',
		'ChromaOSNotifications.Services'
	]);

})(window.angular);
