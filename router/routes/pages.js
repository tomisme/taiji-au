var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
  res.render('home');
});

router.get('/map', function(req, res) {
  res.render('map');
});

router.get('/new', function(req, res) {
  res.render('new');
});

module.exports = router;


