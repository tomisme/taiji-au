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

// Locations

router.post('/locations', urlencodedParser, function(req, res) {
  if (!req.body) {
    res.sendStatus(400);
    return;
  }

  var data = req.body;
  var loc = {};

  log.info({ source: 'POST body' }, data);

  loc.hasAddress = (data.hasAddress == 'true');

  if (loc.hasAddress) {
    if (data.latitude) loc.latitude = data.latitude;
    if (data.longitude) loc.longitude = data.longitude;
    if (data.stateCode) loc.stateCode = data.stateCode;
    if (data.streetName) loc.streetName = data.streetName;
    if (data.streetNumber) loc.streetNumber = data.streetNumber;
    if (data.countryCode) loc.countryCode = data.countryCode;
  } else {
    if (data.street) loc.street = data.street;
  }

  if (data.country) loc.country = data.country;
  if (data.city) loc.city = data.city;
  if (data.state) loc.state = data.state;
  if (data.zipcode) loc.zipcode = data.zipcode;
  if (data.name) loc.name = data.name;
  if (data['categories[]']) loc.categories = data['categories[]'];
  if (data.phone) loc.phone = data.phone;
  if (data.mobile) loc.mobile = data.mobile;
  if (data.email) loc.email = data.email;
  if (data.website) loc.website = data.website;
  if (data.facebook) loc.facebook = data.facebook;
  if (data.twitter) loc.twitter = data.twitter;
  if (data.youtube) loc.youtube = data.youtube;
  if (data.notes) loc.notes = data.notes;

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
});

router.post('/locations/update', urlencodedParser, function(req, res) {
  log.info({ source: 'POST request body' }, req.body);
  var id = req.body.pk;
  var value = req.body.value || req.body['value[]'];
  var target = req.body.name;

  var updateObj = {};
  updateObj[target] = value;

  console.log(updateObj);

  db.get(id, function(getErr, doc) {
    if (getErr) {
      res.status(400).send({ error: 'database' });
      log.error('database error', getErr);
    } else {
      db.merge(id, updateObj, function(updateErr, dbRes) {
        if (updateErr) {
          res.status(400).send({ error: 'database' });
          log.error('database error', delErr);
        } else {
          res.status(200).end();
        }
      });
    }
  });
});

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

router.get('/locations/geojson', function(req, res) {
  db.view('locations/hasAddress', function(dbErr, dbRes) {
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

// Geoloc

router.post('/geoloc', urlencodedParser, function(req, res) {
  if (!req.body) {
    res.sendStatus(400);
    return;
  }

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
});

module.exports = router;
