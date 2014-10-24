
var MarkerFactory = new MarkerFactory();


var MarketController = function(map) {

	// TODO - BETTER PLACE FOR THIS
	this.marketInfoController = new MarketInfoController();

	this.map = map;
	this.marketList = [];
	this.selectedMarket = null;

}
MarketController.prototype.init = function(dataset) {
	
	for (var i=0; i<dataset.length; i++) {
		var data = dataset[i];
		this.addMarket(data);
	}
	DirectionsRendererFactory.setupDirections(this.map, this.marketInfoController.directionsPanel);
}
MarketController.prototype.addMarket = function(data) {
	var self = this;
	var market = new Market(this.map, data);
	this.marketList.push(market);
	google.maps.event.addListener(market.marker, 'click', this.marketOnSelect());
}
MarketController.prototype.marketOnSelect = function() {
	var self = this;
	var callback = function() {
		// at callback, 'this' is the marker object
		var market = this.market;

		// change market selection to newly clicked on market
		if (self.selectedMarket) {
			var icon = MarkerFactory.makeIcon(self.selectedMarket.data, false);
			self.selectedMarket.marker.setIcon(icon);
		}
		self.selectedMarket = market;
		
		this.map.setCenter(this.getPosition());
		this.setIcon(MarkerFactory.makeIcon(market.data, true));

		self.marketInfoController.showMarketContent(self.selectedMarket.data);
	}
	return callback;
}
MarketController.prototype.getDirections = function(travelMode) {
	this.marketInfoController.getDirections(travelMode, this.selectedMarket);
}
MarketController.prototype.hideDirections = function() {
	this.marketInfoController.hideDirections();
}
MarketController.prototype.hideMarketInfo = function() {
	this.marketInfoController.hide();
}



var Market = function(map, data) {
	/* Market Class --- has
		map
		data
		marker
		infoWindowContent
	*/
	this.map = map;
	this.data = data;
	this.setOpenClosedStatus();
	this.marker = this.buildMarker(data);
}
Market.prototype.setOpenClosedStatus = function() {
	// determine if market is open right now
	if (this.data['bad-hours-data'] || this.data['bad-date-data']) {
		return;
	}

	var now = new Date();
	var today = now.getDay();
	if (today in this.data['days']) {
		this.data.closed = false;
		this.data.open = true;
	} else {
		this.data.closed = true;
		this.data.open = false;
	}
}

Market.prototype.buildMarker = function() {

	marker =  MarkerFactory.make(this.map, this.data);
	marker.market = this;
	return marker;
};








