function Map() {
}
var map;
Map.prototype.initMap = function (json) {
  var styledMapType = new google.maps.StyledMapType(
    json, {name: 'Styled Map'});

    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 45.5, lng: -122.3},
      zoom: 8,
      mapTypeControlOptions: {
        mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
        'styled_map']
      }
    });

    // loadKmlLayer(src, map);
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');

    $('#create-marker').click(function(){
      var latitude = parseFloat($('#latitude').val());
      var longitude = parseFloat($('#longitude').val());
      var marker = new google.maps.Marker({
        position: {lat: latitude, lng: longitude},
        draggable: true,
        animation: google.maps.Animation.DROP,
        map: map
      });
    });

    var script = document.createElement('script');
    // This example uses a local copy of the GeoJSON stored at
    // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
    script.src = 'https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js';
    document.getElementsByTagName('head')[0].appendChild(script);
};
// Loop through the results array and place a marker for each
// set of coordinates.
window.eqfeed_callback = function(results) {
  for (var i = 0; i < results.features.length; i++) {
    var coords = results.features[i].geometry.coordinates;
    var latLng = new google.maps.LatLng(coords[1],coords[0]);
    var marker = new google.maps.Marker({
      position: latLng,
      map: map
    });
  }
}

exports.mapModule = Map;
