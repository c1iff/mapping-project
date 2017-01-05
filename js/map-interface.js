var apiKey = require('./../.env').apiKey;
var Map = require('./../js/map.js').mapModule;


var currentMap = new Map()
$(document).ready(function(){
  var styleJson = $.getJSON( "./js/map_styles.json", function(json) {
    currentMap.initMap(json);
  });
});
