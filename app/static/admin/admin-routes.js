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
			templateUrl: '/admin/admin-partials/admin-dashboard.html',
			controller: AdminDashboardController
		})
		.when('/admin/detail/:marketId', {
			templateUrl: '/admin/admin-partials/admin-detail.html',
			controller: AdminDetailController
		})
		.when('/admin/detail/new', {
			templateUrl: '/admin/admin-partials/admin-detail.html',
			controller: AdminDetailController
		})

		/*------------------------------------------------------- client views -*/

		.otherwise({
			redirectTo: '/admin'
		});
});







