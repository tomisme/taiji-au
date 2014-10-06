$(document).ready(function() {
  var map = L.map('map').setView([-31.95, 115.85], 10);

  L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'tomisme.jdpekjid'
  }).addTo(map);

  function onMarkerClick(e) {
    var loc = e.layer.feature.properties;

    var html = '';
    html += "<ul class='list-group'>";
    html += "<li class='list-group-item'><i class='fa fa-map-marker fa-fw'></i>&nbsp;&nbsp;<a href='#' id='edit-name'>" + loc.name + "</a></li>";
    html += "<li class='list-group-item'><i class='fa fa-phone fa-fw'></i>&nbsp;&nbsp;<a href='#' id='edit-phone'>" + loc.phone + "</a></li>";
    html += "<li class='list-group-item'><i class='fa fa-mobile fa-fw'></i>&nbsp;&nbsp;<a href='#' id='edit-mobile'>" + loc.mobile + "</a></li>";
    html += "<li class='list-group-item'><i class='fa fa-envelope fa-fw'></i>&nbsp;&nbsp;<a href='mailto:" + loc.email + "' id='edit-email'>" + loc.email + "</a></li>";
    html += "<li class='list-group-item'><i class='fa fa-globe fa-fw'></i>&nbsp;&nbsp;<a href='" + loc.website + "' id='edit-website'>" + loc.website + "</a></li>"; 
    html += "<li class='list-group-item'><i class='fa fa-facebook fa-fw'></i>&nbsp;&nbsp;<a href='" + loc.facebook + "' id='edit-facebook'>" + loc.facebook + "</a></li>"; 
    html += "<li class='list-group-item'><i class='fa fa-twitter fa-fw'></i>&nbsp;&nbsp;<a href='" + loc.twitter + "' id='edit-twitter'>" + loc.twitter + "</a></li>"; 
    html += "<li class='list-group-item'>"; 
    html += "<h4 class='list-group-item-heading'>Address</h4>";
    html += "<p class='list-group-item-text'>" + loc.streetNumber + " " + loc.streetName + "</p>";
    html += "<p class='list-group-item-text'>" + loc.city + "</p>";
    html += "<p class='list-group-item-text'>" + loc.stateCode + ", " + loc.zipcode +  "</p>";
    html += "</li>";
    html += "<li class='list-group-item'>"; 
    html += "<h4 class='list-group-item-heading'>Categories</h4>";
    html += "<p class='list-group-item-text'><a href='#' id='edit-categories'></a></p>";
    html += "</li>";
    html += "<li class='list-group-item'>"; 
    html += "<div class='btn-group'>";
    html += "<button type='button' class='btn btn-danger delete-loc' data-loc-id='" + loc._id + "'>Delete</button>";
    html += "</div>";
    html += "</li>";
    html += "</ul>";
    $('#results').html(html);

    $('#edit-categories').editable({
      name: 'categories',
      type: 'checklist',
      pk: loc._id,
      url: '/api/locations/update',
      title: 'Select Categories:',
      value: loc.categories,
      source: [
        { value: 'quan', text: 'Taiji Quan (traditional Taiji)' },
        { value: 'fitness', text: 'Fitness and Excercise (contemporary Taiji)' },
        { value: 'health', text: 'Health, Traditional Chinese Medicine' },
        { value: 'arts', text: 'Arts, Calligraphy, Chinese Culture' },
        { value: 'lifestyle', text: 'Lifestyle, Clothing' },
        { value: 'education', text: 'Wisdom, Philosophy, Education' }
      ]
    });
            
    $('#edit-name').editable({
      name: 'name',
      type: 'text',
      pk: loc._id,
      url: '/api/locations/update',
      title: 'Enter Name:'
    });

    $('#edit-phone').editable({
      name: 'phone',
      type: 'text',
      pk: loc._id,
      url: '/api/locations/update',
      title: 'Enter Phone:'
    });

    $('#edit-mobile').editable({
      name: 'mobile',
      type: 'text',
      pk: loc._id,
      url: '/api/locations/update',
      title: 'Enter Mobile:'
    });

    $('#edit-email').editable({
      name: 'email',
      type: 'text',
      pk: loc._id,
      url: '/api/locations/update',
      title: 'Enter Email:'
    });

    $('#edit-website').editable({
      name: 'website',
      type: 'text',
      pk: loc._id,
      url: '/api/locations/update',
      title: 'Enter Website:'
    });

    $('#edit-facebook').editable({
      name: 'facebook',
      type: 'text',
      pk: loc._id,
      url: '/api/locations/update',
      title: 'Enter Facebook:'
    });

    $('#edit-twitter').editable({
      name: 'twitter',
      type: 'text',
      pk: loc._id,
      url: '/api/locations/update',
      title: 'Enter Twitter:'
    });

    $('.delete-loc').click(function(e) {
      var deleteButton = $(this);
      var confirmation = confirm("Are you sure you want to delete this location?");
      if (confirmation) {
        deleteButton.toggleClass('disabled').html('Deleting...');

        var id = deleteButton.attr('data-loc-id');

        $.ajax({
          url: '/api/locations/' + id,
          type: 'DELETE'
        })
        .done(function(data) {
          if (data.error || !data.success) {
            alert('There was an error with your request');
            console.log(data);
          } else {
            window.location.replace('/map');
          }
        })
        .fail(function(jqXHR, textStatus, err) {
          console.log(jqXHR, textStatus, err);
          alert('Could not contact server, please try again later');
        })
        .always(function() {
          deleteButton.toggleClass('disabled').html('Delete');
        });
      }
    });
  }

  var TaijiIcon = L.Icon.extend({
    options: {
      iconSize: [35, 47],
      iconAnchor: [17, 47],
      popupAnchor: [0, -48]
    }
  });
  
  var blueIcon = new TaijiIcon({ iconUrl: '/images/blue-marker.png' });
  var greenIcon = new TaijiIcon({ iconUrl: '/images/green-marker.png' });
  var greyIcon = new TaijiIcon({ iconUrl: '/images/grey-marker.png' });
  var redIcon = new TaijiIcon({ iconUrl: '/images/red-marker.png' });
  var yellowIcon = new TaijiIcon({ iconUrl: '/images/yellow-marker.png' });
  var whiteIcon = new TaijiIcon({ iconUrl: '/images/white-marker.png' });
  var multiIcon = new TaijiIcon({ iconUrl: '/images/multi-marker.png' });

  $.get('/api/locations/geojson', function(data) {
    var group = L.geoJson(data, {

      onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties.name, {
          autopan: true,
          closeButton: false,
        });
      },

      pointToLayer: function (feature, latlng) {
        if (feature.properties.categories == 'fitness') {
          return L.marker(latlng, { icon: blueIcon });
        } else if (feature.properties.categories == 'education') {
          return L.marker(latlng, { icon: redIcon });
        } else if (feature.properties.categories == 'arts') {
          return L.marker(latlng, { icon: greenIcon });
        } else if (feature.properties.categories == 'lifestyle') {
          return L.marker(latlng, { icon: greyIcon });
        } else if (feature.properties.categories == 'quan') {
          return L.marker(latlng, { icon: whiteIcon });
        } else if (feature.properties.categories == 'health') {
          return L.marker(latlng, { icon: yellowIcon });
        } else {
          return L.marker(latlng, { icon: multiIcon });
        }
      }

    });
    
    group
      .on('click', onMarkerClick)
      .addTo(map);

  });

/*
  $.get('/api/locations/geojson', function(data) {

    var locationLayer = L.geoJson(data, {

      pointToLayer: function (feature, latlng) {
        if (feature.properties.categories == 'quan') {
          return L.marker(latlng, { icon: quanIcon });
        }
      }

    });

    // layer.bindPopup(e.properties.title);

    // geojson.on('click', onMarkerClick);

    map.addLayer(locationLayer);
  });
*/
});

