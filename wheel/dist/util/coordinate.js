"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// undefined can be redefined. A true undefined can be produced by not passing
// anything as an argument.
var undefined = function (undef) {
    return undef;
}();

function exists(value) {
    return !(value === null || value === undefined);
}

var Coordinate = function () {
    function Coordinate(_ref) {
        var x = _ref.x,
            y = _ref.y,
            r = _ref.r,
            theta = _ref.theta;

        _classCallCheck(this, Coordinate);

        if (exists(x) && exists(y)) {
            this.x = x;
            this.y = y;

            this.r = Math.sqrt(x * x + y * y);
            this.theta = Math.atan2(y, x);
        } else if (exists(r) && exists(theta)) {
            this.r = r;
            this.theta = theta;

            this.x = r * Math.cos(theta);
            this.y = r * Math.sin(theta);
        } else {
            throw new Error("Invalid Coordinate arg " + JSON.stringify(coords));
        }
        this._throwIfInvalid();
    }

    _createClass(Coordinate, [{
        key: "toString",
        value: function toString() {
            return "{xy=(" + this.x + ", " + this.y + "), polar=(" + this.r + ", " + this.theta + " rad)}";
        }
    }, {
        key: "_throwIfInvalid",
        value: function _throwIfInvalid() {
            if (isNaN(this.x) || isNaN(this.y) || isNaN(this.r) || isNaN(this.theta)) {
                throw new Error("Bad coordinates given: " + this.toString());
            }
        }
    }, {
        key: "svgX",


        // Normalize for SVG coordinate system (origin is top-left)
        // When computing math, these properties should never be used. These should only
        // be accessed when setting positions for SVG elements.
        get: function get() {
            return this.x;
        }
    }, {
        key: "svgY",
        get: function get() {
            return -this.y;
        }
    }], [{
        key: "polar",
        value: function polar(_ref2) {
            var r = _ref2.r,
                theta = _ref2.theta;

            return new Coordinate({ r: r, theta: theta });
        }
    }, {
        key: "cartesian",
        value: function cartesian(_ref3) {
            var x = _ref3.x,
                y = _ref3.y;

            return new Coordinate({ x: x, y: y });
        }
    }]);

    return Coordinate;
}();

Coordinate.ORIGIN = Coordinate.cartesian({ x: 0, y: 0 });

exports.default = Coordinate;