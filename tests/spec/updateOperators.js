describe('update operators', function() {

    describe('$inc operator', function() {

        it('should increment field by $inc value', function(done) {

            var person = specHelper.getRandomPerson();
            var originalAge = person.age;
            var newAge = ++originalAge;

            var updates = { $inc: { age: 1 } };
            db.collection('people').update(person, updates).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').findOne({
                    firstname: person.firstname,
                    lastname: person.lastname
                });

            }).then(function(updatedPerson) {

                expect(updatedPerson).toImplement(person);
                expect(updatedPerson.age).toBe(newAge);
                done();

            });

        });

    });

    describe('$mul operator', function() {

        it('should multiplicate field by $mul value', function(done) {

            var person = specHelper.getRandomPerson();
            var originalAge = person.age;
            var newAge = originalAge * 2;

            var updates = { $mul: { age: 2 } };
            db.collection('people').update(person, updates).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').findOne({
                    firstname: person.firstname,
                    lastname: person.lastname
                });

            }).then(function(updatedPerson) {

                expect(updatedPerson).toImplement(person);
                expect(updatedPerson.age).toBe(newAge);
                done();

            });

        });

    });

    describe('$rename operator', function() {

        it('should rename field to $rename value', function(done) {
            var person = specHelper.getRandomPerson();

            var updates = { $rename: { age: 'yearsOld' } };
            db.collection('people').update(person, updates).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').findOne({
                    firstname: person.firstname,
                    lastname: person.lastname
                });

            }).then(function(updatedPerson) {

                expect(updatedPerson.yearsOld).toBeDefined(person);
                expect(updatedPerson.yearsOld).toBe(person.age);
                done();

            });

        });

    });

    describe('$set operator', function() {

        it('should set field value to $set value by the same key', function(done) {
            var person = specHelper.getRandomPerson();

            var updates = { $set: { age: 29 } };
            db.collection('people').update(person, updates).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').findOne({
                    firstname: person.firstname,
                    lastname: person.lastname
                });

            }).then(function(updatedPerson) {

                expect(updatedPerson.age).toBe(29);
                done();

            });

        });

    });

    describe('$unset operator', function() {

        it('should remove field value by the same $unset key', function(done) {
            var person = specHelper.getRandomPerson();

            var updates = { $unset: { age: '' } };
            db.collection('people').update(person, updates).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').findOne({
                    firstname: person.firstname,
                    lastname: person.lastname
                });

            }).then(function(updatedPerson) {

                expect(updatedPerson.age).not.toBeDefined();
                done();

            });

        });

    });

    describe('$min operator', function() {

        it('should set field value to Math.min of current and $min values', function(done) {
            var person = specHelper.getRandomPerson();

            var updates = { $min: { age: 11 } };
            db.collection('people').update(person, updates).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').findOne({
                    firstname: person.firstname,
                    lastname: person.lastname
                });

            }).then(function(updatedPerson) {

                expect(updatedPerson.age).toBe(11);
                done();

            });

        });

    });

    describe('$max operator', function() {

        it('should set field value to Math.max of current and $max values', function(done) {
            var person = specHelper.getRandomPerson();

            var updates = { $max: { age: 30 } };
            db.collection('people').update(person, updates).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').findOne({
                    firstname: person.firstname,
                    lastname: person.lastname
                });

            }).then(function(updatedPerson) {

                expect(updatedPerson.age).toBe(30);
                done();

            });

        });

    });

    describe('$addToSet operator', function() {

        it('should add array field if $addToSet field does not exist', function(done) {
            var person = specHelper.getRandomPerson();

            var updates = { $addToSet: { skills: 'css' } };
            db.collection('people').update(person, updates).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').update(person, { $addToSet: { skills: 'css' } });

            }).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').findOne(person);

            }).then(function(updatedPerson) {

                expect(updatedPerson.skills).toBeArrayOfSize(1);
                expect(updatedPerson.skills).toContain('css');
                done();

            });

        });

        it('should add $addToSet value to array if not present', function(done) {
            var person = specHelper.getRandomPerson();

            var updates = { $addToSet: { skills: 'css' } };
            db.collection('people').update(person, updates).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').update(person, { $addToSet: { skills: 'html' } });

            }).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').findOne(person);

            }).then(function(updatedPerson) {

                expect(updatedPerson.skills).toBeArrayOfSize(2);
                done();

            });

        });

        it('should keep array as is if value $addToSet value already in array', function(done) {
            var person = specHelper.getRandomPerson();

            var updates = { $addToSet: { skills: 'css' } };
            db.collection('people').update(person, updates).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').update(person, { $addToSet: { skills: 'css' } });

            }).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').findOne(person);

            }).then(function(updatedPerson) {

                expect(updatedPerson.skills).toBeArrayOfSize(1);
                expect(updatedPerson.skills).toContain('css');
                done();

            });

        });

    });

    describe('$pop operator', function() {

        it('should add remove last array element if $pop value by key is 1', function(done) {
            var person = specHelper.getRandomPerson();

            var updates = { $set: { skills: ['css', 'html'] } };
            db.collection('people').update(person, updates).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').update(person, { $pop: { skills: 1 } });

            }).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').findOne(person);

            }).then(function(updatedPerson) {

                expect(updatedPerson.skills).toBeArrayOfSize(1);
                expect(updatedPerson.skills).toContain('css');
                expect(updatedPerson.skills).not.toContain('html');
                done();

            });

        });

        it('should add remove first array element if $pop value by key is -1', function(done) {
            var person = specHelper.getRandomPerson();

            var updates = { $set: { skills: ['css', 'html'] } };
            db.collection('people').update(person, updates).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').update(person, { $pop: { skills: -1 } });

            }).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').findOne(person);

            }).then(function(updatedPerson) {

                expect(updatedPerson.skills).toBeArrayOfSize(1);
                expect(updatedPerson.skills).toContain('html');
                expect(updatedPerson.skills).not.toContain('css');
                done();

            });

        });

    });

    describe('$push operator', function() {

        it('should add array field if $push field does not exist', function(done) {
            var person = specHelper.getRandomPerson();

            var updates = { $push: { skills: 'css' } };
            db.collection('people').update(person, updates).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').findOne(person);

            }).then(function(updatedPerson) {

                expect(updatedPerson.skills).toBeArrayOfSize(1);
                expect(updatedPerson.skills).toContain('css');
                done();

            });

        });

        it('should append $push value to array field', function(done) {
            var person = specHelper.getRandomPerson();

            var updates = { $set: { skills: ['css'] } };
            db.collection('people').update(person, updates).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').update(person, { $push: { skills: 'html' } });

            }).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').findOne(person);

            }).then(function(updatedPerson) {

                expect(updatedPerson.skills).toBeArrayOfSize(2);
                expect(updatedPerson.skills).toContain('css');
                expect(updatedPerson.skills).toContain('html');
                done();

            });

        });

    });

    describe('$pullAll operator', function() {

        it('should pull all $pullAll values from array field', function(done) {
            var person = specHelper.getRandomPerson();

            var updates = { $set: { skills: ['css', 'html', 'ruby'] } };
            db.collection('people').update(person, updates).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').update(person, { $pullAll: { skills: ['css', 'ruby'] } });

            }).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').findOne(person);

            }).then(function(updatedPerson) {

                expect(updatedPerson.skills).toBeArrayOfSize(1);
                expect(updatedPerson.skills).toContain('html');
                done();

            });

        });

    });

    describe('$pull operator', function() {

        it('should pull values that equals $pull value', function(done) {
            var person = specHelper.getRandomPerson();

            var updates = { $set: { skills: ['css', 'html'] } };
            db.collection('people').update(person, updates).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').update(person, { $pull: { skills: 'css' } });

            }).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').findOne(person);

            }).then(function(updatedPerson) {

                expect(updatedPerson.skills).toBeArrayOfSize(1);
                expect(updatedPerson.skills).toContain('html');
                done();

            });
        });

        it('should pull values that match $pull query', function(done) {
            var person = specHelper.getRandomPerson();

            var updates = { $set: { skills: ['css', 'html', 'ruby'] } };
            db.collection('people').update(person, updates).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').update(person, { $pull: { skills: { $in: ['css', 'ruby'] } } });

            }).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').findOne(person);

            }).then(function(updatedPerson) {

                expect(updatedPerson.skills).toBeArrayOfSize(1);
                expect(updatedPerson.skills).toContain('html');
                done();

            });

        });

    });

    describe('$slice operator', function() {

        it('should slice first n elements by $slice key', function(done) {
            var person = specHelper.getRandomPerson();

            var updates = { $set: { scores: [2, 1, 33, 11, 0, 2, 9] } };
            db.collection('people').update(person, updates).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').update(person, { $slice: { scores: 3 } });

            }).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').findOne(person);

            }).then(function(updatedPerson) {

                expect(updatedPerson.scores).toEqual([2, 1, 33]);
                done();

            });

        });

        // TODO: add neg case

        it('should slice by multiple keys', function(done) {
            var person = specHelper.getRandomPerson();

            var updates = { $set: { scores: [{ ids: [2, 1, 33], points: [0, 2, 9] }] } };
            db.collection('people').update(person, updates).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').update(person, { $slice: { scores: { ids: 1, points: 1 } } });

            }).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').findOne(person);

            }).then(function(updatedPerson) {

                expect(updatedPerson.scores).toEqual([{ ids: [2], points: [0] }]);
                done();

            });

        });

    });

    describe('$sort operator', function() {

        it('should sort array field', function(done) {
            var person = specHelper.getRandomPerson();

            var updates = { $set: { scores: [2, 1, 33, 11, 0, 2, 9] } };
            db.collection('people').update(person, updates).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').update(person, { $sort: { scores: 1 } });

            }).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').findOne(person);

            }).then(function(updatedPerson) {

                expect(updatedPerson.scores).toEqual([0, 1, 2, 2, 9, 11, 33]);
                done();

            });

        });

        it('should sort array field in reversed order', function(done) {
            var person = specHelper.getRandomPerson();

            var updates = { $set: { scores: [2, 1, 33, 11, 0, 2, 9] } };
            db.collection('people').update(person, updates).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').update(person, { $sort: { scores: -1 } });

            }).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').findOne(person);

            }).then(function(updatedPerson) {

                expect(updatedPerson.scores).toEqual([33, 11, 9, 2, 2, 1, 0]);
                done();

            });

        });

        it('should sort field that is an array of documents', function(done) {
            var person = specHelper.getRandomPerson();

            var updates = { $set: { scores: [{id:1, n:3}, {id:2, n:0}, {id:3, n:2}] } };
            db.collection('people').update(person, updates).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').update(person, { $sort: { scores: { n: 1 } } });

            }).then(function(updatesCount) {

                expect(updatesCount).toBe(1);
                return db.collection('people').findOne(person);

            }).then(function(updatedPerson) {

                expect(updatedPerson.scores).toEqual([{id:2, n:0}, {id:3, n:2}, {id:1, n:3}]);
                done();

            });

        });

    });

});
