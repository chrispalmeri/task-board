// form.js

import element from './element.js';
import interval from './interval.js';
import date from './date.js';
import fetch from './fetch.js';

var modules = {
  interval: interval,
  date: date
};

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default {

  data: null,
  element: null,

  create: function(data) {
    if(this.element) {
      this.cancel();
    }

    document.getElementById('content').classList.add('blur');

    var mask = element.append(document.body, 'div.mask');
    var form = element.append(mask, 'div.form');
    element.append(form, 'h2', data.title || capitalize(data.action + ' ' + data.type));
    if(data.message) {
      element.append(form, 'p', data.message);
    }

    for(var field in data.fields) {
      var item = data.fields[field];
      item.id = field;

      var p = element.append(form, 'p');
      item.wrapper = p;
      element.append(p, 'label', item.label || capitalize(field), {'for': field});
      element.append(p, 'br');

      var span = element.append(p, 'span.input');
      var input = element.append(span, 'input', item.value || null, {'id': field});
      item.element = input;
      input.addEventListener('blur', (e) => {
        var x = this.data.fields[e.target.id];
        
        // validate and format type
        // if you consolidate, this is the best one
        if(e.target.value !== '') {
          if(x.type) {
            var valid = modules[x.type].format(e.target.value);

            if(valid) {
              e.target.value = valid;
              x.wrapper.classList.remove('error');
            } else {
              x.wrapper.classList.add('error');
            }
          } else {
            x.wrapper.classList.remove('error');
          }
        }
      });

      // this is brute force, ideally the template should come from the corresponding type module
      if(item.type) {
        var down = element.append(span, 'button.increment', '-', {'data-target': item.id, 'data-change': '-1'});
        // def need to factor out the validation
        down.addEventListener('click', (e) => {
          var chan = parseInt(e.target.dataset.change);
          var x = this.data.fields[e.target.dataset.target];

          var valid = modules[x.type].format(x.element.value, chan);

          if(valid === null) {
            x.wrapper.classList.add('error');
          } else {
            x.element.value = valid;
            x.wrapper.classList.remove('error');
          }
        });

        var up = element.append(span, 'button.increment', '+', {'data-target': item.id, 'data-change': '+1'});
        // def need to factor out the validation
        up.addEventListener('click', (e) => {
          var chan = parseInt(e.target.dataset.change);
          var x = this.data.fields[e.target.dataset.target];

          var valid = modules[x.type].format(x.element.value, chan);

          if(valid === null) {
            x.wrapper.classList.add('error');
          } else {
            x.element.value = valid;
            x.wrapper.classList.remove('error');
          }
        });
      }
    }

    var submit = element.append(form, 'p.submit');
    element.append(submit, 'button.' + data.action, capitalize(data.action), null, {
      click: (e) => { this.submit(e); }
    });
    element.append(submit, 'button.cancel', 'Cancel', null, {
      click: () => { this.cancel(); }
    });
    
    this.data = data;
    this.element = mask;

    return new Promise((resolve, reject) => {
      this.reject = reject
      this.resolve = resolve
    })
  },
  
  submit: function(e) {
    var methods = {
      create: 'POST',
      update: 'PUT',
      delete: 'DELETE'
    };
    var method = methods[this.data.action];

    var url = '/api/' + this.data.type + 's';
    if(this.data.id) {
      url = url + '/' + this.data.id;
    }

    var payload = null;
    var valid = true;

    for(var field in this.data.fields) {
      if(!payload) {
        payload = {};
      }
      var item = this.data.fields[field];

      item.wrapper.classList.remove('error');

      var value = item.element.value;
      if(value) {
        payload[item.id] = value;
      }
      
      // validate required
      else if(item.required) {
        valid = false;
        item.wrapper.classList.add('error');
      }

      // still need to make sure non-required fields are not invalid format
    }

    if(valid) {
      e.target.disabled = true;
      fetch.request(method, url, payload).then((response) => {
        e.target.disabled = false;
        this.resolve();
        this.cancel();
        
      });
    }
  },
  
  cancel: function() {
    document.body.removeChild(this.element);
    document.getElementById('content').classList.remove('blur');
    this.element = null;
    this.reject();
  }

};
