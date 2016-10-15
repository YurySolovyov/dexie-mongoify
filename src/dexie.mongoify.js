var dexie = require('dexie');
var only = require('only');
var assign = require('object-assign');
var concat = require('array-concat');

var valueComparator = require('./utils/value-comparator');
var isArrayField = require('./utils/is-array-field');
var isEmptyValue = require('./utils/is-empty-value');
var isPlainValue = require('./utils/is-plain-value');
var arraySlice = require('./utils/array-slice');
var noop = require('./utils/noop');
var has = require('./utils/has');

var comparsionQueryOperatorsImpl = {

    $eq: function(key, value) {
        return function(item) {
            return has(item, key) && item[key] === value;
        };
    },

    $gt: function(key, value) {
        return function(item) {
            return has(item, key) && item[key] > value;
        };
    },

    $gte: function(key, value) {
        return function(item) {
            return has(item, key) && item[key] >= value;
        };
    },

    $lt: function(key, value) {
        return function(item) {
            return has(item, key) && item[key] < value;
        };
    },

    $lte: function(key, value) {
        return function(item) {
            return has(item, key) && item[key] <= value;
        };
    },

    $ne: function(key, value) {
        return function(item) {
            return has(item, key) && item[key] !== value;
        };
    },

    $in: function(key, value) {
        return function(item) {
            return has(item, key) && value.indexOf(item[key]) > -1;
        };
    },

    $nin: function(key, value) {
        return function(item) {
            return has(item, key) && value.indexOf(item[key]) === -1;
        };
    },

    $exists: function(key, value) {
        return function(item) {
            return has(item, key) === value;
        };
    },

    $all: function(key, value) {
        return function(item) {
            return has(item, key) && value.every(function(valueItem) {
                return item[key].indexOf(valueItem) > -1;
            });
        };
    },

    $size: function(key, value) {
        return function(item) {
            return has(item, key) && item[key].length === value;
        };
    },

    $elemMatch: function(key, value) {
        var matchers = getQueryValueMatchers(key, value);
        return function(item) {
            return has(item, key) && item[key].some(function(element) {
                var dummy = {};
                dummy[key] = element;
                return matchers.every(function(matcher) {
                    return matcher(dummy);
                });
            });
        };
    },

    $not: function(key, value) {
        var matchers = getQueryValueMatchers(key, value);

        return function(item) {
            return !has(item, key) || matchers.every(function(matcher) {
                return !matcher(item);
            });
        };
    }

};

var logicalQueryOperatorsImpl = {

    $and: function(key, value) {
        var matchers = value.map(getMatcherSets).reduce(concat);

        return function(item) {
            return matchers.every(function(matcher) {
                return matcher(item);
            });
        };
    },

    $or: function(key, value) {
        var matchersSets = value.map(getMatcherSets);

        return function(item) {
            return matchersSets.some(function(matchers) {
                return matchers.every(function(matcher) {
                    return matcher(item);
                });
            });
        };

    },

    $nor: function(key, value) {
        var matcher = this.$and(key, value);
        return function(item) {
            return !matcher(item);
        };
    }

};

