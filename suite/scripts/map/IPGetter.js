/*
 * The IPGetter class is a class to get the newest list of IPs that have
 * connected to our server. Requires a call to "get" in order to init.
 *
 * Arguments:
 *   None.
 *
 * Returns:
 *   <Object> - this. The context of the object so that one may call get
 *   on it.
 */
var IPGetter = function() {
  this.callback = null;
  
  return this;
}


/*
 * The get function. Initiates our retrieval of the latest information
 * By pulling a list of incoming and outgoing packets from the server.
 *
 * Arguments:
 *   callback <Function> - The function that will be called upon successful
 *   response and modification of the message from the server.
 * 
 * Returns:
 *   Nothing.
 */
IPGetter.prototype.get = function(callback) {
  this.callback = callback;

  // Get the log from our server.
  var logURL = 'http://scarletshield.rutgers.edu/demo/pullips.php';
  $.get(logURL, IPGetter.staticHandler(this));
}


/*
 * A static function which is called upon the response of the server.
 * The only reason for this function is to return context of this to
 * the IPGetter object.
 * 
 * Arguments:
 *   ipgetter <Object> - The IPGetter Object we want to return
 *   context to.
 *
 * Returns:
 *   <Function> - Closure function that is called once the server
 *   has completed it's response.
 */
IPGetter.staticHandler = function(ipgetter) {
  return function(data) {
    ipgetter.handler(data);
  }
}

/*
 * When we recieve the log file from the server, we recieve a lot
 * of useless information. This quickly finds all the people that 
 * connected to us (because the list contains the IP addresses of 
 * the incoming and outgoing packets, one of those being our IP 
 * address) and also removes useless transactions (like ones that
 * refer to messages passed from within our server). At the end of
 * this function, the callback function is called with the 
 * completed IP addresses passed back.
 *
 * Arguments:
 *   data <String> - The full data returned by our server.
 *
 * Returns:
 *   Nothing.
 */
IPGetter.prototype.handler = function(data) {
  // Filters out useless lines.
  var connections = data.split(' <br>');

  // Sort the IPs into two different arrays, one for the sender of the
  // packet and the other for the destination of the packet.
  var IPs = [];
  this.extractIPs(connections, IPs);

  // Finds out where the IPs are on a map. For now we don't care about
  // the destination IPs.
  this.callback(IPs);
}

/*
 * Takes the lines of data from the log file that contain IP addesses
 * and sorts the IPs according to if they were the host of the packet
 * or the reciever of the packet.
 */
IPGetter.prototype.extractIPs = function(connections, IPs) {
  
  // Regular expression to check for IP addresses. Not completely valid
  // as it includes all values from 0 - 999 in each block but will be
  // improved later.
  var regex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g;
  
  // Go over each line.
  for (var i = 0; i < connections.length - 1; ++i) {
    var cur = connections[i];

    // Will find the two IP addresses in each line. We know that the
    // first one is the host of the packet and the second one is the
    // IP address that will recieve the packet.
    var justIPs = cur.match(regex);

    if (justIPs.length !== 2) {
      continue;
    }

    if (justIPs[0].substring(0, 3) === '224' || 
        justIPs[1].substring(0, 3) === '224') {
      continue;
    }

    if (justIPs[0] === '128.6.238.75') {
      IPs.push(justIPs[1]);
    } else if (justIPs[1] === '128.6.238.75') {
      IPs.push(justIPs[0]);
    }
  }
}

