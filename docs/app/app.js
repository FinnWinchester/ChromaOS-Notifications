angular.module('myapp', ['ChromaOSNotifications'])

  .controller('ChromaOSController', ['$scope', '$rootScope', '$q', 'ChromaOSNotificationsService', function($scope, $rootScope, $q, ChromaOSNotificationsService) {

    $scope.open = function() {
      ChromaOSNotificationsService.open({
        icon: 'fa fa-check',
        title: 'Title',
        timeout: false,
        style: 'neutral',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      });
    };

  }]);
