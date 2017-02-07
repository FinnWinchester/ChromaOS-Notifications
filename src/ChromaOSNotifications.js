(function(angular) {
  'use strict';

  angular.module('ChromaOSNotifications', [
    'ChromaOSNotifications.Kernel',
		'ChromaOSNotifications.Templates', // Needed when grunting templates (HTML2JS).
		'ChromaOSNotifications.Modules',
		'ChromaOSNotifications.Services'
	]);

})(window.angular);
