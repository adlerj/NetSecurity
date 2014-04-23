/*
 * Class for the options button of our map.
 */
var OptionsButton = function(opsDiv, map, heatmap) {
  opsDiv.style.padding = '5px';

  var button = document.createElement('div');
  button.className = 'button';
  opsDiv.appendChild(button);

  var pointless = document.createElement('div');
  pointless.style.marginTop = '45px';
  opsDiv.appendChild(pointless);

  var options = document.createElement('div');
  options.className = 'options';
  opsDiv.appendChild(options);
  $(options).hide();

  var refresh = new TextOption('Refresh Chart Data', options);
  var suite = new TextOption('Back to the Suite', options);
  var logout = new TextOption('Logout', options);

  google.maps.event.addDomListener(refresh, 'click', function() {
    $(options).slideToggle(200);
    $('#progress').width(0);
    $('#overlay').show();
    getLatestIPs(updateData(heatmap));
  });

  google.maps.event.addDomListener(button, 'click', function() {
    $(options).slideToggle(200);
  });
  google.maps.event.addDomListener(suite, 'click', function() {
    window.location.href = 'http://scarletshield.rutgers.edu/suite';
  });
  google.maps.event.addDomListener(logout, 'click', function() {
    logOut();
  });

  return this;
}
