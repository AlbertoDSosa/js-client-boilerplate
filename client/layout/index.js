'use strict';

var $ = require('jquery');
var homeTemplate = require('./template.jade');

module.exports = home();

function home() {
  $('.app-container').html(homeTemplate());
}
