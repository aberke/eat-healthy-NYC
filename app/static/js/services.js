/*********************************************************************
----------------------------------------------------------------------

  Authors: 
    Alexandra Berke (aberke)
    Wenting 
  2014
  NYC


----------------------------------------------------------------------
*********************************************************************/

// TODO - this is not used as an angular service
var InfoService = function() {

  var map;
  var clientLocation = null;
  
  var getClientLocation = function() {
    return clientLocation;
  }

  var setClientLocation = function(position) {
    clientLocation = position;
  }
  return {
    getClientLocation: getClientLocation,
    setClientLocation: setClientLocation
  }
}();

// TODO - this is not used as an angular service
var DirectionsRendererFactory = function() {

  var directionsRenderer = new google.maps.DirectionsRenderer();

  var setupDirections = function(map, panel) {
    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(panel);
  }
  var setDirections = function(value) {
    directionsRenderer.set('directions', value);
  };

  return {
    setupDirections: setupDirections,
    setDirections: setDirections
  }
}();



var DirectionsService = function() {

  var directionsService = new google.maps.DirectionsService();
  return directionsService;
}();


var APIservice = function($http, $q){

  function HTTP(method, endpoint, data, params, options) {

    var config = {
      method:  method,
      url:    ('/api' + endpoint),
      data:   (data || {}),
      params: (params || {}),
    };
    options = (options || {})
    for (var opt in options) { config[opt] = options[opt]; }
    
    var deferred = $q.defer();
    $http(config)
    .success(function(returnedData){
      deferred.resolve(returnedData);
    })
    .error(function(errData, status) {
      console.log('API Error', status, errData.message);
      deferred.reject(errData.message || "Error");
    });
    return deferred.promise;
  };
  function upload(method, endpoint, files, successCallback, errorCallback) {
    var fd = new FormData();
    fd.append("file", files[0]); //Take the first selected file

    var options = {
        withCredentials: true,
        headers: {'Content-Type': undefined },
        transformRequest: angular.identity
    };
    return HTTP(method, endpoint, fd, null, options).then(successCallback, errorCallback);
  }

  /* ---------- below functions return promises --------------------------- 
                                              (route resolve needs promises) 
  */

  this.POSTupload = function(endpoint, files) {
    return upload('POST', endpoint, files);
  }

  this.GET = function(endpoint, data) { // if there's data, send it as params
    return HTTP('GET', endpoint, null, data);
  };
  this.POST = function(endpoint, data) {
    return HTTP('POST', endpoint, data);
  };
  this.PUT = function(endpoint, data) {
    return HTTP('PUT', endpoint, data);
  };
  this.DELETE = function(endpoint, data) {
    return HTTP('DELETE', endpoint, data);
  };


  // this.GETmarkets



};
