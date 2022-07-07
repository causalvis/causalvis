"use strict";

exports.__esModule = true;
exports.PropDistributionVis = void 0;

var _react = _interopRequireWildcard(require("react"));

var d3 = _interopRequireWildcard(require("d3"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var PropDistributionVis = function PropDistributionVis(_ref) {
  var _ref$layout = _ref.layout,
      layout = _ref$layout === void 0 ? {
    "height": 500,
    "width": 500,
    "margin": 50,
    "marginLeft": 50
  } : _ref$layout,
      _ref$bins = _ref.bins,
      bins = _ref$bins === void 0 ? {} : _ref$bins,
      _ref$n = _ref.n,
      n = _ref$n === void 0 ? {} : _ref$n,
      _ref$maxPropensity = _ref.maxPropensity,
      maxPropensity = _ref$maxPropensity === void 0 ? 1 : _ref$maxPropensity,
      setSelected = _ref.setSelected;

  // Track color map
  var _React$useState = _react["default"].useState({
    "treatment": "#6c8496",
    "outcome": "#f28e2c",
    "control": "#a1c5c0"
  }),
      colorMap = _React$useState[0],
      setColorMap = _React$useState[1]; // Track previous bar heights


  var _React$useState2 = _react["default"].useState(null),
      prevCBins = _React$useState2[0],
      setPrevCBins = _React$useState2[1];

  var _React$useState3 = _react["default"].useState(null),
      prevTBins = _React$useState3[0],
      setPrevTBins = _React$useState3[1];

  var ref = (0, _react.useRef)('svgPropDistribution');
  var transitionDuration = 1000;
  var svg = d3.select(ref.current);
  var svgElement = svg.select("g");
  (0, _react.useEffect)(function () {
    var newCBins = [];
    var newTBins = [];
    var xScale = d3.scaleLinear().domain([0, maxPropensity]).range([layout.marginLeft, layout.width - layout.margin]);
    var controlCount = n.CBins;
    var treatmentCount = n.TBins;
    var yMax = d3.max([d3.max(bins.TBins.map(function (d) {
      return d.length;
    })) / treatmentCount, d3.max(bins.CBins.map(function (d) {
      return d.length;
    })) / controlCount]); // Some hardcoding to ensure proper scaling on initialization;

    if (yMax === 0) {
      yMax = 1;
    }

    ;
    var yScaleTreatment = d3.scaleLinear().domain([0, yMax]).range([layout.height / 2, layout.height - layout.margin]);
    var yScaleControl = d3.scaleLinear().domain([0, yMax]).range([layout.height / 2, layout.margin]);
    var controlBars = svgElement.select("#bars").selectAll(".controlBars").data(bins.CBins).join("rect").attr("class", "controlBars").attr("x", function (d, i) {
      return xScale(d.x0);
    }).attr("y", function (d, i) {
      return prevCBins[i] ? prevCBins[i].y : yScaleControl(0);
    }).attr("width", function (d) {
      return xScale(d.x1) - xScale(d.x0) - 1;
    }).attr("height", function (d, i) {
      return prevCBins[i] ? prevCBins[i].height : 0;
    }).attr("fill", colorMap.control).attr("cursor", "pointer").on("click", function (e, d) {
      if (d3.select(this).attr("opacity") === "1") {
        setSelected({
          "selectedData": [],
          "treatment": false
        });
        controlBars.attr("opacity", null);
        treatmentBars.attr("opacity", null);
      } else {
        setSelected({
          "selectedData": d,
          "treatment": false
        });
        controlBars.attr("opacity", 0.5);
        treatmentBars.attr("opacity", 0.5);
        d3.select(this).attr("opacity", 1);
      }
    });
    controlBars.transition().duration(transitionDuration).ease(d3.easeLinear).attr("y", function (d, i) {
      newCBins[i] = {
        "y": yScaleControl(d.length / controlCount)
      };
      return yScaleControl(d.length / controlCount);
    }).attr("height", function (d, i) {
      newCBins[i].height = yScaleControl(0) - yScaleControl(d.length / controlCount);
      return yScaleControl(0) - yScaleControl(d.length / controlCount);
    });
    var treatmentBars = svgElement.select("#bars").selectAll(".treatmentBars").data(bins.TBins).join("rect").attr("class", "treatmentBars").attr("x", function (d, i) {
      return xScale(d.x0);
    }).attr("y", function (d, i) {
      return yScaleTreatment(0);
    }).attr("width", function (d) {
      return xScale(d.x1) - xScale(d.x0) - 1;
    }).attr("height", function (d, i) {
      return prevTBins[i] ? prevTBins[i].height : 0;
    }).attr("fill", colorMap.treatment).attr("cursor", "pointer").on("click", function (e, d) {
      if (d3.select(this).attr("opacity") === "1") {
        setSelected({
          "selectedData": [],
          "treatment": false
        });
        controlBars.attr("opacity", null);
        treatmentBars.attr("opacity", null);
      } else {
        setSelected({
          "selectedData": d,
          "treatment": true
        });
        controlBars.attr("opacity", 0.5);
        treatmentBars.attr("opacity", 0.5);
        d3.select(this).attr("opacity", 1);
      }
    });
    treatmentBars.transition().duration(transitionDuration).ease(d3.easeLinear).attr("height", function (d, i) {
      newTBins[i] = {
        "height": yScaleTreatment(d.length / treatmentCount) - yScaleTreatment(0)
      };
      return yScaleTreatment(d.length / treatmentCount) - yScaleTreatment(0);
    });
    var xAxis = svgElement.select('#x-axis').attr('transform', "translate(0, " + (layout.height - layout.margin) + ")").call(d3.axisBottom(xScale).tickSize(3).ticks(5));
    var yAxisTreatment = svgElement.select('#y-axistreatment').attr('transform', "translate(" + layout.marginLeft + ", 0)").call(d3.axisLeft(yScaleTreatment).tickSize(3).ticks(3));
    var yAxisControl = svgElement.select('#y-axiscontrol').attr('transform', "translate(" + layout.marginLeft + ", 0)").call(d3.axisLeft(yScaleControl).tickSize(3).ticks(3)); // controlBars.transition()
    //   .duration(transitionDuration)
    //   .ease(d3.easeLinear)
    //   .attr("y", d => yScaleControl(d.length / n))
    //   .attr("height", d => yScaleControl(0) - yScaleControl(d.length / n))
    // treatmentBars.transition()
    //   .duration(1000)
    //   .ease(d3.easeLinear)
    //   .attr("height", d =>  yScaleTreatment(d.length / n) - yScaleTreatment(0))

    svgElement.select("#legend").selectAll(".legend").data(["control", "treatment"]).join("rect").attr("class", "legend").attr("x", function (d, i) {
      return layout.width / 2 - 75 + 80 * i;
    }).attr("y", function (d, i) {
      return layout.margin - 16;
    }).attr("width", 12).attr("height", 12).attr("fill", function (d) {
      return colorMap[d];
    });
    svgElement.select("#legend").selectAll(".legendText").data(["control", "treatment"]).join("text").attr("class", "legendText").attr("x", function (d, i) {
      return layout.width / 2 - 75 + 80 * i + 18;
    }).attr("y", function (d, i) {
      return layout.margin - 10;
    }).attr("alignment-baseline", "middle").attr("text-anchor", "start").attr("fill", function (d) {
      return colorMap[d];
    }).attr("font-family", "sans-serif").attr("font-size", 12).text(function (d) {
      return d;
    });
    svgElement.select("#title").selectAll(".title").data(["Propensity Score Distribution Plot"]).join("text").attr("class", "title").attr("x", layout.width / 2).attr("y", layout.margin / 2).attr("text-anchor", "middle").attr("font-family", "sans-serif").attr("font-size", 12).text(function (d) {
      return d;
    });
    xAxis.transition().duration(1000).ease(d3.easeLinear).call(d3.axisBottom(xScale).tickSize(3).ticks(5));
    yAxisTreatment.transition().duration(1000).ease(d3.easeLinear).call(d3.axisLeft(yScaleTreatment).tickSize(3).ticks(3));
    yAxisControl.transition().duration(1000).ease(d3.easeLinear).call(d3.axisLeft(yScaleControl).tickSize(3).ticks(3));
    d3.selectAll("#x-axis>.tick>text").each(function (d, i) {
      d3.select(this).style("font-size", "12px");
    });
    d3.selectAll("#y-axistreatment>.tick>text").each(function (d, i) {
      d3.select(this).style("font-size", "12px");
    });
    d3.selectAll("#y-axiscontrol>.tick>text").each(function (d, i) {
      d3.select(this).style("font-size", "12px");
    });
    setPrevCBins([].concat(newCBins));
    setPrevTBins([].concat(newTBins));
  }, [bins]);
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("svg", {
    width: layout.width,
    height: layout.height,
    ref: ref,
    id: "svgPropDistribution"
  }, /*#__PURE__*/_react["default"].createElement("g", null, /*#__PURE__*/_react["default"].createElement("g", {
    id: "bars"
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "x-axis"
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "y-axistreatment"
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "y-axiscontrol"
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "legend"
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "title"
  }))));
};

exports.PropDistributionVis = PropDistributionVis;