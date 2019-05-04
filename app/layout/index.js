'use strict';

var homeTemplate = require('./template.jade');

function home() {
  var appContainer = document.querySelector('.app-container');
  appContainer.innerHTML = homeTemplate();
}

console.log(homeTemplate);

module.exports = home();
