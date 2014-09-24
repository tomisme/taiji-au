'use strict';

var express    = require('express');
var bodyParser = require('body-parser');
var cradle     = require('cradle');
var bunyan     = require('bunyan');

var log = bunyan.createLogger({ name: 'taiji' });

var couchURL = process.env.COUCH_URL || '127.0.0.1:5984';
var db = new(cradle.Connection)(couchURL).database('locations');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var router = express.Router();

router.post('/locations', urlencodedParser, function(req, res) {
  if (!req.body) {
    res.sendStatus(400);
  } else {
    log.info({ source: 'POST body' }, req.body);

    db.save(req.body, function(dbError, dbRes) {
      if (dbError) { 
        log.error({ source: 'database' }, dbError);
        res.send(dbError);
      } else {
        log.info({ source: 'database' }, dbRes);
        res.send(dbRes);
      }
    });
  }
});

router.get('/locations', function(req, res) {
  db.view('locations/all', function(dbError, dbRes) {
    if (dbError) {
      log.error('database error', dbError);
      res.send(dbError);
    } else {
      log.info('database response', dbRes);
      res.send(dbRes);
    }
  });
});

module.exports = router;
