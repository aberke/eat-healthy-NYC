console.log('map.js')

/* When developing, uncomment DEVELOPMENT = true to center map's location on Union Square, etc */
var DEVELOPMENT = false;
// DEVELOPMENT = true;


var DATA_URL = '/api/markets';
var map;
var marketController;
var clientLocation;

var mapLoaded = false;
var dataLoaded = false;


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


/*------------------------------------------------------------
@param [float] Latitude
@param [float] Longitude
@param [funciton] Callback - callback to call with boolean parameter
@doc
Uses Google Geocoding API for reverse Geocoding
Calls Callback with true if request successful & location is in NY State, 
					false otherwise
-------------------------------------------------------------*/
function isPositionNY(Latitude, Longitude, Callback) {
	// make request to Geocoding API
	$.ajax({
		dataType: "json",
		url: "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + Latitude + "," + Longitude,
		data: {},
		success: function(ret) {
			var result;
			for (var i=0; i<ret.results.length; i++) {
				result = ret.results[i];
				for (var c in result.address_components) {
					if (result.address_components[c].short_name == "NY") {
						return Callback(true);
					}
				}
			}
			return Callback(false);
          	
		}, error: function(err) {
			console.log("Error in getting data from Google Geocoding API: " + err);
			Callback(false);
		}
	});

}

/*------------------------------------------------------------
@return [googlemaps.LatLng] Default Geolocation
@doc
Used for when location services fails (maybe user denied it) 
TODO: use if location found is outside of New York
-------------------------------------------------------------*/
function getDefaultGeoLocation() {
	return new google.maps.LatLng("40.73712", "-73.99029");
}
/*------------------------------------------------------------
@return [googlemaps.LatLng] Geolocation
@doc
Used to initialize user point on map
Gets and returns (via callback) user's geolocation if user in NY and provides location
Otherwise returns (via callback) null
-------------------------------------------------------------*/
function getGeoLocation(callback) {

	// if in DEVELOPMENT mode, put position on Union Square farmers market
	if (DEVELOPMENT) {
		return callback(getDefaultGeoLocation());
	}

	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(pos) {
			
			isPositionNY(pos.coords.latitude, pos.coords.longitude, function(bool) {
				if (bool == true) { 
					var location = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
					callback(location); 
				} else {
					callback(null);
				}
			});
		}, function() {
			console.log('Error: The Geolocation service failed.  Using default location.');
			callback(null);
		});
	} else {
		console.log("Error: Browser doesn't support Geolocation.  Using default location.");
		callback(null);
	}
}
function setUserMarker(clientLocation) {

	var icon = {
		path: google.maps.SymbolPath.CIRCLE,
		strokeWeight: 6,
		fillColor: "red",
		strokeColor: "#ef7625",
		fillOpacity: 1,
		scale: 8
	};

	var marker = new google.maps.Marker({
		position: clientLocation,
		map: map,
		draggable:false,
		icon: icon,
		title: 'Your Location'
	});
};


function initialize() {
	map = buildMap("map-canvas");
	marketController = new MarketController(map);

	google.maps.event.addListener(map, 'tilesloaded', function() {
	  // Visible tiles loaded!
	  	mapLoaded = true;
	  	if(dataLoaded) {
		  	var loadingContainer = document.getElementById('loading-map-container');
		  	loadingContainer.style.display = "none";
	  	}
	});

	// get data
	$.ajax({
		dataType: "json",
		url: DATA_URL,
		data: {},
		success: function(ret) {
			dataLoaded = true;

		  	if(mapLoaded) {
			  	var loadingContainer = document.getElementById('loading-map-container');
			  	loadingContainer.style.display = "none";
		  	}
			marketController.init(ret.data);
		},
	});

	// initialize user marker and map center at user location
	getGeoLocation(function(position) {

		// if coudn't return position (error or denied by user) - just center map on default location
		if (!position) {
			map.setCenter(getDefaultGeoLocation());
		} else {
			map.setCenter(position);
			setUserMarker(position);
		}
	});

	setupDirections();
}


var directionsService = new google.maps.DirectionsService();
var directionsRenderer = new google.maps.DirectionsRenderer();


var setupDirections = function() {
	directionsRenderer.setMap(map);
	directionsRenderer.setPanel(marketInfoController.directionsPanel);
}



