
// wraps around all of admin-base
AdminMainController = function($scope) {

	$scope.menuActive = false;
	$scope.toggleMenu = function() {
		$scope.menuActive=!$scope.menuActive;
	}
}

// main admin view is the admin-search.html page - this is the controller
AdminDashboardController = function($scope, markets) {
	console.log("AdminController markets", markets)

	$scope.markets = markets;

	$scope.searchActive = false;


}