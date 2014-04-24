/*
 * Initialize the slider. All the work is taken care of by our
 * DoubleSlider class.
 */
var initSlider = function() {
	var container = document.getElementsByClassName('slider')[0];
	var slider = new DoubleSlider(container, 0, 3);
  return slider;
}


/*
 * Once we get the request, we want to use that information to
 * generate the cards for the client to view. Our HistoryGenerator
 * takes care of this. It comes with some functions we should call to initialize it.
 */
var processData = function(slider) {
  return function() {
    var response = JSON.parse(this.responseText);
    var hg = new HistoryGenerator(response);
    hg.next20();
    hg.registerScroll();
    hg.registerSelector();
    hg.registerDates();
    hg.registerSearch();
    slider.registerHG(hg);
  }
}


/*
 * Initializes the end-date picker to today.
 */
var initToday = function() {
  var datepicker = document.getElementById('enddate');
  var date = new Date();
  var month = date.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  var day = date.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  datepicker.value = date.getFullYear() + '-' + month + '-' + day;
}


/*
 * Takes care of initializing the date picker, pageup button,
 * slider and then finally sends a get request for the logs
 * from the server.
 */
var init = function() {

  // Initialize some features.
  initToday();
  initPageUp();
	var slider = initSlider();

  // Create a get request for the logs.
  var callback = processData(slider);
  var addr = 'http://scarletshield.rutgers.edu/demo/pulltest.php';
  get(addr, callback);
}

// Remove memory of scroll location.
window.addEventListener('beforeunload', function() {window.scrollTo(0,0)});

// Initialize our program.
document.addEventListener('DOMContentLoaded', init, false);
