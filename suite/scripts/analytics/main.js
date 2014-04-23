
var processData = function() {
  return function() {
    var response = JSON.parse(this.responseText);
    var analy = new Analytics(response);
    analy.init();
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
    scrollTo(document.body, 0, 500);
    setTimeout(applyMouseUp, 500, func);
  };
  applyMouseUp(func);
  pageup.addEventListener('click', function() {pageup.onmouseup = null;});
  window.onresize = function() {
    pageup.style.marginTop = window.innerHeight - 150 + 'px';
  };
}

var registerScroll = function() {
  var content = document.getElementById('content');
  var bottom = document.createElement('div');
  bottom.className = 'bottom-space';
  content.appendChild(bottom);

  var pageupShown = false;
  var hg = this;
  window.addEventListener('scroll', function(e) {
    e.preventDefault();
    var winHeight = window.innerHeight;
    var divLocation = document.getElementsByClassName('bottom-space')[0].getBoundingClientRect().top;
    
    var side = document.getElementById('sidebar');
    if (window.scrollY > 100) {
      if (pageupShown === false) {
        var pageup = document.getElementById('pageup');
        moveToX(pageup, 20, 175);
        pageupShown = true;
      }
      var side = document.getElementById('sidebar');
      side.style.position = 'fixed';
      side.style.marginTop ='-100px';
    } else {
      if (pageupShown === true) {
        var pageup = document.getElementById('pageup');
        moveToX(pageup, -150, 175);
        pageupShown = false;
      }
      side.style.marginTop ='0px';
      side.style.position = 'static';
    }
    return false;
  });
}


var init = function() {
  initPageUp();
  registerScroll();

  var callback = processData();
  var addr = 'http://scarletshield.rutgers.edu/demo/pulltest.php';
  get(addr, callback);
}



// Load the Google Charts Library.
google.load('visualization', '1.1', {packages: ['corechart', 'controls']});

// Remove memory of scroll location.
window.addEventListener('beforeunload', function() {window.scrollTo(0,0)});

// Initialize our program.
document.addEventListener('DOMContentLoaded', init, false);


