// main.js

import fetch from './fetch.js';
import form from './form.js';
import task from './task.js';

window.task = task;

// single page is better to not do this everytime you click back
var weather = {
  value: 'Updating...',
  update: function() {
    fetch.request('GET', '/api/weather/forecast').then((response) => {
      this.value = response.body.name + ': ' + response.body.description;
      document.getElementById('weather').innerHTML = this.value;
    });
  }
}

/*
  document.getElementById('create').addEventListener('click', function() {
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
      task.update();
    });
  });

  document.getElementById('read').addEventListener('click', function() {
    task.filter = {
      filter: true
    }
    task.update()
  });

  document.getElementById('all').addEventListener('click', function() {
    task.filter = null;
    task.update()
  });

  task.update();
*/


function getHash() {
  var hash = location.hash.replace('#', '');

  if (hash && window[hash]) {
    // hash
    window[hash].update();
  } else {
    // dashboard
    var template = `<div id="dashboard">
      <div class="card">
        <h2>Weather</h2>
        <p id="weather">${weather.value}</p>
      </div>
      <div class="card" id="task_card">
        <h2>Tasks <a href="/tasks.html">-&gt;</a></h2>
        <p>Tasks card</p>
        <div id="list"></div>
      </div>
    </div>`
    document.getElementById('content').innerHTML = template;

    weather.update();
    task.update('task_card');
  }
}

window.addEventListener('load', function() {
  getHash();
});

window.addEventListener('hashchange', function() {
  getHash();
});
