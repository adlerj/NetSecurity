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

  // Hotlinks to divs.
  this.hotlinks(tc, ip, att);
}


/*
 * Creates the first box, the time chart, for the Analytics class.
 * Uses Google Charts Chart Control on a Column Graph to map out
 * all the attacks according to the day they were created.
 */
Analytics.prototype.createTimeChart = function() {
  var card = document.createElement('div');
  card.classList.add('card', 'shadow');
  this.container.appendChild(card);

  var innerCard = this.initCard(card);

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
    var curDate = year + ' ' + month + ' ' + day;
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


/*
 * Shows a pie chart all the IP addresses weighing how
 * often they show up. After this, we add on the five most
 * common ones along with some details about them.
 */
Analytics.prototype.createCommonIPs = function() {

  var card = document.createElement('div');
  card.classList.add('card', 'shadow');
  this.container.appendChild(card);

  var innerCard = this.initCard(card);

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
  
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'IP Address');
  data.addColumn('number', 'Number of Occurrences');

  for (i in hash) {
    if (hash[i]) {
      data.addRow([i, hash[i]]);
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

  for (i = 0; i < 5; ++i) {
    var j, max = 0, maxIndex = -1;
    for (j in hash) {
      if (hash[j] > max) {
        max = hash[j];
        maxIndex = j;
      }
    }
    
    var line = document.createElement('div');
    line.classList.add('onepixline', 'clear');
    innerCard.appendChild(line);

    var entry = document.createElement('div');
    entry.className = 'entry';
    innerCard.appendChild(entry);

    var title = document.createElement('h2');
    title.className = 'entryTitle';
    title.innerHTML = maxIndex;
    entry.appendChild(title);

    var info = document.createElement('p');
    info.className = 'entryDes';
    info.innerHTML = '<span>With</span> ' + max + ' <span>associated attack records.</span>';
    entry.appendChild(info);

    hash[maxIndex] = undefined;
  }

  return card;
}


/*
 * Creates a way to see the most common attacks. Shows a
 * pie chart of all values as well as listing the top
 * five underneath with some details.
 */
Analytics.prototype.createCommonAttacks = function() {
  var card = document.createElement('div');
  card.classList.add('card', 'shadow');
  this.container.appendChild(card);

  var innerCard = this.initCard(card);

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


  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Name of Attack');
  data.addColumn('number', 'Number of Occurrences');

  for (i in hash) {
    if (hash[i]) {
      data.addRow([i, hash[i]]);
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

  for (i = 0; i < 5; ++i) {
    var j, max = 0, maxIndex = -1;
    for (j in hash) {
      if (hash[j] > max) {
        max = hash[j];
        maxIndex = j;
      }
    }
    
    var line = document.createElement('div');
    line.classList.add('onepixline', 'clear');
    innerCard.appendChild(line);

    var entry = document.createElement('div');
    entry.className = 'entry';
    innerCard.appendChild(entry);

    var title = document.createElement('h2');
    title.className = 'entryTitle';
    title.innerHTML = maxIndex;
    entry.appendChild(title);

    var info = document.createElement('p');
    info.className = 'entryDes';
    info.innerHTML = '<span>With</span> ' + max + ' <span>associated records.</span>';
    entry.appendChild(info);

    hash[maxIndex] = undefined;
  }

  return card;
}


/*
 * A helper class to start up the creation of a card since it
 * is so common.
 */
Analytics.prototype.initCard = function(card) {
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

  return innerCard;
}


/*
 * A class that starts up the hotlinks functionality: scrolling
 * to the section when it is clicked and as the user is scrolling,
 * update which section we are in with an underline.
 */
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
