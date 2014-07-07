
var DATA_URL = '/data';
var map;
var marketController;



function buildMap(mapEltId) {
	var options = {
		zoom: 13,
		center: new google.maps.LatLng(40.73586, -73.99108),
		panControl: false, // don't show panning button
		zoomControl: true, // if true, displays a slider (for large maps) or small "+/-" buttons (for small maps) to control the zoom level of the map
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
		  { hue: "#586065" },
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
}










