var has = require('has');

module.exports = {
    isEmptyValue: function(value) {
        var isObj = typeof value === 'object' && value !== null;
        var isFalsy = !(isObj && value);
        return isFalsy || Object.keys(value).length === 0;
    },

    isPlainValue: function(value) {
        var type = typeof value;
        return type === 'number' || type === 'string' || type === 'boolean';
    },

    checkIsArrayField: function(value, key) {
        var hasField = has(value, key);
        var isArray = Array.isArray(value[key]);

        if (hasField && !isArray) {
            throw new Error('You can\'t use array update operator on non-array field');
        }
        return hasField;
    },

    sliceArray: function(array, slice) {
        if (slice >= 0) {
            return array.slice(0, slice);
        } else {
            return array.slice(slice);
        }
    },

    valueComparator: function(prev, next, direction) {
        return direction === 1 ? prev > next : prev < next;
    }
};
