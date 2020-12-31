// element.js

export default {

  append: function(parent, selector, content = null, options = null, actions = null) {
    var matches = selector.match(/(?:\.|#)?[^\.#\s]+/g);
    var type = matches[0];
    
    var e = document.createElement(type);
    
    for(var i = 1; i < matches.length; i++) {
      var start = matches[i].charAt(0);
      var name = matches[i].slice(1);
      
      // will only keep the last defined id and class
      if(start === '#') {
        e.id = name;
      }
      if(start === '.') {
        e.className = name;
      }
    }
    
    if(content) {
      if(type === 'input') {
        e.value = content;
      } else {
        e.innerHTML = content;
      }
    }
    
    if(options) {
      for (var key in options) {
        switch(key) {
          case 'id':
            e.id = options[key];
            break;
          default:
            e.setAttribute(key, options[key])
        }
      }
    }
    
    if(actions) {
      for (var key in actions) {
        e.addEventListener(key, actions[key]);
      }
    }
    
    parent.appendChild(e);
    return e;
  }
  
};
