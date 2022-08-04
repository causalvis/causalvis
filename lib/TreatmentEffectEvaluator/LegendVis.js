"use strict";

exports.__esModule = true;
exports.LegendVis = void 0;

var _react = _interopRequireWildcard(require("react"));

var d3 = _interopRequireWildcard(require("d3"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var LegendVis = function LegendVis(_ref) {
  var _ref$layout = _ref.layout,
      layout = _ref$layout === void 0 ? {
    "height": 20,
    "width": 600,
    "margin": 20,
    "marginLeft": 20
  } : _ref$layout;
  var ref = (0, _react.useRef)('svgLegendVis');
  var svgElement = d3.select(ref.current); // Track color map

  var _React$useState = _react["default"].useState({
    "treatment": "#4e79a7",
    "control": "#f28e2b"
  }),
      colorMap = _React$useState[0],
      setColorMap = _React$useState[1];

  var legend = svgElement.select("#legend").selectAll(".legendCircle").data(["treatment", "control"]).join("circle").attr("class", "legendCircle").attr("cx", function (d, i) {
    return layout.width / 2 - 80 + 115 * i;
  }).attr("cy", function (d) {
    return layout.height / 2;
  }).attr("r", 5).attr("fill", function (d) {
    return colorMap[d];
  });
  var legendText = svgElement.select("#legend").selectAll(".legendText").data(["treatment", "control"]).join("text").attr("class", "legendText").attr("x", function (d, i) {
    return layout.width / 2 - 80 + 115 * i + 10;
  }).attr("y", function (d) {
    return layout.height / 2;
  }).attr("fill", function (d) {
    return colorMap[d];
  }).text(function (d) {
    return d;
  }).attr("alignment-baseline", "middle").attr("text-anchor", "start").attr("font-family", "sans-serif").attr("font-size", 12);
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("svg", {
    width: layout.width,
    height: layout.height,
    ref: ref,
    id: "svgLegendVis"
  }, /*#__PURE__*/_react["default"].createElement("g", {
    id: "legend"
  })));
};

exports.LegendVis = LegendVis;