/*********************************************************************
----------------------------------------------------------------------

 	Authors: 
 		Alexandra Berke (aberke)
 		Wenting 
 	2014
	NYC


----------------------------------------------------------------------
*********************************************************************/

var FarmersMarketsApp = angular.module('FarmersMarketsApp', ['ngRoute'])

	.config(function($locationProvider) {

		$locationProvider.html5Mode(true);

	})

	.config(function($provide, $filterProvider) {

		// register services
		$provide.service('APIservice', APIservice);
		// $provide.service('InfoService', InfoService);


		// register factories

	});

	// App.config --> routes in routes.js
