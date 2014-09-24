'use strict';

module.exports = function(app) {

  app.use('/', require('./routes/pages'));
  app.use('/api', require('./routes/api'));

};