var updateOperatorsImpl = {

    $inc: function(_null, increments) {
        return createUpdateIterator(increments, function(key, item) {
            if (has(item, key)) {
                item[key] += increments[key];
            }
        });
    },

    $mul: function(_null, muls) {
        return createUpdateIterator(muls, function(key, item) {
            if (has(item, key)) {
                item[key] *= muls[key];
            }
        });
    },

    $rename: function(_null, renames) {
        return createUpdateIterator(renames, function(key, item) {
            var oldValue = item[key];
            delete item[key];
            item[renames[key]] = oldValue;
        });
    },

    $set: function(_null, sets) {
        return createUpdateIterator(sets, function(key, item) {
            item[key] = sets[key];
        });
    },

    $unset: function(_null, unsets) {
        return createUpdateIterator(unsets, function(key, item) {
            delete item[key];
        });
    },

    $min: function(_null, minimums) {
        return createUpdateIterator(minimums, function(key, item) {
            item[key] = Math.min(item[key], minimums[key]);
        });
    },

    $max: function(_null, maximums) {
        return createUpdateIterator(maximums, function(key, item) {
            item[key] = Math.max(item[key], maximums[key]);
        });
    },

    $addToSet: function(_null, additions) {
        return createUpdateIterator(additions, function(key, item) {
            if (!isArrayField(item, key)) {
                item[key] = [additions[key]];
            } else if (item[key].indexOf(additions[key]) === -1) {
                item[key].push(additions[key]);
            }
        });
    },

    $pop: function(_null, pops) {
        return createUpdateIterator(pops, function(key, item) {
            isArrayField(item, key);
            if (pops[key] === 1) {
                item[key].pop();
            } else if (pops[key] === -1) {
                item[key].shift();
            }
        });
    },

    $push: function(_null, pushes) {
        return createUpdateIterator(pushes, function(key, item) {
            if (!isArrayField(item, key)) {
                item[key] = [pushes[key]];
            } else {
                item[key].push(pushes[key]);
            }
        });
    },

    $pullAll: function(_null, pulls) {
        return createUpdateIterator(pulls, function(key, item) {
            isArrayField(item, key);
            var pullValue = pulls[key];
            item[key] = item[key].filter(function(fieldItem) {
                return pullValue.indexOf(fieldItem) === -1;
            });
        });
    },

    $pull: function(_null, pulls) {
        return createUpdateIterator(pulls, function(key, item) {
            isArrayField(item, key);
            var pullValue = pulls[key];
            var plainValue = isPlainValue(pullValue);
            if (plainValue) {
                item[key] = item[key].filter(function(fieldItem) {
                    return fieldItem !== pullValue;
                });
            } else {
                var matchers = getQueryValueMatchers(key, pullValue);
                item[key] = item[key].filter(function(fieldItem) {
                    var dummy = {};
                    dummy[key] = fieldItem;
                    return !matchers.some(function(matcher) {
                        return matcher(dummy);
                    });
                });
            }
        });
    },

    // $each: function() {}, <- modifier

    $slice: function(_null, slices) {
        return createUpdateIterator(slices, function(key, item) {
            isArrayField(item, key);
            var sliceValue = slices[key];
            if (isPlainValue(sliceValue)) {
                item[key] = arraySlice(item[key], sliceValue);
            } else {
                var slicesKeys = Object.keys(sliceValue);
                item[key] = item[key].map(function(fieldItem) {
                    return slicesKeys.reduce(function(obj, slicesKey) {
                        obj[slicesKey] = arraySlice(obj[slicesKey], sliceValue[slicesKey]);
                        return obj;
                    }, fieldItem);
                });
            }
        });
    },

    $sort: function(_null, sortings) {
        return createUpdateIterator(sortings, function(key, item) {
            isArrayField(item, key);

            var sortValue = sortings[key];

            if (isPlainValue(sortValue)) {
                item[key] = item[key].sort(function(prev, next) {
                    return valueComparator(prev, next, sortValue);
                });
            } else {
                var res = item[key].slice();
                item[key] = Object.keys(sortValue).reduce(function(array, sortingValueKey) {
                    var direction = sortValue[sortingValueKey];
                    return res.sort(function(prev, next) {
                        var prevValue = prev[sortingValueKey];
                        var nextValue = next[sortingValueKey];
                        return valueComparator(prevValue, nextValue, direction);
                    });
                }, item[key]);
            }
        });
    }

};

var operators = {
    query: Object.keys(comparsionQueryOperatorsImpl),
    queryLogical: Object.keys(logicalQueryOperatorsImpl),
    update: Object.keys(updateOperatorsImpl)
};

var supportedUpdateOptions = ['upsert'];
var supportedUpsertOperators = ['$set', '$addToSet', '$push'];

var getMatcherSets = function(operator) {
    return Object.keys(operator).map(function(operatorKey) {
        return getQueryValueMatchers(operatorKey, operator[operatorKey]);
    }).reduce(concat);
};

var getQueryValueMatchers = function(itemKey, queryOperators) {
    return Object.keys(queryOperators).map(function(operatorKey) {
        return getOperatorImplementation({
            key: itemKey,
            type: operatorKey,
            value: queryOperators[operatorKey]
        });
    });
};

var createPlainPropertyMatcher = function(query, objectKeys) {
    var keys = objectKeys || Object.keys(query);
    return function(item) {
        return keys.every(function(key) {
            return has(item, key) && item[key] === query[key];
        });
    };
};

var createPlainPropertyUpdater = function(update, objectKeys) {
    var keys = objectKeys || Object.keys(update);
    return function(item) {
        keys.forEach(function(key) {
            if (has(item, key)) {
                item[key] = update[key];
            }
        });
    };
};

var createUpdateIterator = function(updates, iteratorCallback) {
    var keys = Object.keys(updates);
    return function(item) {
        keys.forEach(function(key) {
            iteratorCallback(key, item);
        });
    };
};

