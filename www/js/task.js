// task.js

import form from './form.js';
import fetch from './fetch.js';
import element from './element.js';
import date from './date.js';

// this was undefined 42, 72, 86
// made it global in main, but does that defeat the whole purpose of the promises???

function prettyDate(string) {
  if(!string) {
    return null;
  }

  var match = string.match(/(\d{4})-(\d{2})-(\d{2})/);
  if(!match) {
    return null;
  }
  var date = new Date(match[1], match[2] - 1, match[3]);
  
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  var diff = (date - today) / (24 * 60 * 60 * 1000)
  
  var prefix = 'due in '
  var units = ' day';
  var suffix = '';
  
  switch(diff) {
    case(0):
      return 'due today';
      break;
    case(1):
      return 'due tomorrow';
      break;
    case(-1):
      return 'due yesterday';
      break;
  }
  
  if(diff < 0) {
    prefix = '';
    suffix = ' overdue';
  }
  
  diff = Math.abs(diff);
  
  if(diff >= 365) {
    diff = diff / 365;
    units = ' year';
  } else if(diff >= 30) {
    diff = diff / 30;
    units = ' month';
  } else if(diff >= 7) {
    diff = diff / 7;
    units = ' week';
  }
  
  diff = Math.round(diff);
  
  if(diff > 1) {
    units = units + 's';
  }
  
  return prefix + diff + units + suffix;
}

export default {

  filter: {
    filter: true
  },

  update: function(select = null) {
    var whole, content;
    if(select) {
      whole = false;
      content = document.getElementById(select);
      content.innerHTML = '';
      element.append(content, 'h2', 'Tasks <a href=#task>-&gt;</a>');
    } else {
      whole = true;
      var temp = document.getElementById('content');
      temp.innerHTML = '';
      content = element.append(temp, 'div.card');
      element.append(content, 'h2', '<a href=#dash>&lt;-</a> Tasks');
    }
    
    // this is pretty janky now
    if(whole) {
      this.filter = null;
    } else {
      this.filter = {
        filter: true
      }
    }
    

    if(whole) {
      var tb = element.append(content, 'p.submit');
      element.append(tb, 'button#create.create', 'Create', null, {
        click: () => {
          form.create({
            action: 'create',
            type: 'task',
            fields: {
              description: {
                required: true
              },
              repeats: {
                type: 'interval',
                required: true,
                label: 'Repeats every'
              }
            }
          })
          .then(() => {
            task.update(select);
          });
        }
      });
    }

    fetch.request('GET', '/api/tasks', this.filter).then((response) => {
      //var list = document.getElementById('list');
      //list.innerHTML = '';
      var list = element.append(content, 'div#list');

      /*if(whole) {
        element.append(list, 'p', 'Today is ' + date.stringify(new Date()));
      }*/
  
      if(response.body && response.body.length > 0) {
        var ul = element.append(list, 'ul');
        /*if(this.filter) {
          ul.className = 'due';
        }*/
  
        response.body.forEach(function(item) {
          var li = element.append(ul, 'li');
          element.append(li, 'span', item.description);
          
          if(whole) {
            element.append(li, 'span.muted', prettyDate(item.next_due) || 'No data');

            element.append(li, 'button', 'Update', null, {
              click: () => {
                form.create({
                  action: 'update',
                  type: 'task',
                  id: item.id,
                  fields: {
                    description: {
                      value: item.description,
                      required: true
                    },
                    repeats: {
                      value: item.repeats,
                      type: 'interval',
                      required: true,
                      label: 'Repeats every'
                    },
                    completed: {
                      value: item.completed,
                      type: 'date',
                      label: 'Completed on'
                    }
                  }
                })
                .then(() => {
                  task.update(select);
                });
              }
            });
    
            element.append(li, 'button', 'Delete', null, {
              click: () => {
                form.create({
                  action: 'delete',
                  type: 'task',
                  id: item.id,
                  message: 'Delete "' + item.description + '" task?'
                })
                .then(() => {
                  task.update(select);
                });
              }
            });

          } else {
            element.append(li, 'button.complete', 'Complete', null, {
              click: () => {
                var method = 'PUT';
                var url = '/api/tasks/' + item.id;
                var payload = {
                  completed: date.stringify(new Date())
                }
                fetch.request(method, url, payload).then((response) => {
                  task.update(select);
                });
              }
            });
          }
        });
      } else {
        element.append(list, 'p', "You're all caught up. Good job.");
      }
    });
  }

};
