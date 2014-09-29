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
  db.view('locations/all', function(dbErr, dbRes) {
    if (dbErr) {
      res.send({ error: 'database' });
      log.error('database error', dbErr);
    } else {
      var data = []
      for (var i = 0; i < dbRes.length; i++) {
        data.push(dbRes[i].value);
      }
      res.send(data);
      log.info('database response', dbRes);
    }
  });
});

router.post('/locations/update', urlencodedParser, function(req, res) {
  console.dir(req.body);
  var id = req.body.pk;
  var value = req.body.value;
  var target = req.body.name;

  var updateObj = {};
  updateObj[target] = value;

  console.log(updateObj);

  db.get(id, function(getErr, doc) {
    if (getErr) {
      res.send(400).send({ error: 'database' });
      log.error('database error', getErr);
    } else {
      db.merge(id, updateObj, function(updateErr, dbRes) {
        if (updateErr) {
          res.send(400).send({ error: 'database' });
          log.error('database error', delErr);
        } else {
          res.send(200);
          console.log('hello!');
        }
      });
    }
  });
});

router.delete('/locations/:id', function(req, res) {
  var id = req.params.id;
  db.get(id, function(getErr, doc) {
    if (getErr) {
      res.send({ error: 'database' });
      log.error('database error', getErr);
    } else {
      db.remove(id, doc._rev, function(delErr, dbRes) {
        if (delErr) {
          res.send({ error: 'database' });
          log.error('database error', delErr);
        } else {
          res.send({ success: true });
        }
      });
    }
  });
});

router.get('/locations/geojson', function(req, res) {
  db.view('locations/all', function(dbErr, dbRes) {
    if (dbErr) {
      log.error('database error', dbErr);
      res.send({ error: 'database' });
    } else {
      log.info('database response', dbRes);

      var data = []
      for (var i = 0; i < dbRes.length; i++) {
        data.push(dbRes[i].value);
      }

      geoJSON.parse(data, { Point: ['latitude', 'longitude'] }, function(geojson) {
        res.send(geojson);
        log.info({ source: 'geojson' }, geojson);
        geojson.features.forEach(function(element) {
          log.info({ source: 'geojson' }, element.properties);
        });
      });
    }
  });
});

router.post('/locations', urlencodedParser, function(req, res) {
  if (!req.body) {
    res.sendStatus(400);
  } else {
    var data = req.body;

    log.debug({ source: 'POST body' }, data);

    var loc = {
      latitude: data.latitude,
      longitude: data.longitude,
      country: data.country,
      city: data.city,
      state: data.state,
      stateCode: data.stateCode,
      zipcode: data.zipcode,
      streetName: data.streetName,
      streetNumber: data.streetNumber,
      countryCode: data.countryCode,
      name: data.name,
      categories: data['categories[]'],
      phone: data.phone,
      mobile: data.mobile,
      email: data.email,
      website: data.website,
      facebook: data.facebook,
      twitter: data.twitter 
    };

    log.info({ source: 'new location data' }, loc);

    db.save(loc, function(dbErr, dbRes) {
      if (dbErr) { 
        log.error({ source: 'database' }, dbErr);
        res.send({ error: 'database' });
      } else {
        log.info({ source: 'database response' }, dbRes);
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
