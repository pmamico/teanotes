'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

var _arrays = require('../util/arrays');

var _preconditions = require('../common/preconditions');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FlavorWheelConfig = function () {
    /**
     * Creates a FlavorWheelConfig from an ad-hoc config object.
     *
     * @param {Object} config - The FlavorWheel configuration object.
     * @param {string[]} config.labels - List of labels. Must have at least
     *      one label.
     * @param {number} [config.maxRating] - Maximum rating. Defaults to 5.
     * @param {number} [config.gridRadius] - Radius of circular grid.
     *      Defaults to 250.
     * @param {number} [config.viewWidth] - View width of SVG. Is used to
     *      calculate the `viewWidth` attribute. Defaults to 800.
     */
    function FlavorWheelConfig(config) {
        _classCallCheck(this, FlavorWheelConfig);

        (0, _preconditions.mustExist)(config, 'a config object is required');
        (0, _preconditions.mustExist)(config.labels, 'config.labels must be specified');
        (0, _preconditions.checkState)(config.labels.length >= 1, 'config.labels must be non-empty');

        this.maxRating = config.maxRating || 5;
        this.gridRadius = config.gridRadius || 250;
        this.viewWidth = config.svgConfig || 800;

        this.labels = config.labels.slice(); // slice() to make a copy
        this._labelIndexes = (0, _arrays.invertArray)(config.labels);
    }

    _createClass(FlavorWheelConfig, [{
        key: 'getLabelIndex',


        /**
         * Return the index of a label in the configured list of labels.
         *
         * @param {string} label - Label to look up.
         * @returns {number} Index of the label.
         */
        value: function getLabelIndex(label) {
            return this._labelIndexes.get(label);
        }
    }, {
        key: 'viewBox',
        get: function get() {
            var viewWidth = this.viewWidth;
            return -viewWidth / 2 + ' ' + -viewWidth / 2 + ' ' + viewWidth + ' ' + viewWidth;
        }

        /**
         * Returns a linear scale mapping a rating to its radius in the circular grid.
         *
         * @returns {d3.scaleLinear}
         */

    }, {
        key: 'ratingRadialScale',
        get: function get() {
            if (!this._ratingRadialScale) {
                this._ratingRadialScale = d3.scaleLinear().domain([0, this.maxRating]).range([0, this.gridRadius]);
            }
            return this._ratingRadialScale;
        }

        /**
         * Returns a linear scale mapping a label's index to its angle in the grid.
         *
         * @returns {d3.scaleLinear}
         */

    }, {
        key: 'labelAngularScale',
        get: function get() {
            if (!this._labelAngularScale) {
                this._labelAngularScale = d3.scaleLinear()
                // Since this is on a circle, something on 2*pi rad will overlap
                // with 0 rad. Thus, the domain is 0 -> labels.length,
                // inclusive.
                .domain([0, this.labels.length]).range([0, 2 * Math.PI]);
            }
            return this._labelAngularScale;
        }
    }]);

    return FlavorWheelConfig;
}();

exports.default = FlavorWheelConfig;