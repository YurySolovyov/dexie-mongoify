## Mongoify ![Codeship CI status](https://codeship.com/projects/cce4f940-a96b-0133-ca36-7a8c162db443/status?branch=master)

Mongoify is an addon for [Dexie.js](https://github.com/dfahlander/Dexie.js), IndexedDB wrapper.

Mongoify tries to provide MongoDB-like* query language and API, but uses promises instead of callbacks.

`*` MongoDB-like means that Mongoify tries to follow MongoDB where it makes sense, to simplify API and implementation.
You are welcome to send PR that increases MongoDB compatibility.

[API documentation](/docs/index.md)

#### Examples:

You need to open database first:
```javascript

var db = new Dexie('Database');
db.version(1).stores({ people: '++id, firstname, lastname, age' });
db.open();
// Thanks to Dexie, there is not need to wait for database to open,
// you can start working right away

```

Then you can start inserting objects:

```javascript

var person = { firstname: 'John', lastname: 'Doe', age: 30 };
db.collection('people').insert(person).then(function() {

    // John is in db now :)

});

```
##### Querying database:

Get all objects:

```javascript

db.collection('people').find({}).toArray().then(function(people) {
    // empty query returns all objects
});

```

Get objects by simple field match:

```javascript

db.collection('people').find({ age: 30 }).toArray().then(function(people) {
    // people 30 years old
});

```

You can also use some of the MongoDB query operators:

```javascript

db.collection('people').find({ age: { $gte: 23 } }).toArray().then(function(people) {
    // people that are 23 and more years old
});

```

##### Updating objects:

```javascript

db.collection('people').update({ lastname: 'Doe' }, { age: 10 }).then(function(updatesCount) {
    // all Does are 10 years old now
});

```

Using update operators:

```javascript


db.collection('people').findOne({ skills: { $in: ['html', 'javascript'] }  }, updates).then(function(person) {

    return db.collection('people').update(person, { $push: { skills: 'jquery' } });

}).then(function(updatesCount) {
    // person has jquery skills now
});

```

[And more](/docs/index.md)


License: MIT
