
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


function initialize() {
	map = buildMap("map-canvas");
	marketController = new MarketController(map);

	// get data
	$.ajax({
		dataType: "json",
		url: DATA_URL,
		data: {},
		success: function(ret) {

          	var loadingContainer = document.getElementById('loading-map-container');
          	loadingContainer.style.display = "none";
			
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


var directionsService = new google.maps.DirectionsService();
var directionsRenderer = new google.maps.DirectionsRenderer();


var setupDirections = function() {
	directionsRenderer.setMap(map);
	directionsRenderer.setPanel(marketInfoController.directionsPanel);
}



