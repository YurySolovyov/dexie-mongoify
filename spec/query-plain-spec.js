describe('simple match querying', function() {

    it('should find all items on empty query', function(done) {

        db.collection('people').find({}).toArray().then(function(people) {

            expect(people.length).toBe(4);
            expect(people).toBeArrayOfObjects();
            done();

        });
    });

    it('should find one document from findOne call', function(done) {

        db.collection('people').findOne({}).then(function(person) {

            expect(person).toBeObject();
            done();

        });

    });

    it('should find document by primary key', function(done) {

        var id;
        db.collection('people').findOne({}).then(function(person) {

            id = person.id;
            return db.collection('people').findOne({ id: id });

        }).then(function(person) {

            expect(person.id).toBe(id);
            done();

        });

    });

    it('should find object with unindexed property', function(done) {

        var person = { firstname: 'Jack', lastname: 'Sparrow', post: 'Capitan' };
        db.collection('people').insert(person).then(function() {

            return db.collection('people').findOne({ post: person.post });

        }).then(function(result) {

            expect(result.firstname).toBe('Jack');
            expect(result.lastname).toBe('Sparrow');
            expect(result.post).toBe('Capitan');
            expect(result.id).toBeNumber();
            done();

        });

    });

});
