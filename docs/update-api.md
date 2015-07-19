## Update API

Supported update operators:

* $inc
* $mul
* $rename
* $set
* $unset
* $min
* $max
* $addToSet
* $pop
* $push
* $pull
* $pullAll
* $slice
* $sort

API:

#### `collection.update(query, updates)`
* `query` is the same query object as in Query API.
* `updates` is an object that contains updates and zero or more update operators

Returns a promise which resolves with a number of updated objects.

Examples:

Perform a simple field update:

```javascript
db.collection('people').update({ lastname: 'Doe' }, { age: 45 }).then(function(updatesCount) {
    // ...
});
```

Perform an update using update operators:

```javascript
db.collection('people').update({ lastname: 'Doe' }, { $inc: { age: 1 } }).then(function(updatesCount) {
    // ...
});
```
