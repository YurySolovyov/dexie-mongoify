describe("mongoify addon", function() {

    it('should have proper methods', function(done) {

        expect(db.collection).toBeDefined();

        var peopleCollection = db.collection('people');

        expect(peopleCollection.count).toBeDefined();
        expect(peopleCollection.find).toBeDefined();
        expect(peopleCollection.findOne).toBeDefined();
        expect(peopleCollection.insert).toBeDefined();
        expect(peopleCollection.update).toBeDefined();
        expect(peopleCollection.remove).toBeDefined();
        expect(peopleCollection.drop).toBeDefined();

        done();
    });
});
