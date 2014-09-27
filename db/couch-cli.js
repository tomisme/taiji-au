var cradle = require('cradle');
var cutils = require('couchdb-utils');

var connection = new(cradle.Connection)(process.env.COUCH_URL || '127.0.0.1:5984');

var db = connection.database('locations');

db.createIfNotExists(function(err, existed) {
  if (err) console.log(err);
  if (!err && !existed) console.log('Location database successfully created');
});

var design = new cutils.Design(db, 'locations', '0.0.4');

design.view('all', {
  map: function (doc) { emit(doc._id, doc); }
});

design.end(function(err) {
  if (err) console.log(err);
  else console.log('All views are up to date.');
});

/*
if (prog.create) {
  db.exists(function (err, exists) {
    if (err) {
      console.log(err);
    } else if (exists) {
      console.log('Database already exists');
    } else {
      console.log('Database does not exist');
      db.create();
      console.log('Database created');
    }
  });
}

if (prog.remove) {
  db.destroy(function(err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log(res);
    }
  });
}
*/
