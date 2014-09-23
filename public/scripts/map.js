L.mapbox.accessToken = 'pk.eyJ1IjoidG9taXNtZSIsImEiOiIxT1BKRnhnIn0.YXYvDFkvu7ihmgKIVbExoQ';

var json = [
  {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "title": "Ping Ming Health",
          "marker-size": "large",
          "marker-symbol": "hospital"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            115.861083,
            -31.954612
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "title": "Australia Hunyuan Taiji Qigong Academy",
          "marker-size": "large",
          "marker-symbol": "pitch"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            115.937115,
            -31.884536
          ]
        }
      }
    ]
  }
];

var map = L.mapbox.map('map', 'tomisme.jdpekjid')
  .featureLayer.setGeoJSON(json);
