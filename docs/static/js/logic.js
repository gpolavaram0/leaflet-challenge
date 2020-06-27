var mymap = L.map('mapid').setView([0, 0], 1);

// ---------------------------------------------------------------------------------------

var legend = L.control({position: 'bottomright'});

function getColor(d) {
    return d > 5  ? '#E31A1C' :
           d > 4  ? '#FC4E2A' :
           d > 3   ? '#FD8D3C' :
           d > 2   ? '#FEB24C' :
           d > 1   ? '#FED976' :
                      '#FFEDA0';
}

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(mymap);

// --------------------------------------------------------------------------------------
function quakeColor(mag) {

      if (mag >= 0 & mag < 1) {
        return '#FFEDA0';
      } else if (mag >= 1 & mag < 2) {
        return '#FED976';
      } else if (mag >= 2 & mag < 3) {
        return '#FEB24C';
      } else if (mag >= 3 & mag < 4) {
        return '#FD8D3C';
      } else if (mag >= 4 & mag < 5) {
        return "#FC4E2A";
      } else {
        return "#E31A1C";
      }

}

const tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
});

tiles.addTo(mymap);

var circle = L.circle([51.508, -0.11], {
    color: quakeColor(2.5),
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(mymap);


var quake = $.getJSON('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson', function(data) {
    // JSON result in `data` variable
    console.log(data.features);

    (data.features).forEach(element => 
        


        L.circle(([element.geometry.coordinates[1],element.geometry.coordinates[0]]), {
                color:  quakeColor(element.properties.mag),
                fillColor: quakeColor(element.properties.mag),
                fillOpacity: 0.75,
                radius: (element.properties.mag * 5000)
            }).addTo(mymap).bindPopup("<dl><dt>Latitude: " + element.geometry.coordinates[0] + "</dt>"
            + "<dt>Longitude: " + element.geometry.coordinates[1] + "</dt>"
            + "<dt>Magnitude: " + element.properties.mag + "</dt>")
          );


});

