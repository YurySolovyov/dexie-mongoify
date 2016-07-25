'use strict';
module.exports = function valueComparator(prev, next, direction) {
  return direction === 1 ? prev > next : prev < next;
};
