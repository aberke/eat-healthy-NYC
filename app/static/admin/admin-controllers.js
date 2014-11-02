
// wraps around all of admin-base
AdminMainController = function($scope, $window, APIservice) {

	console.log("AdminMainController")

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

	$scope.testDate = new Date(1970,0,1,14,57,0);

	$scope.scheduleDays = ['1','2','3','4','5','6','7'];
	$scope.scheduleDaysNames = {
		'1': 'SUNDAY',
		'2': 'MONDAY',
		'3':'TUESDAY',
		'4':'WEDNESDAY',
		'5':'THURSDAY',
		'6':'FRIDAY',
		'7':'SATURDAY'
	}


	console.log("market", $scope.market)
}

// main admin view is the admin-search.html page - this is the controller
AdminDashboardController = function($scope, $location) {

	$scope.searchActive = false;

	$scope.goToDetail = function(market) {
		$location.path("/admin/detail/" + market._id);
	}
}







