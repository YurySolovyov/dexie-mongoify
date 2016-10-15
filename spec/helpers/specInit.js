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

window.addEventListener('unhandledrejection', function(e) {
    console.log(e);
});
