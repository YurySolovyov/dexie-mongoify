describe('removing', function() {

    it('should remove a document', function(done) {

        var person = specHelper.getRandomPerson();
        db.collection('people').remove(person).then(function(removedCount) {

            expect(removedCount).toBe(1);
            return db.collection('people').find({}).toArray();

        }).then(function(people) {

            expect(people.length).toBe(3);
            expect(people).toBeArrayOfObjects();
            expect(people).not.toContain(person);
            done();

        });

    });

});
