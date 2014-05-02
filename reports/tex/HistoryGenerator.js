var HistoryGenerator = function(data) {
  this.data = data;
  this.cur =  data.length - 1;
  this.container = document.getElementById('dataArea');
  this.lastDate = new Date(0);
  this.lastCard = null;
  this.sorting = 'recent';
  this.lowPriority = 3;
  this.highPriority = 0;
  var startdate = document.getElementById('startdate');
  var enddate = document.getElementById('enddate');
  var sdateVal = HistoryGenerator.getStartDate(startdate.value);
  var edateVal = HistoryGenerator.getEndDate(enddate.value);
  this.startDate = sdateVal.valueOf();
  this.endDate = edateVal.valueOf();
  this.search = '';

  this.container.innerHTML = '';
  

  return this;
}

HistoryGenerator.prototype.next20 = function() {
  
  // Get some common variables to use a lot.
  var data = this.data;
  var lastDate = this.lastDate;
  var lastCard = this.lastCard;

  // Find where we left off.
  var i = this.cur;

  // We only want to do 20 at a time so keep a counter.
  var numDone = 0;
  while (numDone < 20 && i >= 0) {

    // Get the current object.
    var cur = data[i];

    if (this.search !== '') {
      var message = cur.msg.toLowerCase();
      var src = cur.src;
      var dst = cur.dst;
      var search = this.search.toLowerCase();
      console.log();
      if (message.indexOf(search) === -1 &&
          src.indexOf(search) === -1 &&
          dst.indexOf(search) === -1) {
        --i;
        continue;
      }
    }
    // If we happen to be filtering out this priority number, skip
    // this whole block.
    var priority = cur.priority;
    if (priority < this.highPriority || priority > this.lowPriority) {
      --i;
      continue;
    }

    // Get the date from it and create a Date object from it.
    var splitDate = cur.datetime.split(/[\s:-]/);
    var year = Number(splitDate[0]);
    var month = Number(splitDate[1]);
    var day = Number(splitDate[2]);
    var hour = Number(splitDate[3]);
    var minutes = Number(splitDate[4]);
    var seconds = Number(splitDate[5]);
    var curDate = new Date(year, month-1, day, hour, minutes, seconds, 0);
    
    if (curDate.valueOf() > this.endDate ||
        curDate.valueOf() < this.startDate) {
      --i;
      continue;
    }

    // If this is the same date as the last one, we want to continue on the same
    // card. If not, we want to make a new one.
    if (lastDate.toDateString() === curDate.toDateString()) {
      this.appendEntry(cur, lastCard, hour, minutes, seconds);
    } else {
      var card = this.appendCard(cur, year, month, day, hour, minutes, seconds);

      // Since this is a new card, we have to replace the old variables which no
      // longer matter.
      lastCard = card;
      lastDate = curDate;
    }
    --i;
    ++numDone;
  }

  if (i < 0 && lastCard === null) {
    this.showError();
  }
  
  // Save these variables for after we scroll down.
  this.cur = i;
  this.lastDate = lastDate;
  this.lastCard = lastCard;
}


HistoryGenerator.prototype.showError = function() {
  this.container.innerHTML = 
  "<div class='card shadow'>
    <div class='redline'></div>
    <div class='inner-card'>
      <div class='iconandtext'>
        <img class='iticon' src='images/sad.png' alt='Calendar'/>
        <h1 class='ittext'>No Results!</h1>
      </div>
      <div class='error-space'></div>
    </div>
  </div>";
}


HistoryGenerator.prototype.appendCard = function(
    cur, year, month, day, hour, minutes, seconds) {
  var card = document.createElement('div');
  card.classList.add('card', 'shadow');
  this.container.appendChild(card);

  var redline = document.createElement('div');
  redline.className = 'redline';
  card.appendChild(redline);

  var innerCard = document.createElement('div');
  innerCard.className = 'inner-card';
  card.appendChild(innerCard);

  var iconandtext = document.createElement('div');
  iconandtext.className = 'iconandtext';
  innerCard.appendChild(iconandtext);

  var iticon = document.createElement('img');
  iticon.className = 'iticon';
  iticon.src = 'images/cal.png';
  iticon.alt = 'Calendar';
  iconandtext.appendChild(iticon);

  var ittext = document.createElement('h1');
  ittext.className = 'ittext';
  ittext.innerHTML = month + '/' + day + '/' + year;
  iconandtext.appendChild(ittext);

  this.appendEntry(cur, innerCard, hour, minutes, seconds);


  return innerCard;
}

