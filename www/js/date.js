// date.js

export default {

  parse: function(string) {
    var match = string.match(/(\d+)\D+(\d+)\D+(\d+)/);
    if(!match) {
      return null;
    }

    return new Date(match[1], match[2] - 1, match[3]);
  },

  stringify: function(object) {
    if(!object) {
      return null;
    }
    
    function pad(n) {
      n = n.toString();
      if(n.length < 2) {
        n = '0' + n;
      }
      return n;
    }

    var parts = [
      object.getFullYear(),
      pad(object.getMonth() + 1),
      pad(object.getDate())
    ];
    
    return parts.join('-');
  },

  format: function(string, change = 0) {
    if(!string) {
      if(!change) {
        return '';
      } else {
        return this.stringify(new Date());
      }
    }

    var object = this.parse(string);

    if(!object) {
      return null;
    }

    object.setDate(object.getDate() + change);

    return this.stringify(object);
  }
  
};
