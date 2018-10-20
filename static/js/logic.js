// Store the API endpoint inside a queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"

// Perform a GET request of the queryUrl
d3.json(queryUrl, function(data) {
  // Upon response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // This function loops through each feature in the features array
  // The popup shows earthquake info, such as place, magnitude, and date/time
  // The GeoJSON layer contains the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJson(earthquakeData, {
    onEachFeature(feature, layer){
      layer.bindPopup("<h3>" + feature.properties.place + " | " + feature.properties.mag + " magnitude" + 
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    },

    pointToLayer: function (feature, latLng) {
      return new L.circle(latLng,
        {radius: getRadius(feature.properties.mag),
          fillcolor: circleColor(feature.properties.mag),
          fillOpacity: .7,
          stroke: true,
          weight: .5, 
      })
    }
  });

function circleColor(magnitude) {
  if (magnitude >= 6.0) {
    return "red";
  }
  else if (magnitude > 5.0) {
    return "orange";
  }
  else if (magnitude > 4.0) {
    return "yellow";
  }
  else if (magnitude > 3.0) {
    return "green";
  }
  else if (magnitude > 2.0) {
    return "blue";
  }
  else {
    return "purple";
  }
};

function getRadius(magnitude){
  return magnitude*15000
}

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes)
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var pencilmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 19,
    id: "mapbox.pencil",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 19,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Basic Map": pencilmap,
    "Dark Bckgrnd.": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      23.6345, -102.5528
    ],
    zoom: 5.25,
    layers: [pencilmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
