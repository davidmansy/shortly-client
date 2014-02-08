var app = angular.module('shortlyApp', ['ngRoute']);
// Dependency injection
// How our app get what it needs to run
// TO get the name, we are dependent of the scope variable to be available to us
app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'LinksController',
      templateUrl: '/templates/home.html' //Location of the template
    })
    .when('/shorten', {
      controller: 'LinkFormController',
      templateUrl: '/templates/linkform.html'
    })
    .otherwise({
      redirectTo: '/'
    });
});

app.controller('NavController', function($scope) {
  console.log('Hello I am in NavController');
  $scope.indexSelected = 'selected';
  $scope.createSelected = '';
  console.log($scope.indexSelected);

  $scope.updateNav = function(className) {
    if(className === 'index') {
      $scope.indexSelected = 'selected';
      $scope.createSelected = '';
    } else {
      $scope.indexSelected = '';
      $scope.createSelected = 'selected';      
    }
  };
});

//Service for authentication
// .service('UserService', function() {
//   var currentUser = undefined;

//   this.setCurrentUser = function(u) {
//     currentUser = u;
//   };
//   this.currentUser = function() {
//     return currentUser;
//   };

// });

// .service('AuthService', function($http, UserService) {
//   this.login = function(userName, password) {
//     $http({
//       method, url, data with userName and password
//     })
//     .then(function(data, code) {
//       if(code === 200) UserService.setCurrentUser(data.token);

//     });
//   };

// });

// .service('AuthInterceptor', function() {
//   return {
//     'request' : function() {
//       if (UserService.currentUser()) {
//         req.params['token'] = UserService.currentUser();
//       }
//       return req;  //Session do not into play here, on the server side, you'll need to check
//     },
//     'requestError' : function() {}
//   };
// });

//http intercepter can be created in Angular that will add the token to each request
//If no valid user receive 401 and so you need to go to login
// .config(function($httpProvider) {
//   $httpProvider.interceptors.push('AuthInterceptor');
// });

// app.controller('FrameController', function($scope, UserService) {
//   $scope.login = function() {
//     AuthService.login($scope.user.userName, $scope.user.password)
//   };
// });


app.service('LinkService', function($http) {
  this.getLinks = function() {
    return $http({
      method: 'GET',
      url: '/links' //Instead of calling a callback, use a promise which is an object saying that when I am
      // done, I will call the success function
    });
  };
  this.postLink = function(url) {
    return $http({
      method: 'POST',
      url: '/links',
      data: {url: url}
    });

  };
});

app.controller('LinksController', function($scope, $location, LinkService) { //$http is injected in the function
  //Important to put scope and http in the right order
  //Each time a controller is called, the data are refreshed, the controller is recreated
  //So don't use http in a controller, put it in a service!!!
  $scope.port = $location.port();
  $scope.host = $location.host();
  LinkService.getLinks()
  .then(function(obj) {
    $scope.links = obj.data; //Directives is a function running on an element and adding interactivity to an element
  });
});

app.controller('LinkFormController', function($scope, $location, LinkService) {
  $scope.port = $location.port();
  $scope.host = $location.host();
  $scope.links = [];
  $scope.shortenUrl = function() {
    console.log($scope.url);
    LinkService.postLink($scope.url)
    .then(function(linkObj) {
      console.log(linkObj.data);
      $scope.links.push(linkObj.data);
    });
  };
});
