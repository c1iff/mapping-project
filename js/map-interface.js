var apiKey = require('./../.env').apiKey;
var src = 'https://developer.trimet.org/gis/data/tm_rail_stops.kml';

function initMap(json){

  var styledMapType = new google.maps.StyledMapType(
    json, {name: 'Styled Map'});

  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.5, lng: -122.3},
    zoom: 8,
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
      'styled_map']
    }
  });

  loadKmlLayer(src, map);
  map.mapTypes.set('styled_map', styledMapType);
  map.setMapTypeId('styled_map');

  var marker = new google.maps.Marker({
    position: {lat: 45.5, lng: -122.3},
    map: map
  });

}

function loadKmlLayer(src, map) {
        var kmlLayer = new google.maps.KmlLayer(src, {
          suppressInfoWindows: true,
          preserveViewport: false,
          map: map
        });
        console.log(src);
        google.maps.event.addListener(kmlLayer, 'click', function(event) {
          var content = event.featureData.infoWindowHtml;
          var testimonial = document.getElementById('capture');
          testimonial.innerHTML = content;
        });
      }

$(document).ready(function(){
  var styleJson = $.getJSON( "./js/map_styles.json", function(json) {
    initMap(json);
  });
});
