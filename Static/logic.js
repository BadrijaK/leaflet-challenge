// Store our API endpoint as queryUrl.
var queryUrl =  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
 
  console.log(data);
  createFeatures(data.features);
});
function getColor(depth) {
    switch (true) {
        case depth > 90:
            return "#ea2c2c";
        case depth > 70:
            return "#ea822c";
        case depth > 50:
            return "#ee9c00";
        case depth > 30:
            return "#eecc00";
        case depth > 10:
            return "#d4ee00";
        default:
            return "#98ee00";
    }
}
function createFeatures(earthquake) {


  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p><b>Magnitude:</b> ${feature.properties.mag}</p>`);
  }
  function pointToLayer(feature, latlng) {
    var geojsonMarkerOptions = {
        radius: feature.properties.mag*4,
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "grey",
        weight: 0.5,
        opacity: 1,
        fillOpacity: 0.75
    }
    return L.circleMarker(latlng, geojsonMarkerOptions)
}

  var earthquakes = L.geoJSON(earthquake, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer,
  });


  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      39, -98.5795
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  
  var legend = L.control({ position: 'bottomright' });

      legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
          colours = [-10, 10, 30, 50, 70, 90];
          colour=[
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            '#ee9c00',
            "#ea822c",
            "#ea2c2c"
          ];


      // loop through our depth intervals 
      for (var i = 0; i < colours.length; i++) {
          div.innerHTML +=
              '<i style="background: ' + colors[i] +'"></i> ' +
              +colours[i] + (colours[i + 1] ? '&ndash;' + colours[i + 1] + '<br>' : '+');
      }
      return div;
  };

  legend.addTo(myMap);

}
