'use strict';

var express    = require('express');
var morgan     = require('morgan');
var bunyan     = require('bunyan');

var log = bunyan.createLogger({ name: 'taiji' });
var port = process.env.PORT || 3000;

var app = express();

app.set('views', './views');
app.set('view engine', 'jade');

app.use(morgan('common'));

app.use(express.static(__dirname + '/client'));

var router = require('./router')(app);

app.use(function(err, req, res, next) {
  log.error({ source: 'express error' }, err);
  res.status(err.status || 500).end();
});

app.listen(port, function() {
  log.info('Server running on port', port);
});

module.exports = app;
