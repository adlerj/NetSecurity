

/*
 * The Analytics class. Starts up our analytics in the div with id equal
 * to dataArea. Use Analytics.init() to kick off the process.
 */
var Analytics = function(data) {
  this.data = data;
  this.container = document.getElementById('dataArea');

  return this;
}


/*
 * Initializes all of the boxes in the Analytics class.
 */
Analytics.prototype.init = function() {
  
  // Clear the area for our data.
  this.container.innerHTML = '';

  // Create the time thing
  var tc = this.createTimeChart();

  // Create common IP thing
  var ip = this.createCommonIPs();

  // Create common attacks thing
  var att = this.createCommonAttacks();

  // Create common Locations
  this.createCommonLocations();

  // Hotlinks to divs.
  this.hotlinks(tc, ip, att);
}


/*
 * Creates the first box, the time chart, for the Analytics class.
 */
Analytics.prototype.createTimeChart = function() {
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
  iconandtext.style.width = '50%';
  innerCard.appendChild(iconandtext);

  var iticon = document.createElement('img');
  iticon.className = 'iticon';
  iticon.src = 'images/pie.png';
  iticon.alt = 'Mmm... pie.';
  iconandtext.appendChild(iticon);

  var ittext = document.createElement('h1');
  ittext.className = 'ittext';
  ittext.innerHTML = 'Time Analysis';
  iconandtext.appendChild(ittext);

  var line = document.createElement('div');
  line.classList.add('onepixline', 'clear');
  innerCard.appendChild(line);

  var entry = document.createElement('div');
  entry.className = 'entry';
  innerCard.appendChild(entry);

  var dash = document.createElement('div');
  dash.id = 'dashboard';
  entry.appendChild(dash);

  var cha = document.createElement('div');
  cha.id = 'chart';
  cha.style.width = '100%';
  cha.style.height = '400px';
  dash.appendChild(cha);

  var con = document.createElement('div');
  con.id = 'control';
  con.style.width = '100%';
  con.style.height = '50px';
  dash.appendChild(con);

  var dashboard = new google.visualization.Dashboard(dash);

  var control = new google.visualization.ControlWrapper({
    'controlType': 'ChartRangeFilter',
    'containerId': 'control',
    'options': {
      'filterColumnIndex': 0,
      'ui': {
        'chartType': 'LineChart',
        'chartOptions': {
          'chartArea': {'width': '90%'},
          'hAxis': {'baselineColor': 'none'}
        },
        'minRangeSize': 86400000
      }
    },
  });

  var chart = new google.visualization.ChartWrapper({
    'chartType': 'ColumnChart',
    'containerId': 'chart',
    'options': {
      'chartArea': {'height': '80%', 'width': '80%'},
      'hAxis': {'slantedText': false},
      'legend': {'position': 'none'}
    },
    'view': {
      'columns': [
        {
          'calc': function(dataTable, rowIndex) {
            return dataTable.getFormattedValue(rowIndex, 0);
          },
          'type': 'string'
        }, 1]
    }
  });

  var data = new google.visualization.DataTable();
  data.addColumn('date', 'Date');
  data.addColumn('number', 'Number of Attacks');


  var hash = {};
  var i;
  for (i = 0; i < this.data.length; ++i) {
    var cur = this.data[i];
    var splitDate = cur.datetime.split(/[\s:-]/);
    var year = Number(splitDate[0]);
    var month = Number(splitDate[1]);
    var day = Number(splitDate[2]);
    var hour = Number(splitDate[3]);
    var minutes = Number(splitDate[4]);
    var seconds = Number(splitDate[5]);
    var curDate = new Date(year, month-1, day, 0, 0, 0, 0);
    if (hash[curDate]) {
      hash[curDate]++;
    } else {
      hash[curDate] = 1;
    }
  }

  var objs;
  for (objs in hash) {
    var date = new Date(objs);
    data.addRow([date, hash[objs]]);
  }

  dashboard.bind(control, chart);
  dashboard.draw(data);

  return card;
}

