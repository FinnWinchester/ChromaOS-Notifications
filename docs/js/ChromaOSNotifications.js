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
            delay: notification.delay ? notification.delay : 500,
            timeout: notification.timeout ? notification.timeout : 2000,
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

    var factory = {
      open: open
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
