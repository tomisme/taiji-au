var prog   = require('commander');
var cradle = require('cradle');
var connection;
var db;

prog
  .option('-c, --create', 'Create database')
  .option('-r, --remove', 'Remove database')
  .option('-v, --addview [view]', 'Add view to database')
  .option('-d, --database [database]', 'Select database to manipulate')
  .parse(process.argv);


if (!prog.database) {
  console.log('Did not provide -d flag with name of database to create');
  return;
}

connection = new(cradle.Connection)(process.env.COUCH_URL || '127.0.0.1:5984');
db = connection.database(prog.database)

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

if (prog.addView === 'all') {
  db.save('_design/locations', {
    all: {
      map: function(doc) {
        if (doc.name) {
          emit(doc.name, doc);
        }
      },
      reduce: '_count'
    }
  });
}   

