/*********************************************************************
----------------------------------------------------------------------

 	Authors: 
 		Alexandra Berke (aberke)
 		Wenting 
 	2014
	NYC


----------------------------------------------------------------------
*********************************************************************/



FarmersMarketsApp.config(function($routeProvider) {


	$routeProvider

		/*- client views ----------------------------------------------*/
		.when('/', {
			templateUrl: '/html/partials/map.html',
			controller: MapController,
		})

		/*------------------------------------------------------- client views -*/

		.otherwise({
			redirectTo: '/'
		});
});







