module.exports = function median(array) {
    array.sort(function(a, b) {
        return a - b;
    });
    var mid = array.length / 2;
    return mid % 1 ? array[mid - 0.5] : (array[mid - 1] + array[mid]) / 2;
}