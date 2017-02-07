angular.module('myapp', ['ChromaOSNotifications'])

  .controller('ChromaOSController', ['$scope', '$rootScope', '$q', 'ChromaOSNotificationsService', function($scope, $rootScope, $q, ChromaOSNotificationsService) {

    $scope.open = function() {
      ChromaOSNotificationsService.open({
        icon: 'fa fa-check',
        title: 'Title',
        timeout: false,
        style: 'neutral',
        size: 'lg',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra, libero a facilisis elementum, erat enim fringilla est, feugiat ullamcorper enim sapien sit amet nibh. Sed convallis, turpis tempor consequat consectetur, lorem est ultricies est, vitae rutrum tortor dolor quis tellus. Suspendisse vel massa sagittis, rutrum ipsum nec, sollicitudin metus. Nullam quis mauris et metus fringilla posuere. In sit amet condimentum quam. Pellentesque eget magna eu eros facilisis ultricies vitae a nibh. Quisque maximus consequat dapibus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc venenatis lobortis placerat. Mauris et metus ac magna ullamcorper consectetur ac at dui.'
      });
    };

  }]);
