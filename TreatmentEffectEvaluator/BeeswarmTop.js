"use strict";

exports.__esModule = true;
exports.BeeswarmTop = void 0;

var _react = _interopRequireWildcard(require("react"));

var d3 = _interopRequireWildcard(require("d3"));

var _Box = _interopRequireDefault(require("@mui/material/Box"));

var _Slider = _interopRequireDefault(require("@mui/material/Slider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var BeeswarmTop = function BeeswarmTop(_ref) {
  var _ref$layout = _ref.layout,
      layout = _ref$layout === void 0 ? {
    "height": 70,
    "width": 600,
    "margin": 15,
    "marginLeft": 20
  } : _ref$layout,
      _ref$data = _ref.data,
      data = _ref$data === void 0 ? [] : _ref$data,
      _ref$stratify = _ref.stratify,
      stratify = _ref$stratify === void 0 ? "" : _ref$stratify,
      _ref$thresholdValue = _ref.thresholdValue,
      thresholdValue = _ref$thresholdValue === void 0 ? 0 : _ref$thresholdValue,
      updateTopThreshold = _ref.updateTopThreshold,
      isBinary = _ref.isBinary;
  var ref = (0, _react.useRef)('svgBeeswarmTop');
  var svgElement = d3.select(ref.current); // Track color map

  var _React$useState = _react["default"].useState({
    1: "#698fb8",
    0: "#f0a856"
  }),
      colorMap = _React$useState[0],
      setColorMap = _React$useState[1]; // Jitter the coordinates of each point slightly along the x-axis


  var jitter = 20; // Set the slider step increment size to one-hundredth of variable extent

  var extent = d3.extent(data, function (d) {
    return d[stratify];
  });
  var step = (extent[1] - extent[0]) / 100;
  step = parseFloat(step.toPrecision(2)); // Update the threshold for faceting

  function handleChange(e, v) {
    updateTopThreshold(v);
  }

  var xScale;

  if (!isBinary) {
    xScale = d3.scaleLinear().domain(extent).range([layout.marginLeft, layout.width - layout.margin]);
  } else {
    xScale = d3.scaleLinear().domain([-0.5, 1.5]).range([layout.marginLeft, layout.width - layout.margin]);
  }

  var circles = svgElement.select("#points").selectAll(".dataPoint").data(data).join("circle").attr("class", "dataPoint").attr("transform", function (d) {
    return "translate(" + xScale(d[stratify]) + "," + (layout.height / 2 + (Math.random() - 0.5) * jitter) + ")";
  }).attr("r", 3).attr("fill", "#698fb8").attr("opacity", 0.2); // Visualize current threshold

  var thresholdStroke = svgElement.select("#threshold").attr("transform", "translate(" + xScale(thresholdValue) + ", 0)").attr("stroke", isBinary ? "none" : "black").attr("stroke-dasharray", "5 5 2 5");

  if (!isBinary) {
    svgElement.select('#x-axis').attr('transform', "translate(0, " + (layout.height - layout.margin) + ")").call(d3.axisBottom(xScale).tickSize(3));
  } else {
    svgElement.select('#x-axis').attr('transform', "translate(0, " + (layout.height - layout.margin) + ")").call(d3.axisBottom(xScale).tickSize(3).tickValues([0, 1]));
  }

  var subplotStyle = {
    "display": "flex",
    "flexDirection": "column",
    "alignItems": "center"
  };
  var subplotTitle = {
    "fontFamily": "sans-serif",
    "marginTop": "15px",
    "marginBottom": "0px",
    "fontSize": "15px"
  };
  var thresholdValueIndicator = {
    "display": "flex",
    "width": "100%",
    "justifyContent": "space-around",
    "fontFamily": "sans-serif"
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: subplotStyle
  }, /*#__PURE__*/_react["default"].createElement("p", {
    style: subplotTitle
  }, stratify), /*#__PURE__*/_react["default"].createElement("svg", {
    width: layout.width,
    height: layout.height,
    ref: ref,
    id: "svgBeeswarmTop"
  }, /*#__PURE__*/_react["default"].createElement("g", {
    id: "x-axis"
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "brush"
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "points"
  }), /*#__PURE__*/_react["default"].createElement("line", {
    id: "threshold",
    x1: 0,
    x2: 0,
    y1: layout.height - layout.margin,
    y2: 0
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "distribution"
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "title"
  })), isBinary ? /*#__PURE__*/_react["default"].createElement("div", null) : /*#__PURE__*/_react["default"].createElement(_Box["default"], {
    width: layout.width - layout.marginLeft - layout.margin
  }, /*#__PURE__*/_react["default"].createElement(_Slider["default"], {
    size: "small",
    min: d3.min(data, function (d) {
      return d[stratify];
    }),
    max: d3.max(data, function (d) {
      return d[stratify];
    }),
    step: step,
    defaultValue: thresholdValue,
    "aria-label": "Small",
    valueLabelDisplay: "auto",
    onChangeCommitted: function onChangeCommitted(e, v) {
      return handleChange(e, v);
    }
  })), /*#__PURE__*/_react["default"].createElement("div", {
    style: thresholdValueIndicator
  }, /*#__PURE__*/_react["default"].createElement("p", null, isBinary ? /*#__PURE__*/_react["default"].createElement("p", null) : "< " + thresholdValue), /*#__PURE__*/_react["default"].createElement("p", null, isBinary ? /*#__PURE__*/_react["default"].createElement("p", null) : ">= " + thresholdValue)));
};

exports.BeeswarmTop = BeeswarmTop;