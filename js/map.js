var results = require('./../007-locations.json')

function Map() {
}

var input;
var map;
var infoWindow;
var service;
var heatmap;
var markers = [];

Map.prototype.initMap = function (json) {
  var instance = this;
  var styledMapType = new google.maps.StyledMapType(
    json, {name: 'Dark'});

    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 51.518732, lng: 0.128382},
      zoom: 5,
      mapTypeControlOptions: {
        mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
        'styled_map']
      }
    });
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');

    var types = document.getElementById('type-selector');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

    instance.searchBar();

    $('#changetype-heat').click(function() {
      instance.clearLayers();
      instance.createHeatMap()
    });

    $('#changetype-marker').click(function() {
      instance.clearLayers();
      instance.createJson();
    });

    $('#changetype-all').click(function() {
      instance.clearLayers();
      instance.showAll()
    });

    $('#clear').click(function() {
      instance.clearLayers();
    });

    $('#create-marker').click(function(){
      instance.addMarker();
    });

};


Map.prototype.clearLayers = function () {

  for (var i = 0; i < markers.length; i++) {
    map.data.remove(markers[i]);
  }
  if (heatmap) {
    heatmap.setMap(null);
  }
};

Map.prototype.createHeatMap = function(){
  var instance = this;
  // instance.clearLayers();
  var heatmapData = [];
  for (var i = 0; i < results.features.length; i++) {
    var coords = results.features[i].geometry.coordinates;
    var latLng = new google.maps.LatLng(coords[1], coords[0]);
    heatmapData.push(latLng);
  }
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapData,
    dissipating: false,
    map: map
  });
}

Map.prototype.createJson = function () {
  var instance = this;
  // instance.clearLayers();
  markers = map.data.addGeoJson(results);
};

Map.prototype.showAll = function() {
  var instance = this;
  // instance.clearLayers();
  var heatmapData = [];
  for (var i = 0; i < results.features.length; i++) {
    var coords = results.features[i].geometry.coordinates;
    var latLng = new google.maps.LatLng(coords[1], coords[0]);
    heatmapData.push(latLng);
  }
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapData,
    dissipating: false,
    map: map
  });

  markers = map.data.addGeoJson(results);
}

Map.prototype.addMarker = function(){

  var latitude = parseFloat($('#latitude').val());
  var longitude = parseFloat($('#longitude').val());

  map.setCenter({lat: latitude, lng: longitude})
  var marker = new google.maps.Marker({
    position: {lat: latitude, lng: longitude},
    draggable: true,
    animation: google.maps.Animation.DROP,
    map: map
  });
}

Map.prototype.searchBar = function(){

  input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length === 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}


exports.mapModule = Map;
