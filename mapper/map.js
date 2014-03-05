// List of IP addresses for the heat map. Eventually we want this
// to come from the server.
var heatIPs = [
  '95.78.71.120',
  '225.26.167.88',
  '41.165.120.1',
  '102.191.188.197',
  '103.245.25.180',
  '16.70.218.234',
  '180.249.198.46',
  '165.99.68.206',
  '123.140.54.226',
  '130.78.152.146',
  '147.116.125.73',
  '110.68.119.83',
  '72.83.243.237',
  '181.56.189.190',
  '27.101.84.157',
  '178.236.48.71',
  '97.172.143.206',
  '194.184.248.12',
  '12.236.248.193',
  '38.183.129.27',
  '70.176.139.96',
  '22.222.252.200',
  '203.46.16.46',
  '217.159.252.203'
];


/*
 * A function that draws the map once we have a set of all needed
 * coordinates from IPs.
 * 
 * Arguments:
 *   heatSpots <Array> - An array of google LatLng objects which
 *     represent the locations we wish to highlight on the map.
 *
 * Returns:
 *   Nothing.
 */
var drawMap = function(heatSpots) {

  // Set some rough map options.
  var mapCenter = new google.maps.LatLng(37.8282, -95.5795);
  var mapOptions = {
    center: mapCenter,
    zoom: 5
  };
   
  // Get the map container.
  var container = document.getElementById('map-canvas');

  // Draw the map.
  var map = new google.maps.Map(container, mapOptions);
  console.log(heatSpots);

  // Convert heat list to google maps array.
  var pointArray = new google.maps.MVCArray(heatSpots);

  // Generate the heatmap layer.
  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: pointArray,
    radius: 20
  });

  // Finish the drawing.
  heatmap.setMap(map);
}


/*
 * Function which is called when the document has loaded. Takes
 * care of creating JSON requests which in turn will trigger the
 * map being drawn later on.
 *
 * Arguments:
 *   None.
 * 
 * Returns:
 *   Nothing.
 */
var initialize = function() {

  // The site we use to get information about IP addresses.
  var geoURL = 'http://freegeoip.net/json/';

  // An array we will keep the locations we wish to highlight
  // in the form of google LatLng objects.
  var heatSpots = [];

  // Iterate over each IP in the heatIPs array.
  for (var i = 0; i < heatIPs.length; ++i) {

    // Send a request to get the geolocation of the current IP.
    $.getJSON(geoURL + heatIPs[i], function(data) {
      
      // When we get it, we push the google LatLng object of the
      // location to the heatSpots array.
      heatSpots.push(
        new google.maps.LatLng(data.latitude, data.longitude)
      );
      
      // If this is the last object to complete the request, let
      // the map draw.
      if (heatSpots.length === heatIPs.length) {
        drawMap(heatSpots);
      }
    });
  }
}

// Create a listener for when the DOM has loaded.
$(document).ready(initialize);
