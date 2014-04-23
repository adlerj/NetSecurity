
/*
 * DoubleSlider class. Takes an element and creates it into a slider.
 */
var DoubleSlider = function(container, min, max, width, height, handleRadius) {
  this.hg = null;

	var sliderBar = document.createElement('div');
	sliderBar.className = 'slidebar';
	container.appendChild(sliderBar);
	var xOffset = Math.max(document.documentElement.scrollLeft,
      document.body.scrollLeft);
	var sliderBounds = sliderBar.getBoundingClientRect();
	var sliderX = Math.floor(sliderBounds.left + xOffset);
	var sliderWidth = sliderBounds.width;
	
	var leftHandle = document.createElement('div');
	leftHandle.className = 'handle-left';
	var leftOffset = 0;
	container.appendChild(leftHandle);
	
	var rightHandle = document.createElement('div');
	rightHandle.className = 'handle-right';
	var rightOffset = sliderWidth - 14;
	rightHandle.style.marginLeft = rightOffset + 'px';
	container.appendChild(rightHandle);
	
	var leftMoving = false;
	var rightMoving = false;
	var leftValue = min;
	var rightValue = max;
  var lastLeft = min;
  var lastRight = max;
	var slidingArea = sliderWidth - 14;
	var sectionBlock = slidingArea/(max-min);
	var fixError = false;
	
	leftHandle.onmousedown = function() {
		leftMoving = true;
		return false;
	}
	rightHandle.onmousedown = function() {
		if (!fixError) {
			rightMoving = true;
		} else {
			leftMoving = true;
		}
		return false;
	}

  var ds = this;
	document.onmouseup = function() {
    if (leftMoving && lastLeft !== leftValue) {
      lastLeft = leftValue;
      ds.hg.setHighPriority(leftValue);
    }
    if (rightMoving && lastRight !== rightValue) {
      lastRight = rightValue;
      ds.hg.setLowPriority(rightValue);
    }
		leftMoving = false;
		rightMoving = false;
		if (leftValue < max) {
			fixError = false;
		}
		//return false;
	}
	
	document.onmousemove = function(e) {
		if (leftMoving) {
	    xOffset = Math.max(document.documentElement.scrollLeft,
          document.body.scrollLeft);
	    sliderBounds = sliderBar.getBoundingClientRect();
	    sliderX = Math.floor(sliderBounds.left + xOffset);
			var curpos = e.pageX - sliderX;
			var curValue = Math.floor(curpos/sectionBlock + .5) + min;
			if (curValue !== leftValue &&
          curValue <= max &&
          curValue >= min &&
          curValue <= rightValue) {
				leftValue = curValue;
				leftHandle.style.marginLeft = (curValue - min)*sectionBlock + 'px';
				updateText();
				if (curValue === rightValue) {
					fixError = true;
				}
			}
		} else if (rightMoving) {
	    xOffset = Math.max(document.documentElement.scrollLeft,
          document.body.scrollLeft);
	    sliderBounds = sliderBar.getBoundingClientRect();
	    sliderX = Math.floor(sliderBounds.left + xOffset);
			var curpos = e.pageX - sliderX;
			var curValue = Math.floor(curpos/sectionBlock + .5) + min;
			if (curValue !== rightValue &&
          curValue <= max &&
          curValue >= min &&
          curValue >= leftValue) {
				rightValue = curValue;
				rightHandle.style.marginLeft = (curValue - min)*sectionBlock + 'px';
				updateText();
			}
		}
	}
	
	var text = document.createElement('p');
	text.style.textAlign = 'center';
	var updateText = function() {
		text.innerHTML = leftValue + ' to ' + rightValue;
	}
	updateText();
	container.appendChild(text);
  return this;
}

DoubleSlider.prototype.registerHG = function(hg) {
  this.hg = hg;
}



