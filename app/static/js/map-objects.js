
var MarkerFactory = new MarkerFactory();


var MarketController = function(map) {

	this.map = map;
	this.marketList = [];
	this.selectedMarket = null;
}
MarketController.prototype.init = function(dataset) {
	
	for (var i=0; i<dataset.length; i++) {
		var data = dataset[i];
		this.addMarket(data);
	}
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
			var icon = MarkerFactory.make(self.map, self.selectedMarket.data, false);
			self.selectedMarket.marker.setIcon(icon);
		}
		self.selectedMarket = market;
		
		this.map.setCenter(this.getPosition());
		this.setIcon(MarkerFactory.make(self.map, market.data, true));

		//marketInfoController.showMarketContent(self.selectedMarket.getInfoWindowContent());
		marketInfoController.showMarketContent(self.selectedMarket.data);

		console.log('selected', self.selectedMarket)
	}
	return callback;
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




	this.infoWindow = this.buildInfoWindow(data);

	this.marker = this.buildMarker(data);
}
Market.prototype.setOpenClosedStatus = function() {
	// determine if market is open right now
	
}

Market.prototype.buildMarker = function() {
	
	var icon = MarkerFactory.make(this.map, this.data);
	
	var position = new google.maps.LatLng(this.data.Latitude, this.data.Longitude);
	
	// Shapes define the clickable region of the icon.
	// The type defines an HTML <area> element 'poly' which
	// traces out a polygon as a series of X,Y points. The final
	// coordinate closes the poly by connecting to the first
	// coordinate.
	var shape = {
		coords: [1, 1, 1, 20, 18, 20, 18 , 1],
		type: 'poly'
	};
	var marker = new google.maps.Marker({
		position: position,
		map: this.map,
		draggable:false,
		icon: icon,
		title: this.data.name,
	});
	marker.market = this;
	return marker;
};


Market.prototype.buildInfoWindow = function() {

	var infoContent = this.getInfoWindowContent();
    var infoWindow = new google.maps.InfoWindow({ content: infoContent });
    return infoWindow;
}

Market.prototype.getInfoWindowContent = function() {

	var name = ("<h2>" + this.data["name"] + "</h2>");

	var content = "<div class='info-window'>";
		content+= name;
	
	for (keyname in this.data) {
		value = this.data[keyname];
		if (keyname == 'name' || !value) { continue; }

		content+= ("<p>" + keyname + ": " + value + "</p>");
	}
		content+= "</div>";

	return content;
}




