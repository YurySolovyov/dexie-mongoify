describe('dropping', function() {

    it('should drop a collection', function(done) {

        db.collection('people').find({}).toArray().then(function(people) {

            expect(people.length).toBe(4);
            return db.collection('people').drop();

        }).then(function(result) {

            expect(result).toBeObject();
            expect(result.deletedCount).toBeGreaterThan(0);
            expect(result.result).toBeObject();

            return db.collection('people').find({}).toArray();

        }).then(function(people) {

            expect(people).toBeEmptyArray();
            done();

        });

    });

});
