// https://weblog.west-wind.com/posts/2014/jan/06/javascript-json-date-parsing-and-real-dates
if (window.JSON && !window.JSON.dateParser) {
  JSON.dateParser = function (key, value) {
    if (typeof value === 'string') {
      var match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (match) {
        return new Date(match[1], match[2] - 1, match[3]); // local
      }
    }
    return value;
  };
  JSON.dateStringifier = function (key, value) {
    if (typeof value === 'string') {
      var match = value.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2}\.\d{3})(Z)$/);
      if (match) {
        var date = new Date(match[0]); // back to local
        return dateString(date);
      }
    }
    return value;
  };
}

window.addEventListener('load', function() {
  var buttons = document.querySelectorAll('button');

  buttons.forEach(function(button) {
    button.addEventListener('click', function(e) {

      fetch(document.getElementById('endpoint').value, {
        method: e.target.innerHTML,
        headers: {
          'Content-Type': 'application/json'
        },
        body: e.target.innerHTML === 'GET' ? null : document.getElementById('data').value
      }).then(function(response) {
        document.getElementById('status').innerHTML = response.status;
        //if(response.headers.get("Content-Length") > 0) {
          return response.text();
        //} else {
          //return null;
        //}
      }).then(function(json) {
        if(json) {
          json = JSON.parse(json, JSON.dateParser);
          //console.log(json);
          document.getElementById('response').innerHTML = JSON.stringify(json, JSON.dateStringifier, 2);
        } else {
          document.getElementById('response').innerHTML = '';
        }
      });

    });
  });
  
});

function dateString(date = new Date()) {
  function pad(n, width=2, z='0') {
    n = n.toString();
    while(n.length < width) {
      n = z + n;
    }
    return n;
  }

  var parts = [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate())
  ];
  
  return parts.join('-');
}