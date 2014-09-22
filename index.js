'use strict';

var express    = require('express');
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var cradle     = require('cradle');

var db = new(cradle.Connection)(process.env.COUCH_URL || '127.0.0.1:5984').database('locations');

var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var saveNewLoc = function(postedData) {
  console.log('POST data:', postedData);

  db.save(postedData, function(err, res) {
    if (err) { 
      console.log('Error saving to database');
    } else { console.log('database response:', res); }
  });
};

app.set('views', './views');
app.set('view engine', 'jade');

app.use(morgan('common'));
app.use(express.static(__dirname + '/public'));

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something is broken... Oops!');
});

app.post('/new', urlencodedParser, function(req, res) {
  if (!req.body) { res.sendStatus(400); }
  else { saveNewLoc(req.body); }
});

app.get('/', function(req, res) {
  res.render('home');
});
app.get('/map', function(req, res) {
  res.render('map');
});
app.get('/list', function(req, res) {
//  db.view('locations/all', function(err, data) {
//    res.render('list', { locations: data });
//  });
  db.temporaryView({
    map: function(doc) {
      if (doc.name) { emit(doc.name, doc); }
    }
  }, function(err, data) {
    if (err) { console.log(err); }
    else { res.render('list', { locations: data }); }
  });
});
app.get('/new', function(req, res) {
  res.render('new');
});

app.listen(process.env.PORT || 3000, function() {
  console.log('Server running...');
});
