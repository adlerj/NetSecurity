/*
 * A closure that handles drawing the google map that is
 * centered on the IP we pass in. 
 * 
 * Arguments:
 *   IP <String> - The string that represents the IP we want
 *     the map to focus on.
 *
 * Returns:
 *  <function> A function that runs after the DOM has
 *    finished loading.
 */
var drawMap = function(IP) {

  // Create the closure with the IP variable for later use.
  return function() {

    // We use this URL to request information about the IP
    // address.
    var geoURL = 'http://freegeoip.net/json/' + IP;

    // Make a request to that URL.
    $.getJSON(geoURL, function(json) {

      // Set some rough map options.
      var mapOptions = {
        center: new google.maps.LatLng(
          json.latitude,
          json.longitude),
        zoom: 8
      };
    
      // Get the map container.
      var container = document.getElementById('map-canvas');

      // Draw the map.
      var map = new google.maps.Map(container, mapOptions);
    });

  }
}

// Hard coded IP address that we use as the central point.
// Might just center around the US later on, but for now this
// shows our ability to get information from the IP.
var IP = '192.12.88.152';

// Create a listener for when the DOM has loaded.
google.maps.event.addDomListener(window, 'load', drawMap(IP));
