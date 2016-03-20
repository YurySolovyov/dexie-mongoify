describe('inserting', function() {

    it('should insert a document', function(done) {

        var person = { firstname: 'Jack', lastname: 'Black', age: 30 };
        db.collection('people').insert(person).then(function(result) {

            expect(result).toBeObject();
            expect(result.ops).toBeArrayOfObjects();
            expect(result.insertedCount).toBeGreaterThan(0);
            expect(result.insertedId).toBeGreaterThan(0);
            expect(result.result).toBeObject();

            return db.collection('people').find({}).toArray();

        }).then(function(people) {

            expect(people.length).toBe(5);
            expect(people).toBeArrayOfObjects();
            expect(people).toContain(person);
            done();

        });

    });

});
