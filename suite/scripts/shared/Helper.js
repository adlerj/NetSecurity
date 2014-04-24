var get = function(addr, callback) {
  var req = new XMLHttpRequest();
  req.onload = callback;
  req.open('get', addr, true);
  req.send();
}
var moveToX = function(element, to, duration) {
  var start = parseInt(element.style.marginLeft),
    change = to - start,
    currentTime = 0,
    increment = 20;

  var animateScroll = function(){        
    currentTime += increment;
    var val = easeInOutQuad(currentTime, start, change, duration);                        
    element.style.marginLeft = val + 'px'; 
    if(currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
  };
  animateScroll();
}

var scrollTo = function(element, to, duration) {
  var start = element.scrollTop,
    change = to - start,
    currentTime = 0,
    increment = 20;

  var animateScroll = function(){        
    currentTime += increment;
    var val = easeInOutQuad(currentTime, start, change, duration);                        
    element.scrollTop = val; 
    if(currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
  };
  animateScroll();
}

var easeInOutQuad = function (t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
};

/*
 * Takes care of creating event listeners for the pageup button. 
 * Three are needed:
 *   1. OnMouseUp: Used in place of click so that during that action,
 *                 we scroll up to the top of the screen.
 *   2. Click:     Used for setting onmouseup to null when the page is
 *                 automatically scrolling up. Necessary so that someone 
 *                 doesn't get glitchy if they click it twice. BTW, click
 *                 is fired after onmouseup, so that's why this works.
 *   3. OnResize:  Used to relocate the button if the screen is resized.
 */
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


