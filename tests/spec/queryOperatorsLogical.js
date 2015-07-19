describe('logical query operators ', function() {

    describe('$and operator', function() {

        it('should find docs satifsying all $and expressions', function(done) {
            var query = { $and: [{ age: { $gte: 22 } }, { lastname: { $in: ['Fox', 'Doe'] } }] };
            db.collection('people').find(query).toArray().then(function(people) {

                expect(people.length).toBe(3);
                expect(people).toBeArrayOfObjects();
                done();

            });

        });

    });

    describe('$or operator', function() {

        it('should find docs satifsying at least one $or expression', function(done) {
            var query = { $or: [{ age: { $lt: 23, $ne: 20  }  }, {  lastname: { $in: ['Fox'] } }] };
            db.collection('people').find(query).toArray().then(function(people) {

                expect(people.length).toBe(2);
                expect(people).toBeArrayOfObjects();
                done();

            });

        });

    });

    describe('$nor operator', function() {

        it('should find docs failing all $nor expressions', function(done) {
            var query = { $nor: [{ age: { $lt: 23, $ne: 20  }  }, {  lastname: { $in: ['Fox'] } }] };
            db.collection('people').find(query).toArray().then(function(people) {

                expect(people.length).toBe(3);
                expect(people).toBeArrayOfObjects();
                done();

            });

        });

    });



});
