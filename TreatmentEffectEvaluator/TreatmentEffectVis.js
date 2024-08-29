"use strict";

exports.__esModule = true;
exports.TreatmentEffectVis = void 0;

var _react = _interopRequireWildcard(require("react"));

var _regression = _interopRequireDefault(require("regression"));

var d3 = _interopRequireWildcard(require("d3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var TreatmentEffectVis = function TreatmentEffectVis(_ref) {
  var _ref$allData = _ref.allData,
      allData = _ref$allData === void 0 ? {} : _ref$allData,
      _ref$index = _ref.index,
      index = _ref$index === void 0 ? 0 : _ref$index,
      _ref$treatment = _ref.treatment,
      treatment = _ref$treatment === void 0 ? "treatment" : _ref$treatment,
      _ref$outcome = _ref.outcome,
      outcome = _ref$outcome === void 0 ? "outcome" : _ref$outcome;
  var ref = (0, _react.useRef)('svgTreatmentEffect');
  var svg = d3.select("#svgTreatmentEffect" + index);
  var svgElement = svg.select("g"); // Track color map

  var _React$useState = _react["default"].useState({
    1: "#4e79a7",
    0: "#f28e2b"
  }),
      colorMap = _React$useState[0],
      setColorMap = _React$useState[1];

  var _React$useState2 = _react["default"].useState([]),
      cohortData = _React$useState2[0],
      setCohortData = _React$useState2[1];

  var _React$useState3 = _react["default"].useState(""),
      stratifyBy = _React$useState3[0],
      setStratifyBy = _React$useState3[1];

  var _React$useState4 = _react["default"].useState(false),
      isBinary = _React$useState4[0],
      setIsBinary = _React$useState4[1];

  var _React$useState5 = _react["default"].useState(""),
      plotTitle = _React$useState5[0],
      setPlotTitle = _React$useState5[1];

  var _React$useState6 = _react["default"].useState({
    "height": 500,
    "width": 600,
    "margin": 50,
    "marginLeft": 50
  }),
      layout = _React$useState6[0],
      setLayout = _React$useState6[1];

  var _React$useState7 = _react["default"].useState([[0, 0], [0, 0]]),
      treatmentReg = _React$useState7[0],
      setTreatmentReg = _React$useState7[1];

  var _React$useState8 = _react["default"].useState([[0, 0], [0, 0]]),
      controlReg = _React$useState8[0],
      setControlReg = _React$useState8[1];

  var _React$useState9 = _react["default"].useState([]),
      treatmentIQR = _React$useState9[0],
      setTreatmentIQR = _React$useState9[1];

  var _React$useState10 = _react["default"].useState([]),
      controlIQR = _React$useState10[0],
      setControlIQR = _React$useState10[1];

  function getIQR(dataset, tr, st) {
    var Q1 = d3.quantile(dataset, 0.25, function (d) {
      return d[outcome];
    });
    var Q2 = d3.quantile(dataset, 0.5, function (d) {
      return d[outcome];
    });
    var Q3 = d3.quantile(dataset, 0.75, function (d) {
      return d[outcome];
    });
    var IQR = Q3 - Q1;
    var IQRMin = Q1 - 1.5 * IQR;
    var IQRMax = Q3 + 1.5 * IQR;
    var outliers = dataset.filter(function (d) {
      return d[outcome] < IQRMin || d[outcome] > IQRMax;
    });
    return {
      "treatment": tr,
      "stratify": st,
      "Q1": Q1,
      "Q2": Q2,
      "Q3": Q3,
      "IQR": IQR,
      "IQRMin": IQRMin,
      "IQRMax": IQRMax,
      "outliers": outliers
    };
  }

  (0, _react.useEffect)(function () {
    var cohortData = allData["data"];
    var stratifyBy = allData["stratifyBy"];
    var isBinary = new Set(cohortData.map(function (d) {
      return d[stratifyBy];
    })).size === 2;
    setCohortData(cohortData);
    setStratifyBy(stratifyBy);
    setIsBinary(isBinary);
    setPlotTitle(allData["title"]);
    setLayout(allData["layout"]);
    var treatmentData = cohortData.filter(function (d) {
      return d[treatment] === 1;
    });
    var controlData = cohortData.filter(function (d) {
      return d[treatment] === 0;
    });

    if (isBinary) {
      var treatmentStratify0 = treatmentData.filter(function (d) {
        return d[stratifyBy] === 0;
      });
      var treatmentStratify1 = treatmentData.filter(function (d) {
        return d[stratifyBy] === 1;
      });
      var controlStratify0 = controlData.filter(function (d) {
        return d[stratifyBy] === 0;
      });
      var controlStratify1 = controlData.filter(function (d) {
        return d[stratifyBy] === 1;
      });
      var newTreatmentIQR = [getIQR(treatmentStratify0, 1, 0), getIQR(treatmentStratify1, 1, 1)];
      var newControlIQR = [getIQR(controlStratify0, 0, 0), getIQR(controlStratify1, 0, 1)];
      setTreatmentIQR(newTreatmentIQR);
      setControlIQR(newControlIQR);
    } else {
      var treatmentLine = _regression["default"].linear(treatmentData.map(function (d) {
        return [d[stratifyBy], d[outcome]];
      }));

      var controlLine = _regression["default"].linear(controlData.map(function (d) {
        return [d[stratifyBy], d[outcome]];
      }));

      var extent = d3.extent(cohortData, function (d) {
        return d[stratifyBy];
      });
      var treatmentStart = treatmentLine.predict(extent[0]);
      var treatmentEnd = treatmentLine.predict(extent[1]);
      var controlStart = controlLine.predict(extent[0]);
      var controlEnd = controlLine.predict(extent[1]);
      setTreatmentReg([treatmentStart, treatmentEnd]);
      setControlReg([controlStart, controlEnd]);
    }
  }, [allData]);
  (0, _react.useEffect)(function () {
    var jitter = 15;

    if (isBinary) {
      var xScale = d3.scaleBand().domain([0, 1]).range([layout.marginLeft, layout.width - layout.margin]);
      var yMin = d3.min([d3.min(treatmentIQR, function (d) {
        return d.IQRMin;
      }), d3.min(controlIQR, function (d) {
        return d.IQRMin;
      }), d3.min(cohortData, function (d) {
        return d[outcome];
      })]);
      var yScale = d3.scaleLinear().domain([yMin, d3.max(cohortData, function (d) {
        return d.outcome;
      })]).range([layout.height - layout.marginBottom, layout.margin]);
      var computedBandwidth = xScale.bandwidth();
      var customBandwidth = layout.width / 8;
      var outcomesTreatmentConnectMinMax = svgElement.select("#outcomes").selectAll(".outcomeConnectTreatment").data(treatmentIQR).join("line").attr("class", "outcomeConnectTreatment").attr("x1", function (d) {
        return xScale(d.stratify) + computedBandwidth / 2 - customBandwidth / 2 - 10;
      }).attr("y1", function (d) {
        return yScale(d["IQRMax"]);
      }).attr("x2", function (d) {
        return xScale(d.stratify) + computedBandwidth / 2 - customBandwidth / 2 - 10;
      }).attr("y2", function (d) {
        return yScale(d["IQRMin"]);
      }).attr("stroke", "black").attr("stroke-width", 2);
      var outcomesTreatment = svgElement.select("#outcomes").selectAll(".outcomeBlockTreatment").data(treatmentIQR).join("rect").attr("class", "outcomeBlockTreatment").attr("x", function (d) {
        return xScale(d.stratify) + computedBandwidth / 2 - customBandwidth - 10;
      }).attr("y", function (d) {
        return yScale(d["Q3"]);
      }).attr("width", customBandwidth).attr("height", function (d) {
        return yScale(d.Q1) - yScale(d.Q3);
      }).attr("fill", function (d) {
        return colorMap[d.treatment];
      });
      var outcomesTreatmentMean = svgElement.select("#outcomes").selectAll(".outcomeMeanTreatment").data(treatmentIQR).join("line").attr("class", "outcomeMeanTreatment").attr("x1", function (d) {
        return xScale(d.stratify) + computedBandwidth / 2 - customBandwidth - 10;
      }).attr("y1", function (d) {
        return yScale(d["Q2"]);
      }).attr("x2", function (d) {
        return xScale(d.stratify) + computedBandwidth / 2 - 10;
      }).attr("y2", function (d) {
        return yScale(d["Q2"]);
      }).attr("stroke", function (d) {
        return yScale(d.Q1) - yScale(d.Q3) === 0 ? colorMap[d.treatment] : "white";
      }).attr("stroke-width", 1);
      var outcomesTreatmentOutlierStratify0 = svgElement.select("#outcomes").selectAll(".outcomesTreatmentOutlierStratify0").data(treatmentIQR[0].outliers).join("circle").attr("class", "outcomesTreatmentOutlierStratify0").attr("cx", function (d) {
        return xScale(0) + computedBandwidth / 2 - 10 - customBandwidth / 2 + (Math.random() - 0.5) * jitter;
      }).attr("cy", function (d) {
        return yScale(d[outcome]);
      }).attr("r", 3).attr("fill", "none").attr("stroke", function (d) {
        return colorMap[d.treatment];
      });
      var outcomesTreatmentOutlierStratify1 = svgElement.select("#outcomes").selectAll(".outcomesTreatmentOutlierStratify1").data(treatmentIQR[1].outliers).join("circle").attr("class", "outcomesTreatmentOutlierStratify1").attr("cx", function (d) {
        return xScale(1) + computedBandwidth / 2 - 10 - customBandwidth / 2 + (Math.random() - 0.5) * jitter;
      }).attr("cy", function (d) {
        return yScale(d[outcome]);
      }).attr("r", 3).attr("fill", "none").attr("stroke", function (d) {
        return colorMap[d.treatment];
      });
      var outcomesTreatmentMin = svgElement.select("#outcomes").selectAll(".outcomeMinTreatment").data(treatmentIQR).join("line").attr("class", "outcomeMinTreatment").attr("x1", function (d) {
        return xScale(d.stratify) + computedBandwidth / 2 - customBandwidth / 2 - 20;
      }).attr("y1", function (d) {
        return yScale(d["IQRMin"]);
      }).attr("x2", function (d) {
        return xScale(d.stratify) + computedBandwidth / 2 - customBandwidth / 2;
      }).attr("y2", function (d) {
        return yScale(d["IQRMin"]);
      }).attr("stroke", "black").attr("stroke-width", 2);
      var outcomesTreatmentMax = svgElement.select("#outcomes").selectAll(".outcomeMaxTreatment").data(treatmentIQR).join("line").attr("class", "outcomeMaxTreatment").attr("x1", function (d) {
        return xScale(d.stratify) + computedBandwidth / 2 - customBandwidth / 2 - 20;
      }).attr("y1", function (d) {
        return yScale(d["IQRMax"]);
      }).attr("x2", function (d) {
        return xScale(d.stratify) + computedBandwidth / 2 - customBandwidth / 2;
      }).attr("y2", function (d) {
        return yScale(d["IQRMax"]);
      }).attr("stroke", "black").attr("stroke-width", 2);
      var outcomesControlConnectMinMax = svgElement.select("#outcomes").selectAll(".outcomeConnectControl").data(controlIQR).join("line").attr("class", "outcomeConnectControl").attr("x1", function (d) {
        return xScale(d.stratify) + computedBandwidth / 2 + customBandwidth / 2 + 10;
      }).attr("y1", function (d) {
        return yScale(d["IQRMax"]);
      }).attr("x2", function (d) {
        return xScale(d.stratify) + computedBandwidth / 2 + customBandwidth / 2 + 10;
      }).attr("y2", function (d) {
        return yScale(d["IQRMin"]);
      }).attr("stroke", "black").attr("stroke-width", 2);
      var outcomesControl = svgElement.select("#outcomes").selectAll(".outcomeBlockControl").data(controlIQR).join("rect").attr("class", "outcomeBlockControl").attr("x", function (d) {
        return xScale(d.stratify) + computedBandwidth / 2 + 10;
      }).attr("y", function (d) {
        return yScale(d.Q3);
      }).attr("width", customBandwidth).attr("height", function (d) {
        return yScale(d.Q1) - yScale(d.Q3);
      }).attr("fill", function (d) {
        return colorMap[d.treatment];
      });
      var outcomesControlMean = svgElement.select("#outcomes").selectAll(".outcomeMeanControl").data(controlIQR).join("line").attr("class", "outcomeMeanControl").attr("x1", function (d) {
        return xScale(d.stratify) + computedBandwidth / 2 + 10;
      }).attr("y1", function (d) {
        return yScale(d["Q2"]);
      }).attr("x2", function (d) {
        return xScale(d.stratify) + computedBandwidth / 2 + 10 + customBandwidth;
      }).attr("y2", function (d) {
        return yScale(d["Q2"]);
      }).attr("stroke", function (d) {
        return yScale(d.Q1) - yScale(d.Q3) === 0 ? colorMap[d.treatment] : "white";
      }).attr("stroke-width", 1);
      var outcomesControlOutlierStratify0 = svgElement.select("#outcomes").selectAll(".outcomesControlOutlierStratify0").data(controlIQR[0].outliers).join("circle").attr("class", "outcomesTreatmentOutlierStratify0").attr("cx", function (d) {
        return xScale(0) + computedBandwidth / 2 + 10 + customBandwidth / 2 + (Math.random() - 0.5) * jitter;
      }).attr("cy", function (d) {
        return yScale(d[outcome]);
      }).attr("r", 3).attr("fill", "none").attr("stroke", function (d) {
        return colorMap[d.treatment];
      });
      var outcomesControlOutlierStratify1 = svgElement.select("#outcomes").selectAll(".outcomesControlOutlierStratify1").data(controlIQR[1].outliers).join("circle").attr("class", "outcomesTreatmentOutlierStratify1").attr("cx", function (d) {
        return xScale(1) + computedBandwidth / 2 + 10 + customBandwidth / 2 + (Math.random() - 0.5) * jitter;
      }).attr("cy", function (d) {
        return yScale(d[outcome]);
      }).attr("r", 3).attr("fill", "none").attr("stroke", function (d) {
        return colorMap[d.treatment];
      });
      var outcomesControlMin = svgElement.select("#outcomes").selectAll(".outcomeMinControl").data(controlIQR).join("line").attr("class", "outcomeMinControl").attr("x1", function (d) {
        return xScale(d.stratify) + computedBandwidth / 2 + customBandwidth / 2;
      }).attr("y1", function (d) {
        return yScale(d["IQRMin"]);
      }).attr("x2", function (d) {
        return xScale(d.stratify) + computedBandwidth / 2 + customBandwidth / 2 + 20;
      }).attr("y2", function (d) {
        return yScale(d["IQRMin"]);
      }).attr("stroke", "black").attr("stroke-width", 2);
      var outcomesControlMax = svgElement.select("#outcomes").selectAll(".outcomeMaxControl").data(controlIQR).join("line").attr("class", "outcomeMaxControl").attr("x1", function (d) {
        return xScale(d.stratify) + computedBandwidth / 2 + customBandwidth / 2;
      }).attr("y1", function (d) {
        return yScale(d["IQRMax"]);
      }).attr("x2", function (d) {
        return xScale(d.stratify) + computedBandwidth / 2 + customBandwidth / 2 + 20;
      }).attr("y2", function (d) {
        return yScale(d["IQRMax"]);
      }).attr("stroke", "black").attr("stroke-width", 2);
      var xAxis = svgElement.select('#x-axis').attr('transform', "translate(0, " + (layout.height - layout.marginBottom) + ")").call(d3.axisBottom(xScale).tickSize(3).ticks(5));
    } else {
      var xScale = d3.scaleLinear().domain(d3.extent(cohortData, function (d) {
        return d[stratifyBy];
      })).range([layout.marginLeft, layout.width - layout.margin]);
      var yScale = d3.scaleLinear().domain(d3.extent(cohortData, function (d) {
        return d[outcome];
      })).range([layout.height - layout.marginBottom, layout.margin]);
      var outcomes = svgElement.select("#outcomes").selectAll(".outcomeCircles").data(cohortData).join("circle").attr("class", "outcomeCircles").attr("cx", function (d) {
        return xScale(d[stratifyBy]) + (Math.random() - 0.5) * jitter;
      }).attr("cy", function (d) {
        return yScale(d[outcome]);
      }).attr("r", 3).attr("fill", "none").attr("stroke", function (d) {
        return colorMap[d[treatment]];
      }).attr("cursor", "pointer");
      var regressionLines = svgElement.select("#regression").selectAll(".regressionLine").data([treatmentReg, controlReg]).join("line").attr("class", "regressionLine").attr("x1", function (d) {
        return xScale(d[0][0]);
      }).attr("y1", function (d) {
        return yScale(d[0][1]);
      }).attr("x2", function (d) {
        return xScale(d[1][0]);
      }).attr("y2", function (d) {
        return yScale(d[1][1]);
      }).attr("stroke", "black");

      var _xAxis = svgElement.select('#x-axis').attr('transform', "translate(0, " + (layout.height - layout.marginBottom) + ")").call(d3.axisBottom(xScale).tickSize(3).ticks(5));
    }

    svgElement.select('#x-axis').selectAll("#axis-title").data([stratifyBy]).join("text").attr("id", "axis-title").attr("x", layout.width / 2).attr("y", 30).attr("text-anchor", "middle").attr("fill", "black").attr("font-size", "15px").text(function (d) {
      return d;
    });
    svgElement.select('#y-axis').selectAll("#axis-title").data(["outcome"]).join("text").attr("id", "axis-title").attr("text-anchor", "middle").attr("transform", "translate(" + (layout.marginLeft - 5) + ", " + layout.height / 2 + ") rotate(-90)").attr("fill", "black").attr("font-size", "15px").text(function (d) {
      return d;
    });
    d3.selectAll("#x-axis>.tick>text").each(function (d, i) {
      d3.select(this).style("font-size", "12px");
    });
    var yAxis = svgElement.select('#y-axis').attr('transform', "translate(" + layout.marginLeft + ", 0)").call(d3.axisLeft(yScale).tickSize(3).ticks(5));
    d3.selectAll("#y-axis>.tick>text").each(function (d, i) {
      d3.select(this).style("font-size", "12px");
    });
  }, [cohortData, stratifyBy, isBinary, layout]);
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
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: subplotStyle
  }, /*#__PURE__*/_react["default"].createElement("svg", {
    width: layout.width,
    height: layout.height,
    id: "svgTreatmentEffect" + index
  }, /*#__PURE__*/_react["default"].createElement("g", null, /*#__PURE__*/_react["default"].createElement("g", {
    id: "x-axis"
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "y-axis"
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "outcomes"
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "regression"
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "title"
  }))));
};

exports.TreatmentEffectVis = TreatmentEffectVis;