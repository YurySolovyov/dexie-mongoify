describe('counting', function() {

    it('should count all records', function(done) {

        db.collection('people').count({}).then(function(peopleCount) {

            expect(peopleCount).toBe(4);
            done();

        });

    });

    it('should count records by query', function(done) {

        db.collection('people').count({ lastname: 'Doe' }).then(function(peopleCount) {

            expect(peopleCount).toBe(2);
            done();

        });

    });

});
