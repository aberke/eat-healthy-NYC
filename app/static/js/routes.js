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

		/*- cleaner views ----------------------------------------------*/
		.when('/', {
			templateUrl: '/static/html/partials/map.html',
			controller: MapController,
		})

		/*------------------------------------------------------- client views -*/

		.otherwise({
			redirectTo: '/'
		});
});







