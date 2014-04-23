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

