/*********************************************************************
----------------------------------------------------------------------

 	Authors: 
 		Alexandra Berke (aberke)
 		Wenting 
 	2014
	NYC


----------------------------------------------------------------------
*********************************************************************/






function MapController($scope, $http, APIservice) {

	/* When developing, uncomment DEVELOPMENT = true to center map's location on Union Square, etc */
	var DEVELOPMENT = false;
	// DEVELOPMENT = true;


	var map;
	var marketController;
	var clientLocation;

	/*-- I'm an AngularJS controller stuff ---------------------- */

	$scope.getDirections = function(type) {
		marketController.getDirections(type);
		map.setCenter(InfoService.getClientLocation());
	}
	$scope.hideDirections = function() {
		marketController.hideDirections();
	}
	$scope.hideMarketInfo = function() {
		marketController.hideMarketInfo();
	}

	/*---------------------- I'm an AngularJS controller stuff -- */


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
	var onError = function(err) {
		console.log("Error in getting data from Google Geocoding API: " + err);
		Callback(false);
	}
	var onSuccess = function(ret) {
		var result;
		for (var i=0; i<ret.results.length; i++) {
			result = ret.results[i];
			for (var c in result.address_components) {
				if (result.address_components[c].short_name == "NY") {
					console.log("User is in NYC");
					return Callback(true);
				}
			}
		}
		return Callback(false); 	
	}
    $http.get("http://maps.googleapis.com/maps/api/geocode/json?latlng=" + Latitude + "," + Longitude)
        .success(onSuccess)
        .error(onError);

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

	function hideLoading() {
	  	var loadingContainer = document.getElementById('loading-map-container');
	  	var menuContainer = document.getElementById('menu-container');

	  	loadingContainer.style.display = "none";
	  	menuContainer.style.display = "block";
	}

	/* build map.  
	Show loading screen until all of the following are true:
		- GET /markets returned all markets data
		- map tiles loaded
	*/
	function initialize() {
		map = buildMap("map-canvas");
		marketController = new MarketController(map);


		var dataLoaded = false;
		var mapLoaded = false;

		google.maps.event.addListener(map, 'tilesloaded', function() {
		  	// Visible tiles loaded!
		  	mapLoaded = true;
		  	dataLoaded && hideLoading(); // shorthand if else
		});

		APIservice.GET('/markets').then(function(ret) {
			dataLoaded = true;
			mapLoaded && hideLoading(); // shorthand if else
			marketController.init(ret.data);
		});

		// initialize user marker and map center at user location
		getGeoLocation(function(position) {

			// if coudn't return position (error or denied by user) - just center map on default location
			if (!position) {
				map.setCenter(getDefaultGeoLocation());
			} else {
				InfoService.setClientLocation(position);
				map.setCenter(position);
				setUserMarker(position);
			}
		});
	}
	google.maps.event.addDomListener(window, 'load',function() { initialize(); });
}





