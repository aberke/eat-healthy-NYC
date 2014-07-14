
var DATA_URL = '/data';
var map;
var marketController;
var clientLocation;



function buildMap(mapEltId) {
	var options = {
		zoom: 13,
		//center: new google.maps.LatLng(40.73586, -73.99108),
		panControl: false, // don't show panning button
		zoomControl: false, // if true, displays a slider (for large maps) or small "+/-" buttons (for small maps) to control the zoom level of the map
		mapTypeControl: false, // lets the user toggle between map types
		scaleControl: false,
		streetViewControl: false, // contains a Pegman icon which can be dragged onto the map to enable Street View
		overviewMapControl: false, // displays a thumbnail overview map reflecting the current map viewport within a wider area
		mapTypeId: google.maps.MapTypeId.ROADMAP,
	};
	var map = new google.maps.Map(document.getElementById(mapEltId), options);

	// set styles?
	var styles = [
	  {
		stylers: [
		  // { hue: "#586065" },
		  { hue: "red" },
		  { saturation: -100 }
		]
	  },{
		elementType: "geometry",
		featureType: "road",
		stylers: [
		  { lightness: 100 },
		  { visibility: "simplified" }
		]
	  },{
		elementType: "labels",
		featureType: "road",
		stylers: [
		  { visibility: "off" }
		]
	  }
	];
	
	map.setOptions({styles: styles});
	return map;
}
function getGeoLocation(callback) {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			
			callback(position);
		}, function() {
			console.log('Error: The Geolocation service failed.');
			callback(null);
		});
	} else {
		console.log("Error: Browser doesn't support Geolocation.");
		callback(null);
	}
}

function initialize(mapEltId) {
	map = buildMap(mapEltId);
	marketController = new MarketController(map);

	// get data
	$.ajax({
		dataType: "json",
		url: DATA_URL,
		data: {},
		success: function(ret) {
			marketController.init(ret.data);
		},
	});

	getGeoLocation(function(position) {
		clientLocation = position;
		map.setCenter(clientLocation);

		var icon = {
			path: google.maps.SymbolPath.CIRCLE,
			strokeWeight: 6,
			fillColor: "red",
			strokeColor: "#ef7625",
			fillOpacity: 1,
			scale: 8
		};
		
		var shape = {
			coord: [1, 1, 1, 150, 180, 150, 180 , 1],
			type: 'poly'
		};
	
		var marker = new google.maps.Marker({
			position: clientLocation,
			map: map,
			draggable:false,
			icon: icon,
			title: 'Your Location'
		});
	});

	setupDirections();
}


var InfoContainer = function() {
	this.visible;
	this.element = document.getElementById('info-container');

	this.marketContainer = document.getElementById('market-container');
	this.directionsContainer = document.getElementById('directions-container');
	this.directionsPanel = document.getElementById('directions-panel');
	this.hide();
}
InfoContainer.prototype.showMarketContent = function(contentString) {
	this.hideDirections();
	this.marketContainer.innerHTML = contentString;
	this.show();
}
InfoContainer.prototype.show = function() {
	this.element.style.display = "block";
	this.visible = true;
}
InfoContainer.prototype.hide = function() {
	this.hideDirections();
	this.element.style.display = "none";
	this.visible = false;
}
InfoContainer.prototype.toggle = function() {
	this.visible ? this.hide() : this.show();
}

InfoContainer.prototype.showDirections = function() {
	this.directionsContainer.style.display = "block";
}
InfoContainer.prototype.hideDirections = function() {
	directionsRenderer.set('directions', null);
	this.directionsContainer.style.display = "none";
}
var TRAVELMODES = {
	"DRIVING": google.maps.TravelMode.DRIVING,
	"WALKING": google.maps.TravelMode.WALKING,
	"BICYCLING": google.maps.TravelMode.BICYCLING,
	"TRANSIT": google.maps.TravelMode.TRANSIT,
}
InfoContainer.prototype.getDirections = function(travelMode) {
	console.log('getDirections', marketController.selectedMarket);

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

var directionsService = new google.maps.DirectionsService();
var directionsRenderer = new google.maps.DirectionsRenderer();

var infoContainer = new InfoContainer();

var setupDirections = function() {
	directionsRenderer.setMap(map);
	directionsRenderer.setPanel(infoContainer.directionsPanel);
}



