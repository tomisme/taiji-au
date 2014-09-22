var prog   = require('commander');
var cradle = require('cradle');
var db = new(cradle.Connection)().database('locations');

db.save('_design/locations', {
  all: {
    map: function(doc) {
      if (doc.name) { emit(doc.name, doc); }
    }
  },
  function(err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log(res);
    }
  }
});
    
