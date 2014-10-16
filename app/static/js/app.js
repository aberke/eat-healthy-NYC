(function(){
	var app = angular.module('farmer', ['ui.router']);
	app.controller('AdminController', function($scope, $state){
		// this.data = mainViewData;

		setTimeout(function(){
			// Hide the address bar!
			window.scrollTo(0, 1);
		}, 0);
	});
	

	app.controller('ViewController', function($scope, $state){
		this.menuActive = 0;
		this.searchActive = 0;
	});

	app.controller('MapController', 
	function($scope, $state, $stateParams, $http, $q){
	   	var mapStyles = $http.get("js/map.json"),
	        data      = $http.get("js/data.json");
			
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

			.state('welcome', {
				views: {
		            '': { 
						templateUrl: 'templates/welcome.html'
		            },
		            'menu@view': { 
		                templateUrl: 'templates/welcome.html'
		            }
		        }
			})

			.state('view', {
				views: {
		            '': { 
						templateUrl: 'templates/view.html',
						controller: 'ViewController',
						controllerAs: 'view'
		            },
		            'menu@view': { 
		                templateUrl: 'templates/menu.html'
		            }
		        }
			})

			.state('view.map', {
				url: '/map',
				templateUrl: 'templates/map.html',
		        controller: 'MapController'
			})

			.state('view.admin', {
				url: '/admin',
				templateUrl: 'templates/admin.html',
			});

		$urlRouterProvider.otherwise('/map');
	})


})()