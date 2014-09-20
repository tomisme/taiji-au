var express    = require('express');
var bodyParser = require('body-parser');
var logger     = require('morgan');

var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('views', './views');
app.set('view engine', 'jade');

// log requests to console
app.use(logger('common'));

// serve static content
app.use(express.static(__dirname + '/public'));

// handle new location form submission
app.post('/new', urlencodedParser, function(req, res) {
  if (!req.body) {
    res.sendStatus(400);
  } else {
  console.log(req.body);
  res.sendStatus(200);
  }
});

app.get('/', function(req, res) {
  res.render('form');
});

// handle errors
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something is broken... Oops!');
});

app.listen(process.env.PORT, function() {
  console.log('Server running on port ' + process.env.PORT);
});
