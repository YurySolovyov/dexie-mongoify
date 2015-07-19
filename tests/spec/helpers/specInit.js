var db;
beforeAll(function() {
    db = specHelper.setupDatabase();
});

beforeEach(function(done) {
    specHelper.seedDatabase(db, done);
});

afterEach(function(done) {
    specHelper.cleanDatabase(db, done);
});

afterAll(function(done) {
    specHelper.dropDatabase(db, done);
});

Dexie.Promise.on('error', function(e) {
    console.log(e);
});
