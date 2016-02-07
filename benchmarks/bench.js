'use strict';

var db;
var onStart = function() {
  db = new Dexie('Database');
  db.version(1).stores({ people: '++id, firstname, lastname, age' });
  db.open();
};

var onComplete = function() {
  db.delete();
};

var benchmarkOptions = {
  async: true,
  onStart: onStart,
  onComplete: onComplete
};

suite('querying', function() {
  benchmark('all', function(deferred) {
    db.collection('people').find({}).toArray().then(()=> { deferred.resolve() });
  }, benchmarkOptions);

  benchmark('findOne', function(deferred) {
    db.collection('people').findOne({}).then(()=> { deferred.resolve() });
  }, benchmarkOptions);
});
