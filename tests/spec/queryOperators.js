describe('query operators', function() {

    describe('$eq operator', function() {

        it('should find docs where $eq expression matches', function(done) {

            db.collection('people').find({ age: { $eq: 17 } }).toArray().then(function(people) {

                expect(people.length).toBe(1);
                expect(people).toBeArrayOfObjects();
                done();

            });

        });

    });

    describe('$gt operator', function() {

        it('should find docs with numeric field greater than $gt value', function(done) {

            db.collection('people').find({ age: { $gt: 20 } }).toArray().then(function(people) {

                expect(people.length).toBe(3);
                expect(people).toBeArrayOfObjects();
                done();

            });

        });

    });

    describe('$gte operator', function() {

        it('should find docs with numeric field greater than or equal to $gte value', function(done) {

            db.collection('people').find({ age: { $gte: 23 } }).toArray().then(function(people) {

                expect(people.length).toBe(2);
                expect(people).toBeArrayOfObjects();
                done();

            });

        });

    });

    describe('$lt operator', function() {

        it('should find docs with numeric field lower than $lt value', function(done) {

            db.collection('people').find({ age: { $lt: 20 } }).toArray().then(function(people) {

                expect(people.length).toBe(1);
                expect(people).toBeArrayOfObjects();
                done();

            });

        });

    });

    describe('$lte operator', function() {

        it('should find docs with numeric field lower than or equal to $gte value', function(done) {

            db.collection('people').find({ age: { $lte: 22 } }).toArray().then(function(people) {

                expect(people.length).toBe(2);
                expect(people).toBeArrayOfObjects();
                done();

            });

        });

    });

    describe('$ne operator', function() {

        it('should find docs with field not equal to $ne value', function(done) {

            db.collection('people').find({ age: { $ne: 22 } }).toArray().then(function(people) {

                expect(people.length).toBe(3);
                expect(people).toBeArrayOfObjects();
                done();

            });

        });

    });

    describe('$in operator', function() {

        it('should find docs with field value in $in array', function(done) {

            db.collection('people').find({ age: { $in: [23, 17] } }).toArray().then(function(people) {

                expect(people.length).toBe(2);
                expect(people).toBeArrayOfObjects();
                done();

            });

        });

        it('should find no docs with not matching values', function(done) {

            db.collection('people').find({ age: { $in: [50, 1] } }).toArray().then(function(people) {

                expect(people.length).toBe(0);
                expect(people).toBeEmptyArray();
                done();

            });

        });

    });

    describe('$nin operator', function() {

        it('should find docs with field value not in $nin array', function(done) {

            db.collection('people').find({ age: { $nin: [23, 17] } }).toArray().then(function(people) {

                expect(people.length).toBe(2);
                expect(people).toBeArrayOfObjects();
                done();

            });

        });

        it('should find no docs if $nin array matches all values', function(done) {

            db.collection('people').find({ age: { $nin: [23, 24, 22, 17] } }).toArray().then(function(people) {

                expect(people.length).toBe(0);
                expect(people).toBeEmptyArray();
                done();

            });

        });

    });

    describe('$exists operator', function() {

        it('should find docs where field $exists', function(done) {

            db.collection('people').find({ age: { $exists: true } }).toArray().then(function(people) {

                expect(people.length).toBe(4);
                expect(people).toBeArrayOfObjects();
                done();

            });

        });

        it('should find docs where field does not $exists', function(done) {

            db.collection('people').find({ nonExistingField: { $exists: false } }).toArray().then(function(people) {

                expect(people.length).toBe(4);
                expect(people).toBeArrayOfObjects();
                done();

            });


        });

        it('should find docs with unindexed field with $exists:true', function(done) {

            var person = specHelper.getRandomPerson();
            person.field = 'value';

            db.collection('people').insert(person).then(function() {

                return db.collection('people').find({ field: { $exists: true } }).toArray();

            }).then(function(people) {

                expect(people.length).toBe(1);
                expect(people).toBeArrayOfObjects();
                expect(people).toContain(person);
                done();

            });

        });

    });

    describe('$all operator', function() {

        it('should find docs with array field having all $all values', function(done) {

            var person = specHelper.getRandomPerson();
            person.skills = ['js', 'mongodb', 'ruby'];

            db.collection('people').insert(person).then(function() {

                return db.collection('people').find({ skills: { $all: [ 'js', 'ruby'] } }).toArray();

            }).then(function(people) {

                expect(people.length).toBe(1);
                expect(people).toBeArrayOfObjects();
                expect(people).toContain(person);
                done();

            });

        });

    });


    describe('$size operator', function() {

        it('should find docs with array field of $size length', function(done) {

            var person = specHelper.getRandomPerson();
            person.skills = ['js', 'mongodb', 'ruby'];

            db.collection('people').insert(person).then(function() {

                return db.collection('people').find({ skills: { $size: 3 } }).toArray();

            }).then(function(people) {

                expect(people.length).toBe(1);
                expect(people).toBeArrayOfObjects();
                expect(people).toContain(person);
                done();

            });

        });

    });

    describe('$elemMatch operator', function() {

        it('should find docs with array field where at least one element matches $elemMatch expression', function(done) {

            var person = specHelper.getRandomPerson();
            person.luckyNumbers = [21, 17, 71, 67, 91];

            db.collection('people').insert(person).then(function() {

                return db.collection('people').find({ luckyNumbers: { $elemMatch: { $gte: 20, $in: [21, 71], $ne: 91 } } }).toArray();

            }).then(function(people) {

                expect(people.length).toBe(1);
                expect(people).toBeArrayOfObjects();
                expect(people).toContain(person);
                done();

            });

        });

    });

    describe('$not operator', function() {

        it('should find docs where docs do not pass $not expression', function(done) {

            db.collection('people').find({ age: { $not: { $gt: 22 } } }).toArray().then(function(people) {

                expect(people.length).toBe(2);
                expect(people).toBeArrayOfObjects();
                done();

            });

        });

    });

});
