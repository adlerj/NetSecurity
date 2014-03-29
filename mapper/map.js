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

  // Convert heat list to google maps array.
  var pointArray = new google.maps.MVCArray(heatSpots);

  // Generate the heatmap layer.
  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: pointArray,
    radius: 20
  });

  heatmap.setMap(map);
}


/*
 * A function that handles the returned request asking for
 * the coordinates of an IP address. Simply adds the coordinate
 * value as many times as the IP address is needed.
 *
 * Arguments:
 *   heatSpots <Array> - Array that will hold the resulting 
 *   coordinate values.
 *   length <Number> - The length of the original array which
 *   heatSpots should end up being the same size as in the end.
 *   num <Number> - Number of times the IP we are using repeats.
 *
 * Returns:
 *   <Function> Creates a closure that we use for the JSON request.
 */
var JSONreq = function(heatSpots, length, num) {
  return function(data) {
    // When we get it, we push the google LatLng object of the
    // location to the heatSpots array.
    for (var j = 0; j < num; ++j) {
      heatSpots.push(
        new google.maps.LatLng(data.latitude, data.longitude)
      );
    }
      
    // If this is the last object to complete the request, let
    // the map draw.
    if (heatSpots.length === length) {
      drawMap(heatSpots);
    }
  }
}

/*
 * Takes care of creating JSON requests for the IP address locations
 * which in turn will trigger the map being drawn later on.
 *
 * Arguments:
 *   IPs <Array> - Array of IP addresses which we will search for
 *     the location of.
 * 
 * Returns:
 *   Nothing.
 */
var getCoordinates = function(IPs) {

  // The site we use to get information about IP addresses.
  var geoURL = 'http://162.248.161.124:8080/json/';

  // An array we will keep the locations we wish to highlight
  // in the form of google LatLng objects.
  var heatSpots = [];

  var hash = {};

  for (var i = 0; i < IPs.length; ++i) {
    var cur = IPs[i];
    if (!hash[cur]) {
      hash[cur] = 1;
    } else {
      ++hash[cur];
    }
  }

  var cur;
  for (cur in hash) {
    var num = hash[cur];
    $.getJSON(geoURL + cur, JSONreq(heatSpots, IPs, num));
  }
}


/*
 * Checks if the line contains useful information to us.
 *
 * Arguments:
 *   line <String> - The line that we are checking.
 *
 * Returns:
 *   <boolean> - If the line contains IP addresses.
 */
var checkLine = function(line) {
  return line.indexOf('->') !== -1;
}


/*
 * Takes the lines of data from the log file that contain IP addesses
 * and sorts the IPs according to if they were the host of the packet
 * or the reciever of the packet.
 */
var sortIPs = function(IPs, connections) {
  
  // Regular expression to check for IP addresses. Not completely valid
  // as it includes all values from 0 - 999 in each block but will be
  // improved later.
  var regex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g;

  // Go over each line.
  for (var i = 0; i < IPs.length; ++i) {
    var cur = IPs[i];

    // Will find the two IP addresses in each line. We know that the
    // first one is the host of the packet and the second one is the
    // IP address that will recieve the packet.
    var justIPs = cur.match(regex);
    if (justIPs[0] === '128.6.238.75') {
      connections.push(justIPs[1]);
    } else if (justIPs[1] === '128.6.238.75') {
      connections.push(justIPs[0]);
    }
  }
}


/*
 * When we recieve the log file from the server, we recieve a lot
 * of useless information. This quickly removes all the lines that
 * we're not interested in, extracts two IPs from each line, and
 * then calls for the next step of our program (getting coordinates
 * from the IPs).
 *
 * Arguments:
 *   data <String> - The full data returned by our server.
 *
 * Returns:
 *   Nothing.
 */
var parseIPs = function(data) {

  // Filters out useless lines.
  var IPlines = data.split('\n').filter(checkLine);

  // Sort the IPs into two different arrays, one for the sender of the
  // packet and the other for the destination of the packet.
  var connections = [];
  sortIPs(IPlines, connections);

  // Finds out where the IPs are on a map. For now we don't care about
  // the destination IPs.
  getCoordinates(connections);
}


/*
 * Kicks off our program by fetching the latest&greatest logs of packet info.
 *
 * Arguments:
 *   None.
 *
 * Returns:
 *   Nothing.
 */
var initialize = function() {
  // Get the log from our server.
  var logURL = 'http://scarletshield.rutgers.edu/sites/default/files/logs/snort.txt';
  $.get(logURL, parseIPs);
}

// Create a listener for when the DOM has loaded.
$(document).ready(initialize);
