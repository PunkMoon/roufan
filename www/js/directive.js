angular.module('app.directives', [])

.directive('timeline', function() {
  return {
      restrict: 'AE',
      transclude: true,
      replace:true,
      templateUrl:'templates/timeline.html'
  };
})
.directive('msgdetail', function() {
  return {
      restrict: 'AE',
      transclude: true,
      replace:true,
      templateUrl:'templates/msgdetail.html'
  };
})
.directive('dragBack', function($ionicGesture, $state) {
  return {
    restrict : 'A',
    link : function(scope, elem, attr) {
      $ionicGesture.on('swipe', function(event) {
        event.preventDefault();
        window.history.back();
      }, elem);
      
    }
  } ; 
})
.directive('hideTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            scope.$watch(attributes.hideTabs, function(value){
                $rootScope.hideTabs = value;
            });
            scope.$on('$destroy', function() {
                $rootScope.hideTabs = false;
            });
        }
    };
});