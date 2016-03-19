describe('removing', function() {

    it('should remove a document', function(done) {

        var person = specHelper.getRandomPerson();
        db.collection('people').remove(person).then(function(result) {

            expect(result).toBeObject();
            expect(result.deletedCount).toBe(1);
            expect(result.result).toBeObject();

            return db.collection('people').find({}).toArray();

        }).then(function(people) {

            expect(people.length).toBe(3);
            expect(people).toBeArrayOfObjects();
            expect(people).not.toContain(person);
            done();

        });

    });

});