Analytics.prototype.createCommonIPs = function() {
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
  iconandtext.style.width = '50%';
  innerCard.appendChild(iconandtext);

  var iticon = document.createElement('img');
  iticon.className = 'iticon';
  iticon.src = 'images/pie.png';
  iticon.alt = 'Mmm... pie.';
  iconandtext.appendChild(iticon);

  var ittext = document.createElement('h1');
  ittext.className = 'ittext';
  ittext.innerHTML = 'Common IPs';
  iconandtext.appendChild(ittext);


  var hash = {};
  var i;
  for (i = 0; i < this.data.length; ++i)  {
    var cur = this.data[i];
    if (cur.src.indexOf('128.6.238') !==  -1) {
      continue;
    }
    if (hash[cur.src]) {
      hash[cur.src]++;
    } else {
      hash[cur.src] = 1;
    }
  }

  var hash2 = [];
  var max = 0;
  for (j in hash) {
    if (hash2[hash[j]]) {
      hash2[hash[j]].push(j);
    } else {
      hash2[hash[j]] = [];
      hash2[hash[j]].push(j);
    }
    if (max < hash[j]) {
      max = hash[j];
    }
  }


  var data = new google.visualization.DataTable();
  data.addColumn('string', 'IP Address');
  data.addColumn('number', 'Number of Occurrences');

  for (i = max; i >=0; --i) {
    if (hash2[i]) {
      var j;
      for (j in hash2[i]) {
        data.addRow([hash2[i][j], i]);
      }
    }
  }
  var options = {
    title: 'IP Address Occurences'
  };
  var divi = document.createElement('div');
  divi.classList.add('onepixline', 'clear');
  innerCard.appendChild(divi);

  var pie = document.createElement('div');
  pie.className = 'entry';
  pie.style.height = '500px';
  innerCard.appendChild(pie);

  var chart = new google.visualization.PieChart(pie);
  chart.draw(data, options);


  var numDone = 0;
  for (i = max; i >= 0; --i) {
    if (hash2[i]) {
      console.log(i);
      //console.log(hash2[i]);
      var line = document.createElement('div');
      line.classList.add('onepixline', 'clear');
      innerCard.appendChild(line);

      var entry = document.createElement('div');
      entry.className = 'entry';
      innerCard.appendChild(entry);

      var title = document.createElement('h2');
      title.className = 'entryTitle';
      title.innerHTML = hash2[i][0];
      entry.appendChild(title);

      var info = document.createElement('p');
      info.className = 'entryDes';
      info.innerHTML = '<span>With</span> ' + i + ' <span>associated attack records.</span>';
      entry.appendChild(info);
      numDone++;
      if (numDone >= 5) {
        break;
      }
    }
  }

  for (i = 0; i < 0; ++i) {
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
    info.innerHTML = '<span>From</span> ' + cur.src + ' <span>at</span> ' + hour + ':' + minutes + ':' + seconds + m;
    entry.appendChild(info);

    var prio = document.createElement('p');
    prio.className = 'entryDes';
    prio.innerHTML = '<span>Priority</span> ' + cur.priority;
    entry.appendChild(prio);
  }

  return card;
}

