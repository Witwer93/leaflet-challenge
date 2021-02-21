//create variable for data file
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


var quakeLayer = new L.LayerGroup()

function colorist(depth){
    if (depth >= -10 && depth < 10) {
        return "chartreuse"
    }else if(depth >= 10 && depth < 30){
        return "khaki"
    }else if(depth >= 30 && depth < 50){
        return "lightsalmon"
    }else if (depth >= 50 && depth < 70){
        return "coral"
    }else if (depth >= 70 && depth < 90){
        return "tomato"
    }else if (depth >= 90){
        return "crimson"
    }else{
        return "Blue"
    };
};

//function to retrieve features from earthquakes.json
function quakeMap(earthquakeData) {
    function onEachFeature(feature, layer){    
        //create marker for each earthquake
        var marker = L.circleMarker([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],
            {
                color: colorist(feature.geometry.depth),
                radius: (feature.properties.mag * 5),
                fill: true,
                fillOpacity: 1

            }).addTo(quakeLayer);
        //create popups
        marker.bindPopup("<p>" + (feature.properties.mag) + "</p>").addTo(quakeLayer);
        //layer.bindPopup("<h3>" + feature.properties.mag + "</p>")
    }
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature            
    })

    createMap(earthquakes)
};

d3.json(queryUrl, function(data) {
    quakeMap(data.features);
    //console.log(data.features)
});

function createMap(earthquakes){
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
        "Earthquakes": quakeLayer
    };
    
    //create map variable
    var myMap = L.map("mapid", {
        center: [
        37.09, -95.71
        ],
        zoom: 4,
        layers: [streetmap, quakeLayer]
        });
    
        
    // Create a layer control with baseMaps and overlayMaps, add to map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
        }).addTo(myMap);
}
