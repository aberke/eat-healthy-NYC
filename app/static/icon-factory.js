


var IconFactory = function() {

	this.blue1 = "#a0e4f9";
	this.blue2 = "#29abe2";
	this.orange= "#ef7625";
	this.purple= "#1b1464";
	
}
IconFactory.prototype.make = function(data, isSelected) {
	
	var strokeWeight = data.EBT ? 4 : 0;
	var scale = isSelected ? 12 : 6;
	var icon = {
		path: google.maps.SymbolPath.CIRCLE,
		strokeWeight: strokeWeight,
		fillColor: this.purple,
		strokeColor: this.blue1,
		fillOpacity: 1,
		scale: scale
	};
	return icon;
}





