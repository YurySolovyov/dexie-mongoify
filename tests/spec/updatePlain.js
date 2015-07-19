describe('updating', function() {

    it('should update one document', function(done) {

        var person = specHelper.getRandomPerson();
        db.collection('people').update(person, { age: 100 }).then(function(updatesCount) {

            expect(updatesCount).toBe(1);
            person.age = 100;
            return db.collection('people').findOne(person);

        }).then(function(updatedPerson) {

            expect(updatedPerson).toImplement(person);
            done();

        });

    });

    it('should update multiple documents', function(done) {

        db.collection('people').update({ lastname: 'Doe' }, { age: 45 }).then(function(updatesCount) {

            expect(updatesCount).toBe(2);
            return db.collection('people').find({ lastname: 'Doe' }).toArray();

        }).then(function(updatedPeople) {

            expect(updatedPeople.length).toBe(2);
            expect(updatedPeople).toBeArrayOfObjects();
            updatedPeople.forEach(function(person) {
                expect(person.age).toBe(45);
            });
            done();

        });

    });

    it('should update all documents on empty query', function(done) {

        db.collection('people').update({}, { age: 20 }).then(function(updatesCount) {

            expect(updatesCount).toBe(4);
            return db.collection('people').find({}).toArray();

        }).then(function(updatedPeople) {

            expect(updatedPeople.length).toBe(4);
            expect(updatedPeople).toBeArrayOfObjects();
            updatedPeople.forEach(function(person) {
                expect(person.age).toBe(20);
            });
            done();

        });

    });

});
