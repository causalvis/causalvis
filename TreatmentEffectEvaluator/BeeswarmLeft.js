"use strict";

exports.__esModule = true;
exports.BeeswarmLeft = void 0;

var _react = _interopRequireWildcard(require("react"));

var d3 = _interopRequireWildcard(require("d3"));

var _Box = _interopRequireDefault(require("@mui/material/Box"));

var _Slider = _interopRequireDefault(require("@mui/material/Slider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var BeeswarmLeft = function BeeswarmLeft(_ref) {
  var _ref$layout = _ref.layout,
      layout = _ref$layout === void 0 ? {
    "height": 600,
    "width": 80,
    "margin": 30,
    "marginLeft": 10,
    "marginBottom": 30
  } : _ref$layout,
      _ref$data = _ref.data,
      data = _ref$data === void 0 ? [] : _ref$data,
      _ref$stratify = _ref.stratify,
      stratify = _ref$stratify === void 0 ? "" : _ref$stratify,
      _ref$thresholdValue = _ref.thresholdValue,
      thresholdValue = _ref$thresholdValue === void 0 ? 0 : _ref$thresholdValue,
      updateLeftThreshold = _ref.updateLeftThreshold,
      isBinary = _ref.isBinary;
  var ref = (0, _react.useRef)('svgBeeswarmLeft');
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
    updateLeftThreshold(v);
  }

  var yScale;

  if (!isBinary) {
    yScale = d3.scaleLinear().domain(extent).range([layout.height - layout.marginBottom, layout.margin]);
  } else {
    yScale = d3.scaleLinear().domain([-0.5, 1.5]).range([layout.height - layout.marginBottom, layout.margin]);
  }

  var circles = svgElement.select("#points").selectAll(".dataPoint").data(data).join("circle").attr("class", "dataPoint").attr("transform", function (d) {
    return "translate(" + (layout.width / 2 + (Math.random() - 0.5) * jitter) + "," + yScale(d[stratify]) + ")";
  }).attr("r", 3).attr("fill", "#698fb8").attr("opacity", 0.2); // Visualize current threshold

  var thresholdStroke = svgElement.select("#threshold").attr("transform", "translate(0, " + yScale(thresholdValue) + ")").attr("stroke", isBinary ? "none" : "black").attr("stroke-dasharray", "5 5 2 5");

  if (!isBinary) {
    svgElement.select('#y-axis').attr('transform', "translate(" + (layout.width - layout.margin) + ", 0)").call(d3.axisRight(yScale).tickSize(3));
  } else {
    svgElement.select('#y-axis').attr('transform', "translate(" + (layout.width - layout.margin) + ", 0)").call(d3.axisRight(yScale).tickSize(3).tickValues([0, 1]));
  }

  var subplotStyle = {
    "display": "flex",
    "alignItems": "center"
  };
  var subplotTitle = {
    "writingMode": "vertical-rl",
    "transform": "rotate(-180deg)",
    "fontFamily": "sans-serif",
    "marginTop": "15px",
    "marginBottom": "0px",
    "fontSize": "15px"
  };
  var thresholdValueIndicator = {
    "display": "flex",
    "flexDirection": "column",
    "height": "600px",
    "justifyContent": "space-around"
  };
  var thresholdText = {
    "writingMode": "vertical-rl",
    "transform": "rotate(-180deg)",
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
    id: "svgBeeswarmLeft"
  }, /*#__PURE__*/_react["default"].createElement("g", {
    id: "y-axis"
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "brush"
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "points"
  }), /*#__PURE__*/_react["default"].createElement("line", {
    id: "threshold",
    y1: 0,
    y2: 0,
    x1: layout.width - layout.margin,
    x2: 0
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "distribution"
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "title"
  })), isBinary ? /*#__PURE__*/_react["default"].createElement("div", null) : /*#__PURE__*/_react["default"].createElement(_Box["default"], {
    height: layout.height - layout.margin * 2
  }, /*#__PURE__*/_react["default"].createElement(_Slider["default"], {
    sx: {
      '& input[type="range"]': {
        WebkitAppearance: 'slider-vertical'
      }
    },
    orientation: "vertical",
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
  }, /*#__PURE__*/_react["default"].createElement("p", {
    style: thresholdText
  }, isBinary ? /*#__PURE__*/_react["default"].createElement("p", null) : ">= " + thresholdValue), /*#__PURE__*/_react["default"].createElement("p", {
    style: thresholdText
  }, isBinary ? /*#__PURE__*/_react["default"].createElement("p", null) : "< " + thresholdValue)));
};

exports.BeeswarmLeft = BeeswarmLeft;