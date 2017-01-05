
function Map() {
}

var map;
var infoWindow;
var service;
var heatmap;

Map.prototype.initMap = function (json) {
  var styledMapType = new google.maps.StyledMapType(
    json, {name: 'Styled Map'});

    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 51.518732, lng: 0.128382},
      zoom: 5,
      mapTypeControlOptions: {
        mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
        'styled_map']
      }
    });

    var types = document.getElementById('type-selector');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

    //*************Code for autocomplete search bar***********
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
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
    //   //************************************

      map.mapTypes.set('styled_map', styledMapType);
      map.setMapTypeId('styled_map');

    //*************geojson*************
    $('#changetype-heat').click(function() {
      // heatmap.setMap(heatmap.getMap() ? null : map);
      var results = require('./../007-locations.json')
      //eqfeed_callback(json)
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
    })
    $('#changetype-marker').click(function() {
      map.data.loadGeoJson('007-locations.json')
    })


  //*************geojson*************




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

    // function eqfeed_callback(results) {
    // }
};


exports.mapModule = Map;
