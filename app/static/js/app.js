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
	});

	app.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider

			.state('welcome', {
				views: {
		            '': { 
						templateUrl: 'templates/welcome.html'
		            },
		            'menu@view': { 
		                templateUrl: 'templates/welcome.html',
		                // controller: 'menuController'
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
		                templateUrl: 'templates/menu.html',
		                // controller: 'menuController'
		            }
		        }
			})

			.state('view.map', {
				url: '/map',
				templateUrl: 'templates/map.html'
			})

			.state('view.admin', {
				url: '/admin',
				templateUrl: 'templates/admin.html',
			});

		$urlRouterProvider.otherwise('/view');
	})


})()