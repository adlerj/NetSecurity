/*
 * A function that loads a new heatmap data layer and draws it onto
 * the current map.
 * 
 * Arguments:
 *   heatmap <Object> - The google heatmap layer object.
 *
 * Returns:
 *   <Function> - A closure for the heatmap variable.
 *   Has the coordinates <Array> variable which must contain
 *   an array of {location: google LatLng Object, 
 *   weight: Number} objects.
 */
var updateData = function(heatmap) {
  return function(coordinates) {

    $('#overlay').hide();

    // Convert heat list to google maps array.
    var pointArray = new google.maps.MVCArray(coordinates);

    // Set the heatmap to be updated with the new points.
    heatmap.setData(pointArray);
  }
}


/*
 * A function that takes a list of IPs and translates them into coordinates
 * and weights on each coordinate. At completion, the callback function that
 * was passed in is called.
 *
 * Arguments:
 *   callback <Function> - The callback function to be called on completion.
 *
 * Returns:
 *   <Function> - Creates a closure that is passed back to the getLatestIPs
 *   function so that it can call this asynchronously. Argument to the closure
 *   is an <Array> that contains all IP addresses we want to translate.
 */
var translate = function(callback) {
  return function(IPs) {
    $('#overlay').show();
    var iplocator = new IPLocator();
    iplocator.locate(IPs, callback);
  }
}


/*
 * A function that gets the list of the latest IPs which have connected to
 * our server. Passes on the callback function to our translate function 
 * so that it can return context later if the map has already been drawn.
 *
 * Arguments:
 *   callback <Function> - The callback function. It tells the program where
 *   to return to once the data has been process but is not dealt with 
 *   directly in this function.
 *
 * Returns:
 *   Nothing.
 */
var getLatestIPs = function(callback) {
  var ipgetter = new IPGetter();
  ipgetter.get(translate(callback));
}


/*
 * Kicks off our program by first creating our map and then fetching the
 * latest&greatest IP information from the server. After the map is loading, 
 * we are taken to a function that will download the server info.
 *
 * Arguments:
 *   None.
 *
 * Returns:
 *   Nothing.
 */
var initialize = function() {

  // Set some rough map options.
  //var mapCenter = new google.maps.LatLng(37.8282, -95.5795);
  var mapCenter = new google.maps.LatLng(40,0);
  var mapOptions = {
    mapTypeControl: false,
    center: mapCenter,
    zoom: 2
  };
   
  // Get the map container.
  var container = document.getElementById('map-canvas');

  // Draw the map.
  var map = new google.maps.Map(container, mapOptions);

  // Create an empty MVC array to pass into Google Maps.
  var pointArray = new google.maps.MVCArray([]);

  // Generate an empty heatmap layer.
  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: pointArray,
    radius: 20
  });

  // Set the heatmap layer down.
  heatmap.setMap(map);

  // Set some colors so that our map is more visible.
  var gradient = [
    'rgba(125, 0, 0, 0)',
    'rgba(135, 0, 0, 1)',
    'rgba(145, 0, 0, 1)',
    'rgba(155, 0, 0, 1)',
    'rgba(165, 0, 0, 1)',
    'rgba(175, 0, 0, 1)',
    'rgba(185, 0, 0, 1)',
    'rgba(195, 0, 0, 1)',
    'rgba(205, 0, 0, 1)',
    'rgba(215, 0, 0, 1)',
    'rgba(225, 0, 0, 1)',
    'rgba(235, 0, 0, 1)',
    'rgba(245, 0, 0, 1)',
    'rgba(255, 0, 0, 1)'
  ]
  heatmap.set('gradient', gradient);

  // Create the button at the top right for settings.
  var opsDiv = document.createElement('div');
  var ops = new OptionsButton(opsDiv, map, heatmap);
  opsDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(opsDiv);

  // Get the latest information.
  getLatestIPs(updateData(heatmap));
}

// Create a listener for when the DOM has loaded.
$(document).ready(initialize);
