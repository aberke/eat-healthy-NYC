
var MarketInfoController = function() {
	this.visible;
	this.container = document.getElementById('market-info-outter-container');
	// this.element = document.getElementById('info-container');

	this.directionsContainer = document.getElementById('directions-container');
	this.directionsPanel = document.getElementById('directions-panel');
	this.hide();

	this.infoElements = {
		marketName: document.getElementById('market-name'),
		marketLocation: document.getElementById('market-location'),
		marketCounty: document.getElementById('market-county'),
		marketZipcode: document.getElementById('market-zipcode'),
		hoursTable: document.getElementById('hours-table'),
		operationHours: document.getElementById('operation-hours'),
		operationMonths: document.getElementById('operation-months'),
		dayNames: {},
		dayHours: {},
		EBT: document.getElementById('market-EBT'),
	}
	for (var i=0; i<7; i++) {
		this.infoElements.dayNames[i] = document.getElementById('day-name-' + i);
		this.infoElements.dayHours[i] = document.getElementById('day-hours-' + i);
	}
	console.log(this.infoElements)
}
MarketInfoController.prototype.showElement = function(element) {
	element.style.display = "block";
}
MarketInfoController.prototype.hideElement = function(element) {
	element.style.display = "none";
}
MarketInfoController.prototype.show = function() {
	this.showElement(this.container);
	this.visible = true;
}
MarketInfoController.prototype.hide = function() {
	this.hideDirections();
	this.hideElement(this.container);
	this.visible = false;
}
MarketInfoController.prototype.toggle = function() {
	this.visible ? this.hide() : this.show();
}

MarketInfoController.prototype.showDirections = function() {
	this.directionsContainer.style.display = "block";
}
MarketInfoController.prototype.hideDirections = function() {
	directionsRenderer.set('directions', null);
	this.directionsContainer.style.display = "none";
}
var TRAVELMODES = {
	"DRIVING": google.maps.TravelMode.DRIVING,
	"WALKING": google.maps.TravelMode.WALKING,
	"BICYCLING": google.maps.TravelMode.BICYCLING,
	"TRANSIT": google.maps.TravelMode.TRANSIT,
}
MarketInfoController.prototype.getDirections = function(travelMode) {
	console.log('getDirections', travelMode, marketController.selectedMarket);

	var start = clientLocation;
	var end = marketController.selectedMarket.marker.position;
	var request = {
		origin: start,
		destination: end,
		travelMode: (TRAVELMODES[travelMode] || google.maps.TravelMode.WALKING),
	};
	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
		  	directionsRenderer.setDirections(response);
			map.setCenter(clientLocation);
		}
	});
	this.showDirections();
}


MarketInfoController.prototype.showMarketContent = function(data, contentString) {
	this.hideDirections();

	this.infoElements.marketName.innerHTML = cleanString(data.name);
	this.infoElements.marketLocation.innerHTML = cleanString(data.location);
	this.infoElements.marketCounty.innerHTML = cleanString(data.county);
	this.infoElements.marketZipcode.innerHTML = cleanString(data.zipcode);
	this.infoElements.operationMonths.innerHTML = cleanString(data['operation-months']);

	this.hideElement(this.infoElements.hoursTable);
	this.hideElement(this.infoElements.operationHours);

	if (data['bad-hours-data']) {
		this.infoElements.operationHours.innerHTML = cleanString(data['operation-hours']);
		this.showElement(this.infoElements.operationHours);
	} else {
		// iterate through all the days in the week and update the hours-table
		for (var i=0; i<7; i++) {
			// data.days is a sparsely populated map { (int) day: (string) hours }
			this.infoElements.dayHours[i].innerHTML = cleanString(data.days[i]);
			if (data.days[i]) {
				this.infoElements.dayNames[i].className = "open";
				this.infoElements.dayHours[i].className = "open";
			}
			else {
				this.infoElements.dayNames[i].className = "";
				this.infoElements.dayHours[i].className = "";
			}
		}

		this.showElement(this.infoElements.hoursTable);
	}

	if (data.EBT) {
		this.showElement(this.infoElements.EBT);
	} else {
		this.hideElement(this.infoElements.EBT);
	}






	this.show();
}



function cleanString(string) {
	/* When do things like element.innerHTML = variable,
		want to avoid case where variable is undefined.
	*/
	return (string || '');
}








// attach to window?
var marketInfoController = new MarketInfoController();