var createObjectForUpsert = function(query, update) {
    var plainQueryKeys = Object.keys(query).filter(function(key) {
        var hasPlainOperatorKey = has(comparsionQueryOperatorsImpl, key);
        var hasLogicalOperatorKey = has(logicalQueryOperatorsImpl, key);
        return !(hasPlainOperatorKey || hasLogicalOperatorKey);
    });

    var objectFromQuery = only(query, plainQueryKeys);

    var objectFromUpdate = supportedUpsertOperators.reduce(function(obj, operatorKey) {
        var updateItem = update[operatorKey];
        return assign(obj, updateItem);
    }, {});

    return assign(objectFromQuery, objectFromUpdate);
};

var chooseIndex = function(query, queryAnalysis) {
    var uniqueFieldIndex = -1;
    var numericFieldIndex = -1;
    var plainFieldIndex = -1;

    queryAnalysis.indexedKeys.forEach(function(indexedField, index) {
        if (indexedField.unique) {
            uniqueFieldIndex = index;
        } else if (typeof indexedField.value === 'number') {
            numericFieldIndex = index;
        } else if (indexedField.plain) {
            plainFieldIndex = index;
        }
    });

    if (uniqueFieldIndex > -1) {
        return queryAnalysis.indexedKeys[uniqueFieldIndex];
    }

    if (numericFieldIndex > -1) {
        return queryAnalysis.indexedKeys[numericFieldIndex];
    }

    return queryAnalysis.indexedKeys[plainFieldIndex];
};

var getQueryOperatorsFilters = function(queryAnalysis) {
    return queryAnalysis.queryOperators.advanced.map(function(operator) {

        return operator.operators.map(function(primitiveOperator) {
            return getOperatorImplementation({
                type: primitiveOperator,
                key: operator.key,
                value: operator.value[primitiveOperator]
            });
        });

    }).reduce(concat);
};

var getPropertyUpdaters = function(updateAnalysis) {
    return updateAnalysis.updateOperators.advanced.map(function(operator) {
        return getOperatorImplementation({
            type: operator.key,
            key: null,
            value: operator.value
        });
    });
};

var createAdvancedOperatorsMatcher = function(queryAnalysis) {
    var operatorsFilters = getQueryOperatorsFilters(queryAnalysis);
    return function(item) {
        return operatorsFilters.every(function(filter) {
            return filter(item);
        });
    };
};

var createAdvancedPropertyUpdater = function(updateAnalysis) {
    var updaters = getPropertyUpdaters(updateAnalysis);
    return function(item) {
        updaters.forEach(function(updater) {
            updater(item);
        });
    };
};

var getPlainKeys = function(queryAnalysis) {
    return queryAnalysis.queryOperators.plain.map(function(op) {
        return op.key;
    });
};

var executionPlans = {

    primaryKey: function(query, queryAnalysis, table) {
        var primaryKeyName = queryAnalysis.primaryKey.key;
        var primaryQueryValue = queryAnalysis.primaryKey.value;

        var collection = table.where(primaryKeyName).equals(primaryQueryValue);


        if (queryAnalysis.queryOperators.plain.length > 0) {
            var plainPropsMatcher = createPlainPropertyMatcher(query, getPlainKeys(queryAnalysis));
            collection.and(plainPropsMatcher);
        }

        if (queryAnalysis.queryOperators.advanced.length > 0) {
            var advancedOperatorsMatcher = createAdvancedOperatorsMatcher(queryAnalysis);
            collection.and(advancedOperatorsMatcher);
        }

        return collection;
    },

    indexedProp: function(query, queryAnalysis, table) {
        var index = chooseIndex(query, queryAnalysis);
        var collection;
        if (index && index.plain) {
            collection = table.where(index.key).equals(index.value);
        } else {
            collection = table.toCollection();
        }

        if (queryAnalysis.queryOperators.plain.length > 0) {
            var plainPropsMatcher = createPlainPropertyMatcher(query, getPlainKeys(queryAnalysis));
            collection.and(plainPropsMatcher);
        }

        if (queryAnalysis.queryOperators.advanced.length > 0) {
            var advancedOperatorsMatcher = createAdvancedOperatorsMatcher(queryAnalysis);
            collection.and(advancedOperatorsMatcher);
        }

        return collection;
    },

    fullScan: function(query, queryAnalysis, table) {
        var collection = table.toCollection();

        if (queryAnalysis.queryOperators.plain.length > 0) {
            var plainPropsMatcher = createPlainPropertyMatcher(query, getPlainKeys(queryAnalysis));
            collection.and(plainPropsMatcher);
        }

        if (queryAnalysis.queryOperators.advanced.length > 0) {
            var advancedOperatorsMatcher = createAdvancedOperatorsMatcher(queryAnalysis);
            collection.and(advancedOperatorsMatcher);
        }

        return collection;
    }

};

