describe('dropping', function() {

    it('should drop a collection', function(done) {

        db.collection('people').find({}).toArray().then(function(people) {

            expect(people.length).toBe(4);
            return db.collection('people').drop();

        }).then(function() {

            return db.collection('people').find({}).toArray();

        }).then(function(people) {

            expect(people).toBeEmptyArray();
            done();

        });

    });

});
