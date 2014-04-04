/*
 * The IPLocator class. Does exactly what it sounds like: translates
 * the IP addresses which are passed into the locate function into
 * an array of Objects containting google LatLng objects and the
 * corresponding weight they have on the map.
 *
 * Arguments:
 *   Nothing.
 *
 * Returns:
 *   <Object> - this. The context of the IPlocator so that a function 
 *   that creates an IPLocator object may call the locate function.
 */
var IPLocator = function() {
  this.goalWeight = 0;
  this.totalWeight = 0;
  this.goalRequests = 0;
  this.completeRequests = 0;
  this.heatSpots = [];
  this.container = document.getElementById('map-canvas');
  this.callback = null;

  return this;
}

/*
 * Takes care of creating JSON requests for the IP address locations
 * which in turn will trigger the map being drawn later on.
 *
 * Arguments:
 *   IPs <Array> - Array of IP addresses which we will search for
 *   the location of.
 *   callback <Function> - The function we will call upon successful
 *   translation.
 * 
 * Returns:
 *   Nothing.
 */
IPLocator.prototype.locate = function(IPs, callback) {

  // The site we use to get information about IP addresses.
  var geoURL = 'http://162.248.161.124:8080/json/';

  // An array we will keep the locations we wish to highlight
  // in the form of google LatLng objects.

  var hash = {};

  for (var i = 0; i < IPs.length; ++i) {
    var cur = IPs[i];
    if (!hash[cur]) {
      hash[cur] = 1;
    } else {
      ++hash[cur];
    }
  }

  // Save some stuff for later.
  this.callback = callback;
  this.goalWeight = IPs.length;
  this.goalRequests = Object.keys(hash).length;

  var cur;
  for (cur in hash) {
    var weight = hash[cur];
    $.getJSON(geoURL + cur,
      IPLocator.successHandler(weight, this)
    ).fail(IPLocator.failHandler(weight, this));
  }

}


/*
 * Static function which is called when a request is responded to.
 */
IPLocator.successHandler = function(weight, iptrans) {
  return function(data) {
    iptrans.handler(weight, data);
  }
}


/*
 * Static function which is called when a request fails.
 */
IPLocator.failHandler = function(weight, iptrans) {
  return function() {
    iptrans.error(weight);
  }
}


/*
 * Function that checks if the coordinates we are currently seeing
 * are part of a location we wish to ignore: where we live.
 */
IPLocator.prototype.isUs = function(data) {
  return (Math.floor(Number(data.latitude)) === 40 &&
         Math.floor(Number(data.longitude)) === -75)
}


/*
 * A function that handles the returned request asking for
 * the coordinates of an IP address. Simply adds the coordinate
 * value as many times as the IP address is needed.
 *
 * Arguments:
 *   weight <Number> - The number of times this IP address appeared 
 *   in the list passed in.
 *   data <Object> - The data that was returned by the request.
 *
 * Returns:
 *   Nothing.
 */
IPLocator.prototype.handler = function(weight, data) {
  if (!(data.latitude === 0 && data.longitude === 0 ) && !this.isUs(data))  {
    
    // When we get it, we push the google LatLng object of the
    // location to the heatSpots array.
    this.heatSpots.push({
      location: new google.maps.LatLng(data.latitude, data.longitude),
      weight: weight
    });
  }

  // Increment counter for how far we have progressed in our reqs.
  this.totalWeight += weight;
  this.completeRequests += 1;
    

  var overlay = document.getElementById('progress');
  //overlay.setAttribute('aria-valuenow', this.completeRequests/this.goalRequests*100);
  overlay.style.width = this.completeRequests/this.goalRequests*100+'%'
  //$('#overlay').html(
   //   Math.floor(
   //     this.completeRequests/this.goalRequests * 100
    //  ).toString());

  if (this.totalWeight === this.goalWeight) {
    this.callback(this.heatSpots);
  }
}


/*
 * A function that is called when there is an error on the request.
 * Simply increments the counter of the requests returned and also
 * checks if this was the last item needed to be returned.
 */
IPLocator.prototype.error = function(weight) {
  this.totalWeight += weight;
  this.completeRequests += 1;
  if (this.totalWeight === this.goalWeight) {
    this.callback(this.heatSpots);
  }
}
