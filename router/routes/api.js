'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var cradle = require('cradle');
var bunyan = require('bunyan');
var geocoder = require('node-geocoder');
var geoJSON = require('geojson')

var log = bunyan.createLogger({ name: 'taiji' });

var couchURL = process.env.COUCH_URL || '127.0.0.1:5984';
var db = new(cradle.Connection)(couchURL).database('locations');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var router = express.Router();

router.get('/locations', function(req, res) {
  db.view('locations/all', function(dbError, dbRes) {
    if (dbError) {
      log.error('database error', dbError);
      res.send({ error: 'database' });
    } else {
      log.info('database response', dbRes);

      var data = []
      for (var i = 0; i < dbRes.length; i++) {
        data.push(dbRes[i].value);
      }

      geoJSON.parse(data, { Point: ['latitude', 'longitude'] }, function(geojson) {
        log.info({ source: 'geojson' }, geojson);
        res.send(geojson);
      });
    }
  });
});

router.post('/locations', urlencodedParser, function(req, res) {
  if (!req.body) {
    res.sendStatus(400);
  } else {
    var data = req.body;

    log.info({ source: 'POST body' }, data);
    
    db.save(data, function(dbError, dbRes) {
      if (dbError) { 
        log.error({ source: 'database' }, dbError);
        res.send({ error: 'database' });
      } else {
        log.info({ source: 'database' }, dbRes);
        res.send({ success: true });
      }
    });
  }
});


router.post('/geoloc', urlencodedParser, function(req, res) {
  if (!req.body) {
    res.sendStatus(400);
  } else {
    var data = req.body;

    log.info({ source: 'POST body' }, data);

    var addr = [data.street, data.city, data.state, data.postcode, data.country].join(', ');

    var geoConfig = {
      apiKey: process.env.GOOGLE_GEO_API_KEY,
      formatter: null
    };

    var geocoder = require('node-geocoder').getGeocoder('google', 'https', geoConfig);

    geocoder.geocode(addr, function(geoErr, geoRes) {
      if (geoErr) { 
        log.error(geoErr)
        res.send({ error: 'geocoder' });
      } else { 
        log.info({ source: 'geocoder' }, geoRes);
        res.send(geoRes);
      }
    });
  }
});

module.exports = router;
