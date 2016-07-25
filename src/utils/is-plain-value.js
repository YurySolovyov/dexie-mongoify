'use strict';
module.exports = function(value) {
    var type = typeof value;
    return type === 'number' || type === 'string' || type === 'boolean';
};
