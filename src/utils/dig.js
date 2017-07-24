'use strict';
module.exports = function(object, keys){
    return keys.split('.').reduce(function(obj, key) {
        var next = obj[key];
        return next === undefined ? obj : next;
    }, object);
};
