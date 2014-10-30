var React = require('react');
var L = require('leaflet');
var request = require('superagent');

var TaijiIcon = L.Icon.extend({
  options: {
    iconSize: [35, 47],
    iconAnchor: [17, 47],
    popupAnchor: [0, -48]
  }
});

var blueIcon = new TaijiIcon({ iconUrl: 'img/blue-marker.png' });
var greenIcon = new TaijiIcon({ iconUrl: 'img/green-marker.png' });
var greyIcon = new TaijiIcon({ iconUrl: 'img/grey-marker.png' });
var redIcon = new TaijiIcon({ iconUrl: 'img/red-marker.png' });
var yellowIcon = new TaijiIcon({ iconUrl: 'img/yellow-marker.png' });
var whiteIcon = new TaijiIcon({ iconUrl: 'img/white-marker.png' });
var multiIcon = new TaijiIcon({ iconUrl: 'img/multi-marker.png' });

var MapInfo = require('./MapInfo.jsx');

var Map = React.createClass({

  getInitialState: function() {
    return {
      map: null
    };
  },

  updateGeoJson: function(data) {
    var markers = L.geoJson(data, {
      onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties.name, {
          autopan: true,
          closeButton: false,
        });
      },
      pointToLayer: function (feature, latlng) {
        var cat = feature.properties.categories;

        if (cat == 'fitness') { return L.marker(latlng, { icon: blueIcon }); }
        else if (cat == 'education') { return L.marker(latlng, { icon: redIcon }); }
        else if (cat == 'arts') { return L.marker(latlng, { icon: greenIcon }); }
        else if (cat == 'lifestyle') { return L.marker(latlng, { icon: greyIcon }); }
        else if (cat == 'quan') { return L.marker(latlng, { icon: whiteIcon }); }
        else if (cat == 'health') { return L.marker(latlng, { icon: yellowIcon }); }
        else { return L.marker(latlng, { icon: multiIcon }); }
      }
    }).addTo(this.state.map);
  },

  sayHello: function() {
    console.log('hello');
  },

  componentDidMount: function() {
    var component = this;
    var map = L.map(this.getDOMNode()).setView([-31.95, 115.85], 10);

    L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Map data &copy;...',
      id: 'tomisme.jdpekjid'
    }).addTo(map);

    component.setState({ map: map });

    request
      .get('/api/locations/geojson')
      .end(function(res) {
        component.updateGeoJson(res.body);
      });
  },

  render: function() {
    return (
      <div className='map'>
        <MapInfo />
      </div>
    );
  }
});

module.exports = Map;
