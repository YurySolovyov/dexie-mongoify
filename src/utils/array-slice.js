'use strict';
module.exports = function arraySlice(array, slice) {
    if (slice >= 0) {
        return array.slice(0, slice);
    } else {
        return array.slice(slice);
    }
};
