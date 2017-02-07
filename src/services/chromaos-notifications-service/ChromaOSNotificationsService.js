(function(angular) {
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
