var express = require('express');
var app = express();
var logger = require('morgan');

app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something is broken... Oops!');
});

app.listen(process.env.PORT);
