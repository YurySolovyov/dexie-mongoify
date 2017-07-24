'use strict';

var maybeNumber = function(item) {
    var res = Number.parseInt(item);
    return Number.isNaN(res) ? item : res;
};

module.exports = function(obj, path, value) {
    var splitPath = path.split('.').map(maybeNumber);
    var lastKey = splitPath.pop();
    var preLast = splitPath.reduce(function(cur, node) {
        if (cur[node] === undefined) {
            cur[node] = {};
        }
        return cur[node];
    }, obj);

    preLast[lastKey] = value

    return obj;
};
