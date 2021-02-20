//create variable for data file
var queryUrl = "earthquakes.json";

//create layers variable
var earthquakes = new L.LayerGroup()

//create streetmap and darkmap layers
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
tileSize: 512,
maxZoom: 18,
zoomOffset: -1,
id: "mapbox/streets-v11",
accessToken: API_KEY
});

// Define darkmap layer
var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 18,
id: "dark-v10",
accessToken: API_KEY
});

// Define a baseMaps object to hold our base layers
var baseMaps = {
"Street Map": streetmap,
"Dark Map": darkmap
};

//create earthquake overlay object
var overlayMaps = {
    "Earthquakes": earthquakes
}
//create map variable
var myMap = L.map("mapid", {
    center: [
    37.09, -95.71
    ],
    zoom: 4,
    layers: [streetmap, earthquakes]
    });

// Create a layer control with baseMaps and overlayMaps, add to map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(myMap);

//function to retrieve features from earthquakes.json
function quakeMap(queryUrl) {
    function eachQuake(feature, layer){    
        //create marker for each earthquake
        var marker = L.marker([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],
            {
                color: 'yellow',
                icon: 'circle'
            })
        //create popups
        marker.bindPopup("<p>" + feature.properties.mag + "</p>")
    };
    L.geoJson(queryUrl, {
        eachQuake: eachQuake            
    }).addTo(earthquakes)
};