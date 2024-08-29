"use strict";

exports.__esModule = true;
exports.CompareVersionsVis = void 0;

var _react = _interopRequireWildcard(require("react"));

var d3 = _interopRequireWildcard(require("d3"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var CompareVersionsVis = function CompareVersionsVis(_ref) {
  var _ref$layout = _ref.layout,
      layout = _ref$layout === void 0 ? {
    "height": 120,
    "width": 1200,
    "margin": 35,
    "marginLeft": 50,
    "marginBottom": 30
  } : _ref$layout,
      _ref$data = _ref.data,
      data = _ref$data === void 0 ? [] : _ref$data,
      _ref$stratifyBy = _ref.stratifyBy,
      stratifyBy = _ref$stratifyBy === void 0 ? "" : _ref$stratifyBy,
      colorScale = _ref.colorScale;

  var _React$useState = _react["default"].useState(data),
      ATE = _React$useState[0],
      setATE = _React$useState[1];

  var _React$useState2 = _react["default"].useState(stratifyBy),
      subGroup = _React$useState2[0],
      setSubGroup = _React$useState2[1];

  (0, _react.useEffect)(function () {
    setATE(data);
  }, [data]);
  (0, _react.useEffect)(function () {
    setSubGroup(stratifyBy);
  }, [stratifyBy]);
  var ref = (0, _react.useRef)('svgCompareVersionsVis');
  var svg = d3.select(ref.current);
  var svgElement = svg.select("g");
  (0, _react.useEffect)(function () {
    var ATEExtent = d3.extent(ATE, function (d) {
      return d.ATE;
    });
    var xScale = d3.scaleLinear().domain(d3.extent(ATE, function (d) {
      return d.ATE;
    })).range([layout.marginLeft, layout.width - layout.margin]);
    var yScale; // Create a tooltip

    var tooltip = d3.select("#tooltip").attr("opacity", 0);
    var tooltip_text = tooltip.select("#tooltip_text").attr("text-anchor", "middle").attr("alignment-baseline", "hanging").attr("x", "11").attr("y", "1").style("font-size", "11px").style("font-family", "sans-serif");

    if (stratifyBy != "") {
      yScale = d3.scaleOrdinal().domain(d3.extent(ATE, function (d) {
        return d.group;
      })).range([layout.margin + 10, layout.height - layout.margin - 10]);
    }

    if (ATEExtent[0] < 0 && ATEExtent[1] > 0) {
      svgElement.select("#ate").selectAll(".zeroLine").data([0]).join("line").attr("class", "zeroLine").attr("x1", function (d) {
        return xScale(0);
      }).attr("y1", layout.margin).attr("x2", function (d) {
        return xScale(0);
      }).attr("y2", layout.height - layout.margin).attr("stroke", "black").attr("stroke-dasharray", "5 5 2 5");
    }

    var atePoints = svgElement.select("#ate").selectAll(".atePoints").data(ATE).join("circle").attr("class", "atePoints").attr("cx", function (d) {
      return xScale(d.ATE);
    }).attr("cy", function (d) {
      return stratifyBy ? yScale(d.group) : layout.height / 2;
    }).attr("r", 5).attr("fill", function (d) {
      return colorScale(JSON.stringify(d.DAG));
    }).attr("opacity", "0.48").attr("cursor", "pointer").on("mouseover", function (e, d) {
      var dATE = d.ATE;
      var dgroup = d.group;
      var dname = d.name;
      tooltip.attr("opacity", 1).attr("transform", "translate(" + (xScale(d.ATE) - 11) + ", " + (stratifyBy ? yScale(dgroup) - 18 : layout.height / 2 - 18) + ")");
      tooltip_text.text("" + dname);
    }).on("mouseout", function () {
      tooltip.attr("opacity", 0);
    });
    svgElement.select("#x-axis").attr("transform", "translate(0, " + (layout.height - layout.margin + 10) + ")").call(d3.axisBottom(xScale).tickSize(3).ticks(5));
    svgElement.selectAll("#x-axis").selectAll(".axisText").data(["ATE"]).join("text").attr("class", "axisText").attr("transform", "translate(" + (layout.width - layout.margin) + ", " + 25 + ")").attr("font-family", "sans-serif").attr("fill", "black").text(function (d) {
      return d;
    });

    if (yScale) {
      svgElement.select('#y-axis').attr('opacity', 1).attr('transform', "translate(" + (layout.marginLeft - 10) + ", 0)").call(d3.axisLeft(yScale)).call(function (g) {
        return g.select(".domain").remove();
      });
    } else {
      svgElement.select('#y-axis').attr('opacity', 0);
    }
  }, [ATE, subGroup]);
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("svg", {
    width: layout.width,
    height: layout.height,
    ref: ref,
    id: "svgCompareVersionsVis"
  }, /*#__PURE__*/_react["default"].createElement("g", null, /*#__PURE__*/_react["default"].createElement("g", {
    id: "ate"
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "x-axis"
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "y-axis"
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "tooltip"
  }, /*#__PURE__*/_react["default"].createElement("rect", {
    id: "tooltip_rect"
  }), /*#__PURE__*/_react["default"].createElement("text", {
    id: "tooltip_text"
  })))));
};

exports.CompareVersionsVis = CompareVersionsVis;