var createCollectionUpdater = function(update, updateAnalysis) {

    var plainUpdate = updateAnalysis.updateOperators.plain.length > 0;
    var advancedUpdate = updateAnalysis.updateOperators.advanced.length > 0;

    if (plainUpdate && advancedUpdate) {
        return noop; // do nothing
    }

    if (plainUpdate) {
        return createPlainPropertyUpdater(update, updateAnalysis.keys);
    }

    if (advancedUpdate) {
        return createAdvancedPropertyUpdater(updateAnalysis);
    }
};

var createInsertResult = function(insertedCount, options) {
    return {
        insertedCount: 1,
        insertedId: options.id,
        ops: [options.item],
        result: {
            ok: 1,
            n: 1
        }
    };
};

var createUpdateResult = function(updateCount, options) {
    var isUpsert = options && options.isUpsert === true;
    var modified = isUpsert ? 0 : updateCount;
    var upserted = isUpsert ? 1 : 0;
    return {
        result: {
            ok: 1,
            // nScanned: 0, TODO: Can we add this?
            nModified: modified
        },
        // matchedCount: 0, TODO: Can we add this?
        modifiedCount: modified,
        upsertedCount: upserted,
        upsertedId: isUpsert ? options.id : null
    };
};

var createDeleteResult = function(deletedCount) {
    return {
        result: {
            ok: 1,
            n: deletedCount
        },

        deletedCount: deletedCount
    };
};

var createUpsertModifier = function(table, query, update) {
    return new dexie.Promise(function(resolve) {
        return table.update(query, update).then(function(result) {
            if (result.modifiedCount === 0) {
                var newItem = createObjectForUpsert(query, update);
                return table.insert(newItem);
            }
            return dexie.Promise.resolve(result);
        }).then(function(result) {
            var finalResult = result;
            if (typeof result.insertedId === 'number') {
                finalResult = createUpdateResult(1, {
                    isUpsert: true,
                    id: result.insertedId
                });
            }
            return resolve(finalResult);
        });
    });
};

var createPlainModifier = function(table, query, update) {
    var updateAnalysis = analyseUpdates(update);
    var updater = createCollectionUpdater(update, updateAnalysis);
    return table.find(query).modify(updater).then(function(updatesCount) {
        return createUpdateResult(updatesCount, null);
    });
};

var getOperatorImplementation = function(operator) {

    var operatorsImpl;
    if (operators.query.indexOf(operator.type) > -1) {
        operatorsImpl = comparsionQueryOperatorsImpl;
    } else if (operators.queryLogical.indexOf(operator.type) > -1) {
        operatorsImpl = logicalQueryOperatorsImpl;
    } else if (operators.update.indexOf(operator.type) > -1) {
        operatorsImpl = updateOperatorsImpl;
    }
    return operatorsImpl[operator.type](operator.key, operator.value);
};

var getOperators = function(objectKind, keys, reducerMaker) {
    return keys.reduce(reducerMaker(objectKind, keys), {
        plain: [],
        advanced: []
    });
};

var createQueryOperatorsReducer = function(query) {
    return function(operatorsKinds, queryKey) {
        var queryValue = query[queryKey];
        var plainValue = isPlainValue(queryValue);
        var logicalOperator = operators.queryLogical.indexOf(queryKey) > -1;

        if (plainValue) {

            operatorsKinds.plain.push({
                key: queryKey,
                value: queryValue,
                plain: plainValue
            });

        } else if (logicalOperator) {

            var value = {};
            value[queryKey] = queryValue;
            operatorsKinds.advanced.push({
                key: queryKey,
                value: value,
                plain: plainValue,
                operators: [queryKey]
            });

        } else {

            operatorsKinds.advanced.push({
                key: queryKey,
                value: queryValue,
                plain: plainValue,
                operators: Object.keys(queryValue).filter(function(operatorKey) {
                    return operators.query.indexOf(operatorKey) > -1;
                })
            });

        }

        return operatorsKinds;
    };
};