HistoryGenerator.prototype.appendEntry = function(
    cur, lastCard, hour, minutes, seconds) {
  var innerCard = lastCard;

  var line = document.createElement('div');
  line.classList.add('onepixline', 'clear');
  innerCard.appendChild(line);

  var entry = document.createElement('div');
  entry.className = 'entry';
  innerCard.appendChild(entry);

  var det = document.createElement('div');
  det.className = 'detButton';
  det.innerHTML = 'Details';
  entry.appendChild(det);


  var title = document.createElement('h2');
  title.className = 'entryTitle';
  title.innerHTML = cur.msg;
  entry.appendChild(title);

  var info = document.createElement('p');
  info.className = 'entryDes';
  var m = 'AM';
  if (hour === 0) {
    hour = '12';
  } else if (hour > 12) {
    hour = hour - 12;
    m = 'PM'
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  info.innerHTML = '<span>From</span> ' + cur.src +
    ' <span>at</span> ' + hour + ':' + minutes + ':' + seconds + m;
  entry.appendChild(info);

  var prio = document.createElement('p');
  prio.className = 'entryDes';
  prio.innerHTML = '<span>Priority</span> ' + cur.priority;
  entry.appendChild(prio);

  var popout = document.createElement('div');
  popout.style.display = 'none';
  entry.appendChild(popout);

  var srcdst = document.createElement('p');
  srcdst.className = 'entryDes';
  srcdst.innerHTML = '<span>Source IP: </span>' + cur.src +
    '<span>, Destination IP: </span>' + cur.dst;
  popout.appendChild(srcdst);

  var cid = document.createElement('p');
  cid.className = 'entryDes';
  cid.innerHTML = '<span>CID: </span>' + cur.cid;
  popout.appendChild(cid);

  var loc = document.createElement('p');
  loc.className = 'entryDes';
  popout.appendChild(loc);


  var expanded = false;
  var foundLocation = false;
  det.onclick = function() {
    if (expanded === false ) {
      if (foundLocation === false) {
        var geoURL = 'http://162.248.161.124:8080/json/';

        get(geoURL + cur.src, function() {
          var response = JSON.parse(this.responseText);
          var string = '';
          if (response.region_name !== '') {
            string += response.region_name + ', ';
          }
          if (response.country_name !== '') {
            string += response.country_name;
          }
          if (string === '') {
            string = 'Location unknown.';
          } else {
            string = '<span>Location: </span>' + string;
          }
           loc.innerHTML = string;
        });

        foundLocation = true;
      }
      popout.style.display = 'block';
      expanded = true;
    } else {
      popout.style.display = 'none';
      expanded = false;
    }
  }

}

HistoryGenerator.prototype.registerScroll = function() {
  var content = document.getElementById('content');
  var bottom = document.createElement('div');
  bottom.className = 'bottom-space';
  content.appendChild(bottom);

  var pageupShown = false;
  var hg = this;
  window.onscroll = function(e) {
    e.preventDefault();
    var winHeight = window.innerHeight;
    var divLocation =
      document.getElementsByClassName('bottom-space')[0].getBoundingClientRect().top;

    if (divLocation < winHeight) {
      hg.next20();
    }
    
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
  };
}

HistoryGenerator.prototype.sortBy = function(type) {
  if (type === 'recent') {
    if (this.sorting === 'oldest') {
      this.data.reverse();
    } else {
      this.data.sort(function(a, b) {
        return a.id - b.id;
      });
    }
  } else if (type === 'oldest') {
    if (this.sorting === 'recent') {
      this.data.reverse();
    } else {
      this.data.sort(function(a, b) {
        return b.id - a.id;
      });
    }
  } else if (type === 'pinc') {
    this.data.sort(function(a, b) {
      var retval = a.priority - b.priority;
      if (retval === 0) {
        return a.id - b.id;
      }
      return retval
    });
  } else if (type === 'pdec') {
    this.data.sort(function(a, b) {
      var retval = b.priority - a.priority;
      if (retval === 0) {
        return a.id - b.id;
      }
      return retval
    });
  }
  this.refreshUs();
  this.sorting = type;
  console.log(this);
}

HistoryGenerator.prototype.refreshUs = function() {
  window.scrollTo(0,0);
  this.cur = this.data.length - 1;
  this.container.innerHTML = '';
  this.lastDate = new Date(0);
  this.lastCard = null;
  this.next20();

}

HistoryGenerator.prototype.registerSelector = function() {
  var selector = document.getElementById('selector');
  var hg = this;
  selector.onchange = function() {
    hg.sortBy(selector.value);
  }
}

HistoryGenerator.prototype.registerDates = function() {
  var startdate = document.getElementById('startdate');
  var enddate = document.getElementById('enddate');
  var hg = this;
  startdate.onblur = function() {
    var date = HistoryGenerator.getStartDate(startdate.value);
    hg.startDate = date.valueOf();
    hg.refreshUs();
  }
  enddate.onblur = function() {
    var date = HistoryGenerator.getEndDate(enddate.value);
    hg.endDate = date.valueOf();
    hg.refreshUs();
  }

}

HistoryGenerator.prototype.registerSearch = function() {
  var bar = document.getElementById('searchbox');
  var button = document.getElementById('searchsubmit');
  var hg = this;
  button.onclick = function() {
    var value = bar.value;
    hg.search = value;
    hg.refreshUs();
  }
  bar.onkeypress = function(e) {
    if (e.keyCode === 13) {
      var value = bar.value;
      hg.search = value;
      hg.refreshUs();
    }
  }

}

HistoryGenerator.getStartDate = function(value) {
    var tokenized = value.split('-');
    var year = Number(tokenized[0]);
    var month = Number(tokenized[1]);
    var day = Number(tokenized[2]);
    var date = new Date(year, month-1, day, 0, 0, 0, 0);
    return date;

}
HistoryGenerator.getEndDate = function(value) {
    var tokenized = value.split('-');
    var year = Number(tokenized[0]);
    var month = Number(tokenized[1]);
    var day = Number(tokenized[2]);
    var date = new Date(year, month-1, day, 23, 59, 59, 999);
    return date;
}

HistoryGenerator.prototype.setHighPriority = function(value) {
  this.highPriority = value;
  this.refreshUs();
}
HistoryGenerator.prototype.setLowPriority = function(value) {
  this.lowPriority = value;
  this.refreshUs();
}
