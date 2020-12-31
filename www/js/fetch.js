// fetch.js

function noWeeks(key, value) {
  if (typeof value === 'string') {
    var match = value.match(/^(\d+)\s*weeks?$/);
    if (match) {
      var number = match[1] * 7;
      return number + ' days';
    }
  }
  return value;
};

function weeksToDays(key, value) {
  if (typeof value === 'string') {
    var match = value.match(/^(\d+)\s*days?$/);
    if (match && match[1] % 7 === 0) {
      var amount = Math.round(match[1] / 7);
      var unit = 'week';
      if(amount > 1) {
        unit = 'weeks';
      }
      return amount + ' ' + unit;
    }
  }
  return value;
};

// above should probably go in the module

export default {

  request: function(method, url, data = null) {
    var request = {
      method: method
    };

    if(data) {
      if(method === 'POST' || method === 'PUT') {
        request.headers = {'Content-Type': 'application/json'};
        request.body = JSON.stringify(data, noWeeks);
      } else {
        var params = new URLSearchParams(data);
        url = url + '?' + params.toString();
      }
    }

    //console.log(Object.assign({ url: url}, request));

    var response = {};

    return new Promise((resolve, reject) => {
      fetch(url, request).then(function(resp) {
        response.status = resp.status;
        return resp.text();
      }).then(function(json) {
        if(json) {
          response.body = JSON.parse(json, weeksToDays);
        }

        //console.log(response);

        resolve(response);
      });
    });
  }

}