var createUpdateOperatorsReducer = function(update) {
    return function(updateKinds, updateKey) {
        var updateValue = update[updateKey];
        var plainValue = isPlainValue(updateValue);

        if (plainValue) {

            updateKinds.plain.push({
                key: updateKey,
                value: updateValue,
                plain: plainValue
            });

        } else {

            updateKinds.advanced.push({
                key: updateKey,
                value: updateValue,
                plain: plainValue
            });

        }

        return updateKinds;
    };
};

var getQueryOperators = function(query, keys) {
    return getOperators(query, keys, createQueryOperatorsReducer);
};

var getUpdateOperators = function(update, keys) {
    return getOperators(update, keys, createUpdateOperatorsReducer);
};

var getQueryPrimaryKey = function(query, schema) {
    var keyName = schema.primKey.keyPath;
    var keyValue = query[keyName];
    var keyType = typeof keyValue;
    var hasPrimaryKey = keyType === 'number' || keyType === 'string';
    return hasPrimaryKey ? { key: keyName, value: keyValue } : { key: false };
};

var getQueryIndexedKeys = function(query, keys, schema) {
    return schema.indexes.filter(function(indexSpec) {
        return keys.indexOf(indexSpec.keyPath) > -1;
    }).map(function(indexSpec) {
        var key = indexSpec.keyPath;
        return {
            key: key,
            value: query[key],
            unique: indexSpec.unique,
            plain: isPlainValue(query[key])
        };
    });
};

var analyseQuery = function(query, schema) {
    var keys = Object.keys(query);

    return {
        keys: keys,
        queryOperators: getQueryOperators(query, keys),
        primaryKey: getQueryPrimaryKey(query, schema),
        indexedKeys: getQueryIndexedKeys(query, keys, schema)
    };
};

var analyseUpdates = function(update) {
    var keys = Object.keys(update);

    return {
        keys: keys,
        updateOperators: getUpdateOperators(update, keys)
    };
};

var analyseUpdateOptions = function(options) {
    if (isEmptyValue(options)) {
        return {};
    }

    return only(options, supportedUpdateOptions);
};

var chooseExecutuionPlan = function(query, schema) {

    var queryAnalysis = analyseQuery(query, schema);

    var plan;
    if (queryAnalysis.primaryKey.key) {
        plan = 'primaryKey';
    } else if (queryAnalysis.indexedKeys.length > 0) {
        plan = 'indexedProp';
    } else {
        plan = 'fullScan';
    }

    return {
        queryAnalysis: queryAnalysis,
        execute: executionPlans[plan]
    };
};

var performCollectionUpdate = function(table, query, update, options) {
    var updateModifier = options.upsert === true ? createUpsertModifier : createPlainModifier;
    return updateModifier(table, query, update);
};

var performFind = function(table, query) {
    if (isEmptyValue(query)) { return table.toCollection(); }
    var executionPlan = chooseExecutuionPlan(query, table.schema);
    return executionPlan.execute(query, executionPlan.queryAnalysis, table);
};

var performInsert = function(table, item) {
    var idKey = table.schema.primKey.keyPath;
    return table.add(item).then(function(id) {
        var newObj = only(item, Object.keys(item));
        newObj[idKey] = id;

        return createInsertResult(1, {
            item: item,
            id: id
        });
    });
};

var performRemove = function(table, query) {
    return performFind(table, query).delete().then(createDeleteResult);
};

var performDrop = function(table) {
    return table.toCollection().delete().then(createDeleteResult);
};

dexie.addons.push(function(db) {

    dexie.prototype.collection = function collection(collectionName) {
        return db.table(collectionName);
    };

    db.Table.prototype.count = function count(query) {
        var emptyQuery = isEmptyValue(query);
        var collection = emptyQuery ? this.toCollection() : performFind(this, query);
        return collection.count();
    };

    db.Table.prototype.find = function find(query) {
        return performFind(this, query);
    };

    db.Table.prototype.findOne = function findOne(query) {
        return performFind(this, query).first();
    };

    db.Table.prototype.insert = function insert(item) {
        return performInsert(this, item);
    };

    db.Table.prototype.remove = function remove(query) {
        return performRemove(this, query);
    };

    db.Table.prototype.drop = function drop() {
        return performDrop(this);
    };

    var WriteableTable;
    if (db.WriteableTable) {
        WriteableTable = db.WriteableTable;
    } else {
        WriteableTable = db.Table;
    }

    WriteableTable.prototype.update = function update(query, update, options) {
        var processedOptions = analyseUpdateOptions(options);
        return performCollectionUpdate(this, query, update, processedOptions);
    };
});
