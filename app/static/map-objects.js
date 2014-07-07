
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
		var market = this.market;

		// close already open info window
		if (self.selectedMarket) {
			self.selectedMarket.closeInfoWindow();
		}
		self.selectedMarket = market;
		self.selectedMarket.openInfoWindow();
		
		this.map.setCenter(this.getPosition());
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
Market.prototype.closeInfoWindow = function(data) {
	this.infoWindow.close();
}
Market.prototype.openInfoWindow = function(data) {
	this.infoWindow.open(this.map, this.marker);
}

Market.prototype.buildMarker = function() {
	
	var strokeWeight = (this.data.EBT == "Y") ? 4 : 0;
	var icon = {
		path: google.maps.SymbolPath.CIRCLE,
		strokeWeight: strokeWeight,
		fillColor: "#1b1464",
		strokeColor: "#a0e4f9",
		fillOpacity: 1,
		scale: 8
	};
	
	var shape = {
		coord: [1, 1, 1, 150, 180, 150, 180 , 1],
		type: 'poly'
	};
	var position = new google.maps.LatLng(this.data.Latitude, this.data.Longitude);
	
	var marker = new google.maps.Marker({
		position: position,
		map: this.map,
		draggable:false,
		icon: icon,
		shape: shape,
		title: location[0]
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




