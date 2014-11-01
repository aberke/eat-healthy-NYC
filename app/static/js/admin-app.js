(function(){
	var app = angular.module('farmer', ['ui.router']);
	app.directive('ngFocus', function($timeout, $rootScope) {
	    return {
	        restrict: 'A',
	        scope: {
	            focusValue: "=ngFocus"
	        },
	        link: function($scope, $element, attrs) {
	            $scope.$watch("focusValue", function(currentValue, previousValue) {
	                if (currentValue === true && !previousValue) {
	                    setTimeout(function(){
	                    	$element[0].focus();
	                    }, 20);
	                } else if (currentValue === false && previousValue) {
	                    $element[0].blur();
	                }
	            })
	        }
	    }
	});
	app.controller('AdminController', function($scope, $state, $stateParams, $http, $q){

		$scope.data;
		$http.get('/data').
		  success(function(res, status, headers, config) {
		    $scope.data = res.data;
		    console.log(res.data);
		  }).
		  error(function(res, status, headers, config) {
		  	console.log(status);
		  });

		/*
		setTimeout(function(){
			// Hide the address bar!
			window.scrollTo(0, 1);
		}, 0);*/
	});
	

	app.controller('ViewController', function($scope, $state, $stateParams, $http, $q){
		this.menuActive = 0;
		this.searchActive = 0;

	});

	app.controller('MapController', 
	function($scope, $state, $stateParams, $http, $q){
	   	var mapStyles = $http.get("/static/js/map.json"),
	        data      = $http.get("/data");

		$q.all([mapStyles, data]).then(function(res) { 
	  		this.mapStyles = res[0].data;
	  		this.data = res[1].data;
	  		init();
		});

		function init() {
            var mapOptions = {
                zoom: 14,
                center: new google.maps.LatLng(40.700066, -73.912039),
                // center: new google.maps.LatLng(userLat, userLng),
                styles: this.mapStyles
            };
            var mapElement = document.getElementById('farmer-market-map');
            var map = new google.maps.Map(mapElement, mapOptions);
            
            var data = this.data.data;

            var addPoints = function(lat, lng, name) {

              var marketMarker = new google.maps.Marker({
                  position:  new google.maps.LatLng(lat, lng),
                  icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    strokeColor: '#ffffff',
                    strokeOpacity: 1,
                    strokeWeight: 2,
                    fillColor: '#c4e71e',
                    fillOpacity: 1,
                    scale: 7
                  },
                  draggable: false,
                  map: map
              });


              var infowindow = new google.maps.InfoWindow({
                  content: '<h2>'+name+'</h2>'
              });

              google.maps.event.addListener(marketMarker, 'click', function() {
                infowindow.open(map,marketMarker);
              });
            }
            
            //load all the data crashes the browser, to be fixed
            for (var i = 0; i < 200; i++) {
                addPoints(data[i].Latitude, data[i].Longitude, data[i].name);
            }


            if (navigator.geolocation) {
               navigator.geolocation.getCurrentPosition(function (position) {
                   initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                   map.setCenter(initialLocation);
               });
            }
        };
	});

	app.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider

			.state('view', {
				views: {
		            '': { 
						templateUrl: '/static/partials/view.html',
						controller: 'ViewController',
						controllerAs: 'view'
		            },
		            'menu@view': { 
		                templateUrl: '/static/partials/menu.html'
		            }
		        }
			})

			.state('view.admin', {
				url: '/admin',
				templateUrl: '/static/partials/admin.html',
				controller: 'AdminController',
				controllerAs: 'admin'
			})


			.state('view.detail', {
				url: '/detail',
				templateUrl: '/static/partials/detail.html'
			});
			
		$urlRouterProvider.otherwise('/map');
	})


})()