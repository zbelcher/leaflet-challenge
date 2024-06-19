// Create a map object
var myMap = L.map("map").setView([37.09, -95.71], 5);

// Add a tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// URL to get the earthquake data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch the data
fetch(url)
    .then(response => response.json())
    .then(data => {
        // Function to determine marker size
        function markerSize(magnitude) {
            return magnitude * 4;
        }

        // Function to determine marker color based on depth
        function markerColor(depth) {
            if (depth > 90) return "#FF0000";
            else if (depth > 70) return "#FF4500";
            else if (depth > 50) return "#FF8C00";
            else if (depth > 30) return "#FFA500";
            else if (depth > 10) return "#FFD700";
            else return "#9ACD32";
        }

        // Create a GeoJSON layer containing the features array
        L.geoJSON(data, {
            // Use pointToLayer to create circle markers
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: markerSize(feature.properties.mag),
                    fillColor: markerColor(feature.geometry.coordinates[2]),
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            // Use onEachFeature to bind a popup
            onEachFeature: function (feature, layer) {
                layer.bindPopup("<h3>" + feature.properties.place + 
                                "</h3><hr><p>Magnitude: " + feature.properties.mag + 
                                "<br>Depth: " + feature.geometry.coordinates[2] + "</p>");
            }
        }).addTo(myMap);

        // Add legend to the map
        var legend = L.control({position: 'bottomright'});

        legend.onAdd = function () {
            var div = L.DomUtil.create('div', 'info legend');
            var depths = [-10, 10, 30, 50, 70, 90];
            var colors = ["#9ACD32", "#FFD700", "#FFA500", "#FF8C00", "#FF4500", "#FF0000"];

            for (var i = 0; i < depths.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + colors[i] + '"></i> ' +
                    depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
            }

            return div;
        };

        legend.addTo(myMap);
    })
    .catch(error => console.log(error));
