'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

var _coordinate = require('../util/coordinate');

var _coordinate2 = _interopRequireDefault(_coordinate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// This class is not meant to exist for a while. Keeping state in this class is
// merely just a matter of convenience.
var GridRenderer = function () {
    function GridRenderer(config) {
        _classCallCheck(this, GridRenderer);

        this.config = config;

        this._rendered = false;
    }

    _createClass(GridRenderer, [{
        key: 'render',
        value: function render(rootSvg) {
            if (this._rendered) {
                throw new Error('GridRenderer has rendered and cannot render again.');
            }
            this._rendered = true;

            var appendGroup = function appendGroup(classSuffix) {
                return rootSvg.append('g').attr('class', 'flavor-wheel__' + classSuffix);
            };
            var ringGridGroup = appendGroup('ring-grid');
            var rayGridGroup = appendGroup('ray-grid');
            var labelsGroup = appendGroup('flavor-labels');

            this._drawRings(ringGridGroup);
            this._drawRays(rayGridGroup);
            this._drawLabels(labelsGroup);
        }
    }, {
        key: '_drawRings',
        value: function _drawRings(ringGrid) {
            var _this = this;

            var maxRating = this.config.maxRating;
            var radialSteps = d3.ticks(1, maxRating, maxRating - 1);

            ringGrid.selectAll('circle').data(radialSteps).enter().append('circle').attr('cx', 0).attr('cy', 0).attr('r', function (rating) {
                return _this.config.ratingRadialScale(rating);
            }).attr('class', 'ring-grid__circle');
        }
    }, {
        key: '_drawRays',
        value: function _drawRays(rayGrid) {
            var _config = this.config,
                maxRating = _config.maxRating,
                labels = _config.labels,
                ratingRadialScale = _config.ratingRadialScale,
                labelAngularScale = _config.labelAngularScale;


            var rayEndpoints = d3.ticks(0, labels.length - 1, labels.length).map(function (index) {
                var length = ratingRadialScale(maxRating);
                var angle = labelAngularScale(index);
                return _coordinate2.default.polar({ r: length, theta: angle });
            });

            rayGrid.selectAll('line').data(rayEndpoints).enter().append('line').attr('x1', 0).attr('y1', 0).attr('x2', function (coord) {
                return coord.svgX;
            }).attr('y2', function (coord) {
                return coord.svgY;
            }).attr('class', 'ray-grid__ray');
        }
    }, {
        key: '_drawLabels',
        value: function _drawLabels(labelGroup) {
            var _config2 = this.config,
                maxRating = _config2.maxRating,
                labels = _config2.labels,
                ratingRadialScale = _config2.ratingRadialScale,
                labelAngularScale = _config2.labelAngularScale;

            this._prerenderLabels(labelGroup);

            // Interpolate new circle to draw labels
            var labelRadius = ratingRadialScale(maxRating + 1);
            // We need to use the old-style pre-ES6 function to access the
            // D3 - bounded`this`
            labelGroup.selectAll('text').each(function (_ignored, i) {
                // Draw an imaginary line to the interpolated circle
                var theta = labelAngularScale(i);
                var labelCenter = _coordinate2.default.polar({ r: labelRadius, theta: theta });

                // Get handle to the self <text>
                var self = d3.select(this);
                // Access underlying DOM element to get rendered SVG bounding box

                var _self$node$getBBox = self.node().getBBox(),
                    width = _self$node$getBBox.width,
                    height = _self$node$getBBox.height;

                // Place the text box centered at intersection between line and
                // circle.
                // Label draw point is the top-left corner of the bounding box.
                // To move left, subtract from x coordinate.
                // To move up, add to y coordinate.


                var labelOrigin = _coordinate2.default.cartesian({
                    x: labelCenter.x - width / 2,
                    y: labelCenter.y + height / 2
                });

                // Move the <text> to the calculated origin. This doesn't move the <tspan>
                self.attr('x', labelOrigin.svgX).attr('y', labelOrigin.svgY);
                // Move each of the <tspan> elements
                self.selectAll('tspan').attr('x', labelOrigin.svgX);
            });
        }
    }, {
        key: '_prerenderLabels',
        value: function _prerenderLabels(labelGroup) {
            var config = this.config;
            var labels = config.labels;
            // There is no way to calculate the bounding box of a label until it
            // is actually drawn on the screen. Thus, pre-render the texts so that
            // we know how much space they take up.

            // First, render the <text> elements
            // https://bost.ocks.org/mike/nest/

            var labelTexts = labelGroup.selectAll('text').data(labels, function (label) {
                return config.getLabelIndex(label);
            }).enter().append('text').attr('class', 'flavor-labels__label');

            // Then, render each line in a label in its own <tspan>
            labelTexts.selectAll('tspan').data(function (label) {
                return label.split('\n');
            }).enter().append('tspan').attr('class', 'label__line').attr('x', 0).attr('dy', '1em').text(function (line) {
                return line;
            });
        }
    }]);

    return GridRenderer;
}();

exports.default = GridRenderer;