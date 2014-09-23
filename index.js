'use strict';

var express    = require('express');
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var cradle     = require('cradle');
var bunyan     = require('bunyan');

var config = {
  couchURL : process.env.COUCH_URL || '127.0.0.1:5984',
  port: process.env.PORT || 3000   
};

var db = new(cradle.Connection)(config.couchURL).database('locations');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var log = bunyan.createLogger({ name: 'taiji' });

var app = express();

app.set('views', './views');
app.set('view engine', 'jade');

app.use(morgan('common'));
app.use(express.static(__dirname + '/public'));
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send(err.stack);
});

app.post('/api/locations', urlencodedParser, function(req, res) {
  if (!req.body) {
    res.sendStatus(400);
  } else {
    log.info(req.body);

    db.save(req.body, function(dbError, dbRes) {
      if (dbError) { 
        log.error(dbError);
        res.send(dbError);
      } else {
        log.info(dbRes);
        res.send(dbRes);
      }
    });
  }
});

app.get('/api/locations', function(req, res) {
  // get all locations from db view
  // send response with json object
});

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/map', function(req, res) {
  res.render('map');
});

app.get('/list', function(req, res) {
  db.temporaryView({
    map: function(doc) {
      if (doc.name) {
        emit(doc.name, doc);
      }
    }
  }, function(err, data) {
    if (err) {
      log.error(err);
    } else {
      res.render('list', {
        locations: data 
      });
    }
  });
});

app.get('/new', function(req, res) {
  res.render('new');
});

app.listen(config.port, function() {
  log.info('Server running on port', config.port);
});
