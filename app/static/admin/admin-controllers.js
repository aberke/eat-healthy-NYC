
// wraps around all of admin-base
AdminMainController = function($scope, $window, APIservice) {

	var domain = $window.location.origin;

	$scope.markets = {};
	APIservice.GETmarkets().then(function(ret) {
		var marketsList = ret.data;
		var market;
		for (var i=0; i<marketsList.length; i++) {
			market = marketsList[i];
			$scope.markets[market._id] = market;
		}
		console.log("$scope.markets: ", $scope.markets)
	});

	/* menu controllers */
	$scope.goToAdmin = function() {
		$scope.menuActive = false;
	}
	$scope.goToMap = function() {
		$window.location.href = domain;
	}
}
// detail admin view is where markets are edited
AdminDetailController = function($scope, $routeParams, APIservice) {
	console.log("AdminDetailController", $routeParams, $scope.markets)
	$scope.market = $scope.markets[$routeParams.marketId];

	console.log("market", $scope.market)
}

// main admin view is the admin-search.html page - this is the controller
AdminDashboardController = function($scope, $location) {

	$scope.searchActive = false;

	$scope.goToDetail = function(market) {
		$location.path("/admin/detail/" + market._id);
	}
}







