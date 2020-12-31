// interval.js

export default {

  parse: function(string) {
    var match = string.toLowerCase().match(/(\d+)\s*(d|w|m|y)/i);
    if(!match) {
      return null;
    }

    var units = ['d', 'w', 'm', 'y'];
    var amount = parseInt(match[1]);
    var unit = units.indexOf(match[2]);

    return { amount, unit };
  },

  stringify: function(object) {
    if(!object) {
      return null;
    }

    var units = ['day', 'week', 'month', 'year'];
    var string = object.amount + ' ' + units[object.unit];

    if(object.amount > 1) {
      string += 's';
    }

    return string;
  },

  format: function(string, change = 0) {
    if(!string) {
      if(!change) {
        return '';
      } else {
        return '1 week';
      }
    }

    var object = this.parse(string);

    if(!object) {
      return null;
    }

    var max = [7, 4, 12];

    // increment
    object.amount = object.amount + change;

    // what about 30 days, 90 days, 365 days, 52 weeks?
    // actually you need to consolidate recursively
      // 90 days -1 = 12 weeks WRONG
        // then 12 weeks -1 = 2months

    // over max
    if(object.unit < max.length && object.amount >= max[object.unit]) {
      if(object.amount % max[object.unit] === 0) {
        // divides evenly
        object.amount = object.amount / max[object.unit];
        object.unit = object.unit + 1;
      } else if(change > 0) {
        // round up
        object.amount = Math.ceil(object.amount / max[object.unit]);
        object.unit = object.unit + 1;
      } else if(change < 0) {
        // round down
        object.amount = Math.floor(object.amount / max[object.unit]);
        object.unit = object.unit + 1;
      }
      // else change = 0, so don't change it
    }

    // under min
    if(object.amount < 1) {
      if(object.unit > 0) {
        // downgrade
        object.unit = object.unit - 1;
        object.amount = max[object.unit] - 1;
      } else {
        // stop at 1
        object.amount = 1;
      }
    }

    return this.stringify(object);
  }

};
