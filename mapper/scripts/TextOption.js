/*
 * Class for a piece of text in the options menu.
 */
var TextOption = function(text, options) {
  var cur = document.createElement('div');
  cur.className = 'text-option';
  cur.innerHTML = text;
  options.appendChild(cur);

  google.maps.event.addDomListener(cur, 'mouseover', function() {
    $(cur).finish().animate({backgroundColor: '#0099FF'}, 150);
  });
  google.maps.event.addDomListener(cur, 'mouseout', function() {
    $(cur).finish().animate({backgroundColor: 'white'}, 150);
  });

  return cur;
}
