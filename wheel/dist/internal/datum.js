'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preconditions = require('../common/preconditions');

var _coordinate = require('../util/coordinate');

var _coordinate2 = _interopRequireDefault(_coordinate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Datum = function () {
    function Datum(config, label, value) {
        _classCallCheck(this, Datum);

        (0, _preconditions.mustExist)(config.getLabelIndex(label), 'Label "' + label + '" is invalid');

        this.label = label;
        this.value = value;

        this._config = config;
    }

    _createClass(Datum, [{
        key: 'coordinate',
        get: function get() {
            if (!this._coordinate) {
                var config = this._config;
                var index = config.getLabelIndex(this.label);

                var r = config.ratingRadialScale(this.value);
                var theta = config.labelAngularScale(index);

                this._coordinate = _coordinate2.default.polar({ r: r, theta: theta });
            }
            return this._coordinate;
        }
    }]);

    return Datum;
}();

exports.default = Datum;