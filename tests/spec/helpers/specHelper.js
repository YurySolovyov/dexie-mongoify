jasmine.DEFAULT_TIMEOUT_INTERVAL = 100;

var specHelper = {

    getPeople: function() {
        return [
            { firstname: 'John', lastname: 'Doe', age: 24 },
            { firstname: 'Jane', lastname: 'Doe', age: 23 },
            { firstname: 'Pete', lastname: 'Fox', age: 22 },
            { firstname: 'Kyle', lastname: 'Riz', age: 17 },
        ];
    },

    getRandomPerson: function() {
        var people = this.getPeople();
        return people[Math.random() * people.length | 0];
    },

    setupDatabase: function() {
        var db = new Dexie('Database');
        db.version(1).stores({ people: '++id, firstname, lastname, age' });
        db.open();
        return db;
    },

    seedDatabase: function(db, done) {
        var insertions = this.getPeople().map(function(person) {
            return db.table('people').add(person);
        });

        Promise.all(insertions).then(done);
    },

    cleanDatabase: function(db, done) {
        db.table('people').toCollection().delete().then(done);
    },

    dropDatabase: function(db, done) {
        db.delete().then(done);
    }
};
