describe('update options', function() {

    describe('upsert', function() {

        it('it should insert new document if there is nothing to update', function(done) {
            var query = { firstname: 'Robert' };
            var updates = { $set: { lastname: 'Martin' } };

            db.collection('people').update(query, updates, { upsert: true }).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').findOne(query);

            }).then(function(person) {

                expect(person.firstname).toBe('Robert');
                expect(person.lastname).toBe('Martin');
                done();

            });

        });

        it('it should work like plain .update(...) if there is something to update', function(done) {
            var query = { firstname: 'John' };
            var updates = { $set: { lastname: 'Smith' } };

            db.collection('people').update(query, updates, { upsert: true }).then(function(updatesCount) {

                expect(updatesCount).toBeGreaterThan(0);
                return db.collection('people').findOne({ firstname: 'John', lastname: 'Smith' });

            }).then(function(person) {

                expect(person.firstname).toBe('John');
                expect(person.lastname).toBe('Smith');
                done();

            });

        });

    });

});
