
// wraps around all of admin-base
AdminMainController = function($scope, $window, $location, APIservice) {

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
		$location.path('/admin');
		$scope.menuActive = false;
	}
	$scope.goToMap = function() {
		$window.location.href = domain;
	}
}
// detail admin view is where markets are edited
AdminDetailController = function($scope, $routeParams, APIservice) {

	$scope.market = {};

	function initalizeMarket() {
		// if /admin/detail/new --> leave market as empty object in edit mode
		if ($routeParams.marketId == 'new') {
			$scope.editMode = true;
			return;
		}
		$scope.market = $scope.markets[$routeParams.marketId];
	}

	$scope.editMode = false;
	$scope.edit = function() {
		$scope.editMode = true;
	}
	$scope.save = function() {
		// if market has _id: make PUT, else: make POST
		console.log('save', $scope.market)

		if($scope.market._id) {
			APIservice.PUT('/markets/' + $scope.market._id, $scope.market).then(function(ret) {
				$scope.editMode = false;
			});
		} else {
			APIservice.POST('/markets', $scope.market).then(function(ret) {
				$scope.market._id = ret.data._id;
				$scope.editMode = false;
				console.log('$scope.market', $scope.market)
			});
		}

	}

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

	initalizeMarket();
	console.log("market", $scope.market)
}

// main admin view is the admin-search.html page - this is the controller
AdminDashboardController = function($scope, $location) {

	$scope.searchActive = false;

	$scope.newMarket = function() {
		$location.path("/admin/detail/new");
	}
	$scope.goToDetail = function(market) {
		$location.path("/admin/detail/" + market._id);
	}
}







