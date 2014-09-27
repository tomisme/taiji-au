$(document).ready(function() {
  var map = L.map('map').setView([-31.95, 115.85], 12);

  L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'tomisme.jdpekjid'
  }).addTo(map);

  function onMarkerClick(e) {
    var loc = e.layer.feature.properties;

    var categories = [];
    if (loc.hasOwnProperty('quan-checked')) {
      categories.push('quan');
    }
    if (loc.hasOwnProperty('fitness-checked')) {
      categories.push('fitness');
    }
    if (loc.hasOwnProperty('health-checked')) {
      categories.push('health');
    }
    if (loc.hasOwnProperty('arts-checked')) {
      categories.push('health');
    }
    if (loc.hasOwnProperty('lifestyle-checked')) {
      categories.push('lifestyle');
    }
    if (loc.hasOwnProperty('education-checked')) {
      categories.push('education');
    }

    var html = '';
    html += "<ul class='list-group'>";
    html += "<li class='list-group-item active'>" + loc.name + "</li>";
    if (loc.phone) {
      html += "<li class='list-group-item'> Phone: " + loc.phone + "</li>";
    }
    if (loc.email) {
      html += "<li class='list-group-item'> Email: <a href='mailto:" + loc.email + "'>" + loc.email + "</a></li>";
    }
    if (loc.website) {
      html += "<li class='list-group-item'> Website: <a href='" + loc.website + "'>" + loc.website + "</a></li>"; 
    }
    if (loc.facebook) {
      html += "<li class='list-group-item'> Facebook: <a href='" + loc.facebook + "'>" + loc.facebook + "</a></li>"; 
    }
    if (loc.twitter) {
      html += "<li class='list-group-item'> Twitter: <a href='" + loc.twitter + "'>" + loc.twitter + "</a></li>"; 
    }
    html += "</div>";
    html += "</div>";
    $('#results').html(html);
  }

  $.get('api/locations', function(data) {
    var group = L.geoJson(data, {
      onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties.name, {
          autopan: true,
          closeButton: false,
        });
      }
    });
    
    group
//    .on('mouseover', function(e) { e.layer.openPopup(); } )
//    .on('mouseout', function(e) { e.layer.closePopup(); } )
      .on('click', onMarkerClick)
      .addTo(map);

  });

});
