/*********************************************************************
----------------------------------------------------------------------

 	Authors: 
 		Alexandra Berke (aberke)
 		Wenting 
 	2014
	NYC


----------------------------------------------------------------------
*********************************************************************/



FarmersMarketsAdminApp.config(function($routeProvider) {


	$routeProvider

		/*- client views ----------------------------------------------*/
		.when('/admin', {
			templateUrl: '/static/admin/admin-partials/admin-dashboard.html',
			controller: AdminDashboardController
		})
		.when('/admin/detail/:marketId', {
			templateUrl: '/static/admin/admin-partials/admin-detail.html',
			controller: AdminDetailController
		})

		/*------------------------------------------------------- client views -*/

		.otherwise({
			redirectTo: '/admin'
		});
});







