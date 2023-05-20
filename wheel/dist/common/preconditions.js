'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mustExist = mustExist;
exports.checkState = checkState;

var _base = require('./base');

function mustExist(value, message) {
  if (!(0, _base.exists)(value)) {
    var error = new Error(message);
    error.name = 'NotExistError';
    throw error;
  }

  return value;
};

function checkState(condition, message) {
  if (!condition) {
    var error = new Error(message);
    error.name = 'StateError';
    throw error;
  }
};