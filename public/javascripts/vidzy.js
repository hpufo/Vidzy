var app = angular.module('Vidzy', ['ngResource','ngRoute']);

//Redirects when the url has the first when param to the templateUrl
app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        })
        .when('/add-video', {
            templateUrl: 'partials/video-form.html',
            controller: 'AddVideoCtrl'
        })
        .when('/video/:id', {
            templateUrl: 'partials/video-form.html',
            controller: 'EditVideoCtrl'
        })
        .when('/video/delete/:id', {
            templateUrl: 'partials/video-delete.html',
            controller: 'DeleteVideoCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);
//The controller
//HomeCtrl name of the controller, [] is the dependices, $scope exposes data to the view. $resource consumes the RESTful API 
app.controller('HomeCtrl', ['$scope', '$resource',
    function($scope, $resource){
        var Videos = $resource('/api/videos');          //Gets the json data from API 
        Videos.query(function(videos){
            $scope.videos = videos;
        });
}]);

//controller for Add Video
//params: AddVideoCtrl: name, dependices[$scope exposes to the view, $resource gets the data from the API and returns an object to work with the results, $location for changing the url in the browser]
app.controller('AddVideoCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location){
        $scope.save = function(){                       //Defining the save button functionailty
            var Videos = $resource('/api/videos');      //Gets the JSON object from the api
            Videos.save($scope.video, function(){       //Save to insert a doc into the Videos collection/table
                $location.path('/');                    //Callback, once the async call is complete location will take us back to the homepage
            });
        };
    }]);
//$routeParams is used for accessing parameters in the URL
app.controller('EditVideoCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){	
        var Videos = $resource('/api/videos/:id', { id: '@_id' }, {     //2nd param provides defualt values for the :id parameter in the route. @ tells Angular to for a preperty called _id in the object included in the body of the request
            update: { method: 'PUT' }
        });

        Videos.get({ id: $routeParams.id }, function(video){
            $scope.video = video;                               //Sets the video Model in scope to the result of the GET
        });

        $scope.save = function(){                               //When the user hits save   
            Videos.update($scope.video, function(){             //Updates the Video collection with whatever is in the form/$scope video model
                $location.path('/');                            //redirects to home    
            });
        }
    }]);

app.controller('DeleteVideoCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        var Videos = $resource('/api/videos/:id');

        Videos.get({ id: $routeParams.id }, function(video){
            $scope.video = video;
        })

        $scope.delete = function(){
            Videos.delete({ id: $routeParams.id }, function(video){
                $location.path('/');
            });
        }
    }]);
