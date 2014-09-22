#!/usr/bin/node --harmony

const
  request = require('request'),

  url = process.env.COUCH_URL || '127.0.0.1:5984';  

  options = {
    method: process.argv[2] || 'GET',
    url: url + '/' + (process.argv[3] || '')
  };

request(options, function(err, res, body) {
  if (err) {
    throw Error(err);
  } else {
    console.log(res.statusCode, JSON.parse(body));
  }
});
