angular.module('starter', ['ionic', 'starter.controllers','starter.services',
  'ngCordova','starter.directives','ionicLazyLoad','starter.constants','starter.elastic'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(['$stateProvider','$urlRouterProvider','$ionicConfigProvider','$locationProvider',

  function($stateProvider,$urlRouterProvider,$ionicConfigProvider,$locationProvider) {
    //Modify the tabs of android display position! start
      $ionicConfigProvider.platform.ios.tabs.style('standard');
      $ionicConfigProvider.platform.ios.tabs.position('bottom');
      $ionicConfigProvider.platform.android.tabs.style('standard');
      $ionicConfigProvider.platform.android.tabs.position('standard');

      $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
      $ionicConfigProvider.platform.android.navBar.alignTitle('left');

      $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
      $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

      $ionicConfigProvider.platform.ios.views.transition('ios');
      $ionicConfigProvider.platform.android.views.transition('android');
      //Modify the tabs of android display position! end
    $stateProvider
    .state("tabs",{
      url:"/tab",
      abstract: true,
      templateUrl: "templates/tabs.html",
      controller:"tabCtrl"
    })
    .state('tabs.home', {
             url: "/home",
             views: {
               'home-tab': {
                 templateUrl: "templates/home.html",
                 controller:"homeCtrl"
               }
             }
         })
    .state('login',{
      url:"/login",
      templateUrl: "templates/login.html",
      controller:"loginCtrl"
    })
    .state('tabs.mentions',{
      url:"/mentions",
      views:{
        "mentions-tab":{
          templateUrl: "templates/mentions.html",
          controller:'mentionCtrl'
        }
      }
    })
    .state('tabs.mentions.at',{
      url:"/at",
      views:{
        "at-page":{
          templateUrl: "templates/at.html",
          controller:'atCtrl'
        }
      }
    })
    .state('tabs.mentions.private',{
      url:"/private",
      views:{
        "private-page":{
          templateUrl: "templates/private.html",
          controller:'privateCtrl'
        }
      }
    })
    .state('tabs.conver',{
      url:"/conversation/:userId",
      views:{
        "mentions-tab":{
          templateUrl: "templates/conversation.html",
          controller:'converCtrl'
        }
      }
    })
    .state('tabs.mentions.request',{
      url:"/request",
      views:{
        "request-page":{
          templateUrl: "templates/request.html",
          controller:'requestCtrl'
        }
      }
    })
    .state('tabs.post',{
      url:"/post",
      views:{
        "post-tab":{
          templateUrl: "templates/post.html"
        }
      }
    })
    .state('tabs.browse',{
      url:"/browse",
      views:{
        "browse-tab":{
          templateUrl: "templates/browse.html",
          controller:'browseCtrl'
        }
      }
    })
    .state('search',{
      url:"/search",
      templateUrl: "templates/search.html",
      controller:"searchCtrl"
    })
    .state('tabs.my',{
      url:"/my",
      views:{
        "my-tab":{
          templateUrl: "templates/my.html",
          controller:"userCtrl"
        }
      }
    })
    .state('tabs.status',{
      url:"/status/:userId",
      views:{
        "my-tab":{
          templateUrl: "templates/status.html",
          controller:"statusCtrl"
        }
      }
    })
    .state('tabs.followers',{
      url:"/followers/:userId",
      views:{
        "my-tab":{
          templateUrl: "templates/followers.html",
          controller:"followersCtrl"
        }
      }
    })
    .state('tabs.friends',{
      url:"/friends/:userId",
      views:{
        "my-tab":{
          templateUrl: "templates/friends.html",
          controller:"friendsCtrl"
        }
      }
    })
    .state('tabs.fav',{
      url:"/fav/:userId",
      views:{
        "my-tab":{
          templateUrl: "templates/fav.html",
          controller:"favCtrl"
        }
      }
    })
    .state('tabs.pic',{
      url:"/pic/:userId",
      views:{
        "my-tab":{
          templateUrl: "templates/pic.html",
          controller:"picCtrl"
        }
      }
    })
    .state('tabs.blacklist',{
      url:"/blacklist/:userId",
      views:{
        "my-tab":{
          templateUrl: "templates/blacklist.html",
          controller:"blacklistCtrl"
        }
      }
    })
    .state('detail',{
      url:"/detail/:msgId",
      templateUrl:"templates/detail.html",
      controller:"detailCtrl"
    });

    $urlRouterProvider.otherwise("tab/home");
}]);
