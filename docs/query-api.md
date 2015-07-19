## Query API

Supported query operators:

* $eq
* $gt
* $gte
* $lt
* $lte
* $ne
* $in
* $nin
* $exists
* $all
* $size
* $elemMatch
* $not

Supported logical operators:

* $and
* $or
* $nor

API:

#### `collection.find(query)`
* `query` is an object that contains query criteria and zero or more update operators

Returns a promise which resolves to an array of matched objects.

Examples:

Simple query:
```javascript
db.collection('people').find({ age: { $in: [23, 17] } }).toArray().then(function(people) {
    // ...
});
```

Logical operators:
```javascript
db.collection('people').find({
    $or: [
        { age: { $lt: 23, $ne: 20  } },
        { lastname: { $in: ['Fox'] } }
    ]
}).toArray().then(function(people) {
    // ...
});
```

#### `collection.findOne(query)`

Same as `collection.find(query)`, but returns first matched result, so you don't
need to call `.toArray()` on it.

Example:

Find a person with `id = 42`
```javascript
db.collection('people').findOne({ id: 42 }).then(function(person) {
    // ...
});
```
