"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.invertArray = invertArray;
exports.wrapAroundArray = wrapAroundArray;
/**
 * Invert an array into a Map that maps values to their original indexes
 *
 * Example:
 *
 * ```
 * > invertArray(['a', 'b', 'c'])
 * Map { 'a' => 0, 'b' => 1, 'c' => 2 }
 * ```
 * @param {[any]} array  The array to invert.
 */
function invertArray(array) {
  var inverse = new Map();
  array.forEach(function (value, index) {
    inverse.set(value, index);
  });
  return inverse;
}

/**
 * Wraps an array around by one element. Does not modify original array.
 *
 * Example:
 *
 * ```
 * > wrapAroundArray([1, 2, 3, 4])
 * [1, 2, 3, 4, 1]
 * ```
 *
 * @param {[any]} array  The array to wrap around.
 */
function wrapAroundArray(array) {
  var first = array[0];
  return array.concat(first);
}