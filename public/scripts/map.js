L.mapbox.accessToken = 'pk.eyJ1IjoidG9taXNtZSIsImEiOiIxT1BKRnhnIn0.YXYvDFkvu7ihmgKIVbExoQ';

var map = L.mapbox.map('map', 'tomisme.jdpekjid');

$.get('api/locations', function(data) {
  console.dir(data);
  map.featureLayer.setGeoJSON(data);
});
