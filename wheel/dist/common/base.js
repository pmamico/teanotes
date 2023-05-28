"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exists = exists;
exports.withDefault = withDefault;
// undefined can be redefined. A true undefined can be produced by not passing
// anything as an argument.
var undefined = function (undef) {
  return undef;
}();

function exists(value) {
  return !(value === null || value === undefined);
};

function withDefault(value, def) {
  return exists(value) ? value : def;
};