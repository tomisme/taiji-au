'use strict';

var express    = require('express');
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var cradle     = require('cradle');
var bunyan     = require('bunyan');

var log = bunyan.createLogger({ name: 'taiji' });
var port = process.env.PORT || 3000   
var router;

var app = express();

app.set('views', './views');
app.set('view engine', 'jade');

app.use(morgan('common'));

app.use(express.static(__dirname + '/public'));

router = require('./router')(app);

app.use(function(err, req, res, next) {
  log.error(err);
  res.status(err.status || 500);
});

app.listen(port, function() {
  log.info('Server running on port', port);
});

module.exports = app;
