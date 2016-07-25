'use strict';
var has = require('./has');
module.exports = function isArrayField(value, key) {
    var hasField = has(value, key);
    var isArray = Array.isArray(value[key]);

    if (hasField && !isArray) {
        throw new Error('You can\'t use array update operator on non-array field');
    }
    return hasField;
};
