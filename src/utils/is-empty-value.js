module.exports = function isEmptyValue(value) {
    var isObj = typeof value === 'object' && value !== null;
    var isFalsy = !(isObj && value);
    return isFalsy || Object.keys(value).length === 0;
};
