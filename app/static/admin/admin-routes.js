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
			controller: AdminDashboardController,
			resolve: {
				markets: function(APIservice) {
					return APIservice.GETmarkets().then(function(ret) {
						return ret.data;
					});
				}
			}
		})

		/*------------------------------------------------------- client views -*/

		.otherwise({
			redirectTo: '/admin'
		});
});






