'use strict';

var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/admin', function(req, res) {
  res.render('admin/dash');
});

router.get('/admin/map', function(req, res) {
  res.render('admin/map');
});

router.get('/admin/new', function(req, res) {
  res.render('admin/new');
});

module.exports = router;

