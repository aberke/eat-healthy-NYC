


var MarkerFactory = function() {

	this.iconBaseURL = window.location.origin + "/static/icon/";
  
  /* Shapes define the clickable region of the icon.
     Type defines HTML <area> element 'poly' which traces out a polygon as a series of X,Y points. The final
     coordinate closes the poly by connecting to the first coordinate.*/
  this.shape = {
    coords: [1, 1, 1, 20, 18, 20, 18 , 1],
    type: 'poly'
  };
	
}

MarkerFactory.prototype.makeIcon = function(data, isSelected) {
  
  var iconURL = (this.iconBaseURL + 'pin_mkt.png');
  if (data.EBT) {
    iconURL = (this.iconBaseURL + 'pin_ebt.png');  
  }
  // pixel dimensions of icon
  var size = new google.maps.Size(25, 40);
  // The scaledSize is the size of the entire image after scaling
  // default size is 20x32 px.  Make it bigger if selected
  var scaledSize = new google.maps.Size(20,32);
  if (isSelected) { // scale up by 50% when selected
    scaledSize = new google.maps.Size(30,48);
    size = new google.maps.Size(38, 60);
  }

  var icon = {
    url: iconURL,
    size: size,
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0,0), 
    // The anchor for this image is the base of the marker
    anchor: new google.maps.Point(12, 40),
    scaledSize: scaledSize,
  };
  
  return icon;
}

MarkerFactory.prototype.make = function(map, data, isSelected) {
	/*
  Both makes the UI of the marker and attaches the marker to the map

  @param {google.maps.Map}  map    : map which to attach the marker
  @param {dictionary}       data   : data with which to determine what marker should look like
  @param {Boolean}     isSelected  : whether or not this is the currently selected icon - enlarge if so
  
  Returns {googlemaps.Marker} object that is constructed and that is attached to the map
  */

  var icon = this.makeIcon(data, isSelected);
  var position = new google.maps.LatLng(data.Latitude, data.Longitude);
  // open markets have full opacity, closed markers slightly transparent
  var opacity = 1;
  if (data.closed) {
    opacity = 0.6;
  }

  var marker = new google.maps.Marker({
    position: position,
    map: map,
    draggable:false,
    shape: this.shape,
    icon: icon,
    title: data.name,
    opacity: opacity,
  });

  return marker;
}





