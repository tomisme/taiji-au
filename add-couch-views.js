var cradle = require('cradle');
var db = new(cradle.Connection)().database('locations');

db.save('_design/locations', {
  all: {
    map: function(doc) {
      if (doc.name) { emit(doc.name, doc); }
    }
  }
});
    
