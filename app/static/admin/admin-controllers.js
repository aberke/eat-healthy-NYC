
// wraps around all of admin-base
AdminMainController = function($scope, $window) {

	var domain = $window.location.origin;

	/* menu controllers */
	$scope.goToAdmin = function() {
		$scope.menuActive = false;
	}
	$scope.goToMap = function() {
		$window.location.href = domain;
	}
}

// main admin view is the admin-search.html page - this is the controller
AdminDashboardController = function($scope, markets) {
	console.log("AdminController markets", markets)

	$scope.markets = markets;

	$scope.searchActive = false;


}