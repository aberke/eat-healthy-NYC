
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

		// payment options
		EBT: document.getElementById('market-EBT'),
		WIC: document.getElementById('market-WIC'),
		FMNP: document.getElementById('market-FMNP'),

		// market link to specified market's website (requested by growNYC)
		link: document.getElementById('market-link'),
		linkTag: document.getElementById('market-link-tag'), // the <a></a> element with the link
	}
	for (var i=0; i<7; i++) {
		this.infoElements.dayNames[i] = document.getElementById('day-name-' + i);
		this.infoElements.dayHours[i] = document.getElementById('day-hours-' + i);
	}
}

// hiding/showing elements with css selector .hidden (see map.css)
MarketInfoController.prototype.showElement = function(element) {
	element.className = element.className.replace(/\ *hidden/g, '');
}
MarketInfoController.prototype.hideElement = function(element) {
	element.className += " hidden";
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
	DirectionsRendererFactory.setDirections(null);
	this.directionsContainer.style.display = "none";
}
var TRAVELMODES = {
	"DRIVING": google.maps.TravelMode.DRIVING,
	"WALKING": google.maps.TravelMode.WALKING,
	"BICYCLING": google.maps.TravelMode.BICYCLING,
	"TRANSIT": google.maps.TravelMode.TRANSIT,
}
MarketInfoController.prototype.getDirections = function(travelMode, selectedMarket) {
	console.log('getDirections', travelMode, selectedMarket);

	var start = InfoService.getClientLocation();
	var end = selectedMarket.marker.position;
	var request = {
		origin: start,
		destination: end,
		travelMode: (TRAVELMODES[travelMode] || google.maps.TravelMode.WALKING),
	};
	DirectionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
		  	DirectionsRendererFactory.setDirections(response);
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

			// setup hours
			// TODO - use well formatted start and end here (see schema)
			var dayHours = data.days[i] ? cleanString(data.days[i]['text']) : '';
			this.infoElements.dayHours[i].innerHTML = dayHours;
			
			// set open/closed
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

	/*- payment options: have boolean values, show if they are true in this data ----*/
	// if data.[paymentOption]: show infoElements.paymentOption, else: hide infoElements.paymentOption
	data.EBT ? this.showElement(this.infoElements.EBT) : this.hideElement(this.infoElements.EBT);
	data.WIC ? this.showElement(this.infoElements.WIC) : this.hideElement(this.infoElements.WIC);
	data.FMNP ? this.showElement(this.infoElements.FMNP) : this.hideElement(this.infoElements.FMNP);
	
	/*------------------------------------------------------------- payment options -*/
	
	/*- setting Market Link info: data['Market Link'] is a string, '' if no data ----*/
	// if data['Market Link']: show infoElements.link, else: hide infoElements.link
	data['Market Link'] ? this.showElement(this.infoElements.link) : this.hideElement(this.infoElements.link);
	
	// set market-link link href and text to this market's 'Market Link'
	this.infoElements.linkTag.href = data['Market Link'];
	this.infoElements.linkTag.innerHTML = data['Market Link'];
	/*------------------------------------------------- setting Market Link info ----*/




	this.show();
}

function cleanString(string) {
	/* When do things like element.innerHTML = variable,
		want to avoid case where variable is undefined.
	*/
	return (string || '');
}






