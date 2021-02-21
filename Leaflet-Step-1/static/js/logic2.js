//create variable for data file
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var quakeLayer = new L.LayerGroup()

//function for determining color of markers based on earthquake depth
//mimicked from leaflet documentation
function getColor(d)
{
     return d > 90 ? "#d73027" :
            d > 70 ? "#fc8d59" :
            d > 50 ? "#fee08b" :
            d > 30 ? "#d9ef8b" :
            d > 10 ? "#91cf60" :
                     "#1a9850" ;
};

//function to retrieve features from earthquakes.json
function quakeMap(earthquakeData) {
    function onEachFeature(feature, layer){    
        //create marker for each earthquake
        var marker = L.circleMarker([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],
            {
                color: getColor(feature.geometry.coordinates[2]),
                //color: colorist(feature.geometry.coordinates[2]),
                radius: (feature.properties.mag * 3),
                fill: true,
                fillOpacity: 1

            }).addTo(quakeLayer);
        //create popups
        marker.bindPopup
        (
            "<p> Magnitude: " + (feature.properties.mag) + "</p> \n" +
            "<p> Location: " + (feature.properties.place) + "</p> \n" +
            "<p> Time: " + (moment(feature.properties.time).format("HH:mm:ss")) + "</p> \n"
        ).addTo(quakeLayer);
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
