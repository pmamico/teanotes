'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FlavorTown = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

var _datum = require('./internal/datum');

var _datum2 = _interopRequireDefault(_datum);

var _config = require('./internal/config');

var _config2 = _interopRequireDefault(_config);

var _gridRenderer = require('./internal/grid-renderer');

var _gridRenderer2 = _interopRequireDefault(_gridRenderer);

var _preconditions = require('./common/preconditions');

var _arrays = require('./util/arrays');

var _coordinate = require('./util/coordinate');

var _coordinate2 = _interopRequireDefault(_coordinate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FlavorWheel = function () {
    /**
     * Constructs a new FlavorWheel. This constructor does not initialize the
     * required SVG structure, and thus, the preferred way to create
     * a FlavorWheel is via the static `FlavorWheel.initialize` method.
     */
    function FlavorWheel(_ref) {
        var rootSvg = _ref.rootSvg,
            config = _ref.config;

        _classCallCheck(this, FlavorWheel);

        this.rootSvg = rootSvg;
        this.config = config;

        this.dataPointsGroup = rootSvg.select('.flavor-wheel__data-points');
        this.dataPolyGroup = rootSvg.select('.flavor-wheel__data-polyline');

        this.flavorProfiles = [];
    }

    /**
     * Initializes a FlavorWheel. This is the preferred way to create a
     * FlavorWheel. This sets up the required SVG elements to render a grid,
     * and returns a FlavorWheel object over the SVG.
     *
     * A typical invocation might look like this:
     *
     * ```js
     * const wheel = FlavorWheel.initialize("#wheel", {
     *   maxRating: 5,
     *   gridRadius: 250,
     *   viewWidth: 800,
     *   labels: ['smoky', 'berry\nfruit', 'bitter', 'sweet', 'sour', 'floral']
     * });
     * ```
     *
     * See documentation in flavor-wheel/internal/config.js for configuration
     * details.
     *
     * @param {(string|Element)} targetSelector - A selector string passed to
     *      `d3.select`. Can also be an Element. See documentation on
     *      `d3.select` for full details.
     * @param {object} config - An object literal containing configuration.
     * @returns {FlavorWheel}
     */


    _createClass(FlavorWheel, [{
        key: 'addData',


        /**
         * Adds a data set to render.
         *
         * The data set should be passed in as an array of `{ label, value }`
         * object literals.
         *
         * The `key` will be passed to D3 as the key for this data set. See
         * https://bost.ocks.org/mike/constancy/ for more information. To summarize,
         * this `key` uniquely identifies this data set, which also allows you to
         * use `addData` to update a data set as well.
         *
         * Usage example:
         *
         * ```js
         * const wheel = FlavorWheel.initialize("#wheel", config);
         * const data = [
         *   { label: 'salty', value: 1 },
         *   { label: 'spicy', value: 2 },
         *   { label: 'floral', value: 3 },
         *   { label: 'sour/tart', value: 4 },
         *   { label: 'sweet', value: 5 },
         *   { label: 'linger/\nfinish', value: 1 }
         * ];
         *
         * // Add data
         * wheel.addData(data, 'profile1');
         *
         * // Update data
         * // Note: this can be done with an entirely new data set.
         * data[2].value = 5;
         * wheel.addData(data, 'profile1');
         *
         * // Add entirely new data
         * wheel.addData(data, 'profile2');
         * ```
         *
         * @param {object[]} data - Array of data to add.
         * @param {string} key - Uniquely indentifiable string for this data set.
         * @param {string} [className] - HTML class name. Currently unused.
         */
        value: function addData(data, key) {
            var className = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

            (0, _preconditions.mustExist)(key);

            this._pushData(data, key, className);
            this._renderData();
        }
    }, {
        key: '_pushData',
        value: function _pushData(data, key) {
            var _this = this;

            var className = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

            data = data.map(function (_ref2) {
                var label = _ref2.label,
                    value = _ref2.value;
                return new _datum2.default(_this.config, label, value);
            });
            // _renderData() doesn't do anything explicit with the order of the
            // data, so here we sort according to the original order specified in
            // config.labels.
            data.sort(function (d1, d2) {
                var config = _this.config;
                var lIndex1 = config.getLabelIndex(d1.label);
                var lIndex2 = config.getLabelIndex(d2.label);
                return lIndex1 - lIndex2;
            });
            var existingData = this.flavorProfiles.find(function (profile) {
                return profile.key === key;
            });

            if (!existingData) {
                this.flavorProfiles.push({ data: data, key: key, className: className });
            } else {
                existingData.data = data;
                existingData.className = className;
            }
        }
    }, {
        key: '_renderData',
        value: function _renderData() {
            var config = this.config;
            var flavorProfiles = this.flavorProfiles;

            var polyPointGenerator = d3.line().x(function (datum) {
                return datum.coordinate.svgX;
            }).y(function (datum) {
                return datum.coordinate.svgY;
            });

            // https://bl.ocks.org/mbostock/3808218
            // First, rebind data and update existing paths with new data
            var dataPaths = this.dataPolyGroup.selectAll('path').data(flavorProfiles, function (profile) {
                return profile.key;
            });

            // Create new paths
            dataPaths.enter().append('path').attr('class', 'data-polyline__path')
            // And, together with the new paths, update from the newly bound data
            .merge(dataPaths).attr('d', function (profile) {
                return polyPointGenerator((0, _arrays.wrapAroundArray)(profile.data));
            });

            // Remove anything we removed. Not technically implemented yet.
            dataPaths.exit().remove();

            var pointGroups = this.dataPointsGroup.selectAll('g').data(flavorProfiles, function (profile) {
                return profile.key;
            });

            pointGroups.exit().remove();

            // Add new groups and merge it with existing groups so that we can
            // update the data binding for each new and existing point within
            // those groups.
            pointGroups = pointGroups.enter().append('g').attr('class', 'data-points__point-group').merge(pointGroups);

            var flavorPoints = pointGroups.selectAll('circle').data(function (profile) {
                return profile.data;
            });

            flavorPoints.enter().append('circle').attr('class', 'data-points__point').attr('r', 4).merge(flavorPoints).attr('cx', function (datum) {
                return datum.coordinate.svgX;
            }).attr('cy', function (datum) {
                return datum.coordinate.svgY;
            });

            flavorPoints.exit().remove();
        }
    }], [{
        key: 'initialize',
        value: function initialize(targetSelector, config) {
            config = new _config2.default(config);
            var rootSvg = FlavorWheel.renderBaseSvg(targetSelector, config);
            new _gridRenderer2.default(config).render(rootSvg);

            var appendGroup = function appendGroup(klass) {
                return rootSvg.append('g').attr('class', klass);
            };
            appendGroup('flavor-wheel__data-polyline');
            appendGroup('flavor-wheel__data-points');

            return new FlavorWheel({ rootSvg: rootSvg, config: config });
        }
    }, {
        key: 'renderBaseSvg',
        value: function renderBaseSvg(targetSelector, config) {
            return d3.select(targetSelector).attr('viewBox', config.viewBox).attr('version', '1.1').attr('baseProfile', 'full');
        }
    }]);

    return FlavorWheel;
}();

exports.default = FlavorWheel;
var FlavorTown = exports.FlavorTown = FlavorWheel;