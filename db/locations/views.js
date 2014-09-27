{
  all: {
    map: function(doc) {
      if (doc.name) {
        emit(doc.name, doc);
      }
    },
    reduce: '_count'
  }
}
