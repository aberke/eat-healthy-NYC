


var MarkerFactory = function() {

	this.iconBaseURL = window.location.origin + "/static/icons/";
  
  // Shapes define the clickable region of the icon.
  // Type defines HTML <area> element 'poly' which traces out a polygon as a series of X,Y points. The final
  // coordinate closes the poly by connecting to the first coordinate.
  this.shape = {
    coords: [1, 1, 1, 20, 18, 20, 18 , 1],
    type: 'poly'
  };
	
}
MarkerFactory.prototype.make = function(map, data, isSelected) {
	
  var iconURL = (this.iconBaseURL + 'pin_mkt.png');
  if (data.EBT) {
    iconURL = (this.iconBaseURL + 'pin_ebt.png');  
  }

  var icon = {
    url: iconURL,
    // pixel dimensions of icon
    size: new google.maps.Size(25, 40),
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0,0), 
    // The anchor for this image is the base of the marker
    anchor: new google.maps.Point(12, 40)
  };

	return icon;
}





