
/*
 * DoubleSlider class. Takes the container that we passed in
 * and makes it into a slider with min and max set according
 * to the arguments.
 */
var DoubleSlider = function(container, min, max) {

  // hg is the variable that keeps the associated HistoryGenerator
  // that this slider is affecting. Null for now but will be set
  // later.
  this.hg = null;
  this.container = container;
  this.min = min;
  this.max = max;

  this.init()

  return this;
}


/*
 * Initializes the slider by creating all elements and event
 * listeners.
 */
DoubleSlider.prototype.init = function() {
  var container = this.container;
  var min = this.min;
  var max = this.max;

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

};


/*
 * When our HistoryGenerator is created, this is a funtion that
 * should be called so that this slider is able to talk to it.
 */
DoubleSlider.prototype.registerHG = function(hg) {
  this.hg = hg;
}