Analytics.prototype.createCommonAttacks = function() {
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
  iconandtext.style.width = '50%';
  innerCard.appendChild(iconandtext);

  var iticon = document.createElement('img');
  iticon.className = 'iticon';
  iticon.src = 'images/pie.png';
  iticon.alt = 'Mmm... pie.';
  iconandtext.appendChild(iticon);

  var ittext = document.createElement('h1');
  ittext.className = 'ittext';
  ittext.innerHTML = 'Common Attacks';
  iconandtext.appendChild(ittext);


  var hash = {};
  var i;
  for (i = 0; i < this.data.length; ++i)  {
    var cur = this.data[i];
    if (cur.src.indexOf('128.6.238') !==  -1) {
      continue;
    }
    if (hash[cur.msg]) {
      hash[cur.msg]++;
    } else {
      hash[cur.msg] = 1;
    }
  }

  var hash2 = [];
  var max = 0;
  for (j in hash) {
    if (hash2[hash[j]]) {
      hash2[hash[j]].push(j);
    } else {
      hash2[hash[j]] = [];
      hash2[hash[j]].push(j);
    }
    if (max < hash[j]) {
      max = hash[j];
    }
  }
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Name of Attack');
  data.addColumn('number', 'Number of Occurrences');

  for (i = max; i >=0; --i) {
    if (hash2[i]) {
      var j;
      for (j in hash2[i]) {
        data.addRow([hash2[i][j], i]);
      }
    }
  }
  var options = {
    title: 'Attack Occurences'
  };
  var divi = document.createElement('div');
  divi.classList.add('onepixline', 'clear');
  innerCard.appendChild(divi);

  var pie = document.createElement('div');
  pie.className = 'entry';
  pie.style.height = '500px';
  innerCard.appendChild(pie);

  var chart = new google.visualization.PieChart(pie);
  chart.draw(data, options);

  var numDone = 0;
  for (i = max; i >= 0; --i) {
    if (hash2[i]) {
      console.log(i);
    var line = document.createElement('div');
    line.classList.add('onepixline', 'clear');
    innerCard.appendChild(line);

    var entry = document.createElement('div');
    entry.className = 'entry';
    innerCard.appendChild(entry);

    var title = document.createElement('h2');
    title.className = 'entryTitle';
    title.innerHTML = hash2[i][0];
    entry.appendChild(title);

    var info = document.createElement('p');
    info.className = 'entryDes';
    info.innerHTML = '<span>With</span> ' + i + ' <span>associated records.</span>';
    entry.appendChild(info);
      numDone++;
      if (numDone >= 5) {
        break;
      }
    }
  }

  for (i = 0; i < 0; ++i) {
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
    info.innerHTML = '<span>From</span> ' + cur.src + ' <span>at</span> ' + hour + ':' + minutes + ':' + seconds + m;
    entry.appendChild(info);

    var prio = document.createElement('p');
    prio.className = 'entryDes';
    prio.innerHTML = '<span>Priority</span> ' + cur.priority;
    entry.appendChild(prio);
  }

  return card;
}


/*
 * Creates the finder for common locations -- unimplemented as of now.
 */
Analytics.prototype.createCommonLocations = function() {

}


Analytics.prototype.hotlinks = function(tc, ip, att) {
  var hottc = document.getElementById('tc');
  var hotip = document.getElementById('ip');
  var hotatt = document.getElementById('att');

  hottc.onclick = function() {
    scrollTo(document.body, tc.getBoundingClientRect().top + window.scrollY, 200);
  };
  hotip.onclick = function() {
    scrollTo(document.body, ip.getBoundingClientRect().top + window.scrollY, 200);
  };
  hotatt.onclick = function() {
    scrollTo(document.body, att.getBoundingClientRect().top + window.scrollY, 200);
  };

  window.addEventListener('scroll', function(e) {
    e.preventDefault();
    if (att.getBoundingClientRect().top <= 0) {
      hotip.classList.remove('underlined');
      hottc.classList.remove('underlined');
      if (!hotatt.classList.contains('underlined')) {
        hotatt.classList.add('underlined');
      }
    } else if (ip.getBoundingClientRect().top <= 0) {
      hotatt.classList.remove('underlined');
      hottc.classList.remove('underlined');
      if (!hotip.classList.contains('underlined')) {
        hotip.classList.add('underlined');
      }
    } else {
      hotip.classList.remove('underlined');
      hotatt.classList.remove('underlined');
      if (!hottc.classList.contains('underlined')) {
        hottc.classList.add('underlined');
      }
    }
    return false;
  });
}


