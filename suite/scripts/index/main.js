
var initSlider = function() {
	var container = document.getElementsByClassName('slider')[0];
	var slider = new DoubleSlider(container, 0, 3);
  return slider;
}

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

var initPageUp = function() {
  var pageup = document.getElementById('pageup');
  pageup.style.marginLeft = '-100px';
  pageup.style.marginTop = window.innerHeight - 150 + 'px';

  var applyMouseUp = function(callback) {
    pageup.onmouseup = callback
  }
  var func = function(e) {
    scrollTo(document.body, 0, 700);
    setTimeout(applyMouseUp, 700, func);
  };
  applyMouseUp(func);
  pageup.addEventListener('click', function() {pageup.onmouseup = null;});
  window.onresize = function() {
    pageup.style.marginTop = window.innerHeight - 150 + 'px';
  };
}

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


var init = function() {
  initToday();
  initPageUp();
	var slider = initSlider();

  var callback = processData(slider);
  var addr = 'http://scarletshield.rutgers.edu/demo/pulltest.php';
  get(addr, callback);
}

// Remove memory of scroll location.
window.addEventListener('beforeunload', function() {window.scrollTo(0,0)});

// Initialize our program.
document.addEventListener('DOMContentLoaded', init, false);
