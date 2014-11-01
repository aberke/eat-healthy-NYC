/*********************************************************************
----------------------------------------------------------------------

 	Authors: 
 		Alexandra Berke (aberke)
 		Wenting 
 	2014
	NYC


----------------------------------------------------------------------
*********************************************************************/

var FarmersMarketsAdminApp = angular.module('FarmersMarketsAdminApp', ['ngRoute'])

	.config(function($locationProvider) {

		$locationProvider.html5Mode(true);

	})

	.config(function($provide, $filterProvider) {

		// register services
		$provide.service('APIservice', APIservice);


		// register factories

	});