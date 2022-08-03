"use strict";

exports.__esModule = true;
exports.CompareHistogramVis = void 0;

var _react = _interopRequireWildcard(require("react"));

var d3 = _interopRequireWildcard(require("d3"));

var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));

var _VisibilityOff = _interopRequireDefault(require("@mui/icons-material/VisibilityOff"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var CompareHistogramVis = function CompareHistogramVis(_ref) {
  var _ref$layout = _ref.layout,
      layout = _ref$layout === void 0 ? {
    "height": 120,
    "width": 500,
    "margin": 20,
    "marginLeft": 30
  } : _ref$layout,
      _ref$unadjustedAttrib = _ref.unadjustedAttribute,
      unadjustedAttribute = _ref$unadjustedAttrib === void 0 ? [] : _ref$unadjustedAttrib,
      adjustedAttribute = _ref.adjustedAttribute,
      _ref$unadjustedTreatm = _ref.unadjustedTreatment,
      unadjustedTreatment = _ref$unadjustedTreatm === void 0 ? [] : _ref$unadjustedTreatm,
      adjustedTreatment = _ref.adjustedTreatment,
      _ref$unadjustedPropen = _ref.unadjustedPropensity,
      unadjustedPropensity = _ref$unadjustedPropen === void 0 ? [] : _ref$unadjustedPropen,
      adjustedPropensity = _ref.adjustedPropensity,
      _ref$attribute = _ref.attribute,
      attribute = _ref$attribute === void 0 ? "" : _ref$attribute,
      updateFilter = _ref.updateFilter,
      _ref$selectedAttribut = _ref.selectedAttribute,
      selectedAttribute = _ref$selectedAttribut === void 0 ? [] : _ref$selectedAttribut,
      _ref$selectedTreatmen = _ref.selectedTreatment,
      selectedTreatment = _ref$selectedTreatmen === void 0 ? false : _ref$selectedTreatmen,
      hideCovariate = _ref.hideCovariate;

  var _React$useState = _react["default"].useState([]),
      unadjustedTreatmentData = _React$useState[0],
      setUnadjustedTreatmentData = _React$useState[1];

  var _React$useState2 = _react["default"].useState([]),
      unadjustedControlData = _React$useState2[0],
      setUnadjustedControlData = _React$useState2[1];

  var _React$useState3 = _react["default"].useState([]),
      adjustedTreatmentData = _React$useState3[0],
      setAdjustedTreatmentData = _React$useState3[1];

  var _React$useState4 = _react["default"].useState([]),
      adjustedControlData = _React$useState4[0],
      setAdjustedControlData = _React$useState4[1];

  var _React$useState5 = _react["default"].useState(function () {
    return function (x) {
      return x;
    };
  }),
      xScale = _React$useState5[0],
      setXScale = _React$useState5[1];

  var _React$useState6 = _react["default"].useState(function () {
    return function (y) {
      return y;
    };
  }),
      yScaleTreatment = _React$useState6[0],
      setYScaleTreatment = _React$useState6[1];

  var _React$useState7 = _react["default"].useState(function () {
    return function (y) {
      return y;
    };
  }),
      yScaleControl = _React$useState7[0],
      setYScaleControl = _React$useState7[1];

  var _React$useState8 = _react["default"].useState(false),
      iconShow = _React$useState8[0],
      setIconShow = _React$useState8[1];

  var bins = 2; // Track color map

  var _React$useState9 = _react["default"].useState({
    "treatment": "#bf99ba",
    "outcome": "#f28e2c",
    "control": "#a5c8d4"
  }),
      colorMap = _React$useState9[0],
      setColorMap = _React$useState9[1]; // Show icon on hover


  function show(el) {
    setIconShow(true);
  } // Hide icon


  function hide(el) {
    setIconShow(false);
  }

  (0, _react.useEffect)(function () {
    var treatment = unadjustedAttribute.filter(function (r, i) {
      return unadjustedTreatment[i] === 1;
    });
    var control = unadjustedAttribute.filter(function (r, i) {
      return unadjustedTreatment[i] === 0;
    });
    var allPropensity = unadjustedPropensity.map(function (p, i) {
      return p[unadjustedTreatment[i]];
    });
    var controlPropensity = allPropensity.filter(function (r, i) {
      return unadjustedTreatment[i] === 0;
    });
    var treatmentPropensity = allPropensity.filter(function (r, i) {
      return unadjustedTreatment[i] === 1;
    });
    var controlIPW = controlPropensity.map(function (p) {
      return 1 / p;
    });
    var treatmentIPW = treatmentPropensity.map(function (p) {
      return 1 / p;
    }); // Zip attribute values with weight for each data instance

    treatment = treatment.map(function (t, i) {
      return [t, treatmentIPW[i]];
    });
    control = control.map(function (c, i) {
      return [c, controlIPW[i]];
    });
    setUnadjustedTreatmentData([].concat(treatment));
    setUnadjustedControlData([].concat(control));
  }, [unadjustedAttribute]);
  (0, _react.useEffect)(function () {
    if (adjustedAttribute && adjustedPropensity && adjustedTreatment) {
      var treatment = adjustedAttribute.filter(function (r, i) {
        return adjustedTreatment[i] === 1;
      });
      var control = adjustedAttribute.filter(function (r, i) {
        return adjustedTreatment[i] === 0;
      });
      var allPropensity = adjustedPropensity.map(function (p, i) {
        return p[adjustedTreatment[i]];
      });
      var controlPropensity = allPropensity.filter(function (r, i) {
        return adjustedTreatment[i] === 0;
      });
      var treatmentPropensity = allPropensity.filter(function (r, i) {
        return adjustedTreatment[i] === 1;
      });
      var controlIPW = controlPropensity.map(function (p) {
        return 1 / p;
      });
      var treatmentIPW = treatmentPropensity.map(function (p) {
        return 1 / p;
      }); // Zip attribute values with weight for each data instance

      treatment = treatment.map(function (t, i) {
        return [t, treatmentIPW[i]];
      });
      control = control.map(function (c, i) {
        return [c, controlIPW[i]];
      });
      setAdjustedTreatmentData([].concat(treatment));
      setAdjustedControlData([].concat(control));
    }
  }, [adjustedAttribute, adjustedPropensity, adjustedTreatment]);
  var newRef = "svgCompare" + attribute;
  var ref = (0, _react.useRef)("svgCompare");
  var svg = d3.select(ref.current);
  var svgElement = svg.select("g"); // Get max values for yScale

  function getMaxProportion(TBins, CBins, unadjustedCCount, unadjustedTCount, adjustedCCount, adjustedTCount) {
    var currentMax = 0;

    for (var _iterator = _createForOfIteratorHelperLoose(TBins), _step; !(_step = _iterator()).done;) {
      var d = _step.value;
      var proportion = d.length / unadjustedTCount;
      var weightedProportion = d3.sum(d, function (d) {
        return d[1];
      }) / adjustedTCount;
      var max = d3.max([proportion, weightedProportion]);

      if (max > currentMax) {
        currentMax = max;
      }
    }

    for (var _iterator2 = _createForOfIteratorHelperLoose(CBins), _step2; !(_step2 = _iterator2()).done;) {
      var _d = _step2.value;

      var _proportion = _d.length / unadjustedCCount;

      var _weightedProportion = d3.sum(_d, function (d) {
        return d[1];
      }) / adjustedCCount;

      var _max = d3.max([_proportion, _weightedProportion]);

      if (_max > currentMax) {
        currentMax = _max;
      }
    }

    return currentMax;
  }

  function getMaxProportionWithAdjusted(TBins, CBins, adjustedTBins, adjustedCBins, unadjustedCCount, unadjustedTCount, adjustedCCount, adjustedTCount) {
    var TBinsMax = d3.max(TBins.map(function (d) {
      return d.length / unadjustedTCount;
    }));
    var CBinsMax = d3.max(CBins.map(function (d) {
      return d.length / unadjustedCCount;
    }));
    var TBinsAdjustedMax = d3.max(adjustedTBins.map(function (d) {
      return d.length / adjustedTCount;
    }));
    var CBinsAdjustedMax = d3.max(adjustedCBins.map(function (d) {
      return d.length / adjustedCCount;
    }));
    return d3.max([TBinsMax, CBinsMax, TBinsAdjustedMax, CBinsAdjustedMax]);
  } // Get weighted mean given data


  function getWeightedMean(xw) {
    var total = 0;
    var totalWeight = 0;

    for (var _iterator3 = _createForOfIteratorHelperLoose(xw), _step3; !(_step3 = _iterator3()).done;) {
      var v = _step3.value;
      total += v[0] * v[1];
      totalWeight += v[1];
    }

    return total / totalWeight;
  }

  function handleHide() {
    hideCovariate(attribute);
  }

  (0, _react.useEffect)(function () {
    if (unadjustedTreatmentData.length === 0 || unadjustedControlData.length === 0) {
      return;
    }

    var isSelected = selectedAttribute.length > 0; // function onBrush(e) {
    //   let brushSelection = e.selection;
    //   // console.log(brushSelection[1], xScale.invert(brushSelection[1]));
    // }
    // function brushEnd(e) {
    //   let brushSelection = e.selection;
    //   let brushExtent;
    //   if (brushSelection) {
    //     brushExtent = [xScale.invert(brushSelection[0]), xScale.invert(brushSelection[1])];
    //   } else {
    //     brushExtent = null;
    //   }
    //   updateFilter(refIndex, brushExtent);
    // }
    // var brush = d3.brushX()
    //             .extent([[layout.marginLeft, layout.margin], [layout.width-layout.margin, layout.height-layout.margin, layout.margin]])
    //             // .on("brush", (e) => onBrush(e))
    //             .on("end", (e) => brushEnd(e))
    // svgElement.call(brush)
    // Histogram domain has been adjusted to create a pseudo-bandScale()
    // This allows plotting of both categorical histogram + numerical means on the same plot

    var histogram = d3.histogram().value(function (d) {
      return d[0];
    }).domain([-0.5, 1.5]).thresholds(bins);
    var TBins = histogram(unadjustedTreatmentData);
    var CBins = histogram(unadjustedControlData);
    var selectedBins = histogram(selectedAttribute.map(function (s) {
      return [0, s];
    })); // Get mean of unadjusted data

    var unadjustedCMean = d3.mean(unadjustedControlData, function (d) {
      return d[0];
    });
    var unadjustedTMean = d3.mean(unadjustedTreatmentData, function (d) {
      return d[0];
    }); // Get count of unadjusted data

    var unadjustedCCount = unadjustedControlData.length;
    var unadjustedTCount = unadjustedTreatmentData.length;
    var adjustedCMean;
    var adjustedTMean;
    var adjustedCCount;
    var adjustedTCount;
    var newXScale;
    var newYScaleTreatment;
    var newYScaleControl;
    var adjustedCBins;
    var adjustedTBins;
    var maxProportion; // If adjusted data set not provided, calculate means and counts using IPW

    if (adjustedTreatmentData.length === 0 || adjustedControlData.length === 0) {
      adjustedCMean = getWeightedMean(unadjustedControlData);
      adjustedTMean = getWeightedMean(unadjustedTreatmentData);
      adjustedCCount = d3.sum(unadjustedControlData, function (d) {
        return d[1];
      });
      adjustedTCount = d3.sum(unadjustedTreatmentData, function (d) {
        return d[1];
      });
      maxProportion = getMaxProportion(TBins, CBins, unadjustedCCount, unadjustedTCount, adjustedCCount, adjustedTCount);
      newXScale = d3.scaleLinear().domain([-0.5, 1.5]).range([layout.marginLeft, layout.width - layout.margin]);
      newYScaleTreatment = d3.scaleLinear().domain([0, maxProportion]).range([layout.height / 2, layout.height - layout.margin]);
      newYScaleControl = d3.scaleLinear().domain([0, maxProportion]).range([layout.height / 2, layout.margin]);
      setXScale(function () {
        return function (x) {
          return newXScale(x);
        };
      });
      setYScaleTreatment(function () {
        return function (y) {
          return newYScaleTreatment(y);
        };
      });
      setYScaleControl(function () {
        return function (y) {
          return newYScaleControl(y);
        };
      });
    } else {
      adjustedCMean = d3.mean(adjustedControlData, function (d) {
        return d[0];
      });
      adjustedTMean = d3.mean(adjustedTreatmentData, function (d) {
        return d[0];
      });
      adjustedCCount = adjustedControlData.length;
      adjustedTCount = adjustedTreatmentData.length;
      adjustedCBins = histogram(adjustedControlData);
      adjustedTBins = histogram(adjustedTreatmentData);
      maxProportion = getMaxProportionWithAdjusted(TBins, CBins, adjustedTBins, adjustedCBins, unadjustedCCount, unadjustedTCount, adjustedCCount, adjustedTCount);
      newXScale = d3.scaleLinear().domain([-0.5, 1.5]).range([layout.marginLeft, layout.width - layout.margin]);
      newYScaleTreatment = d3.scaleLinear().domain([0, maxProportion]).range([layout.height / 2, layout.height - layout.margin]);
      newYScaleControl = d3.scaleLinear().domain([0, maxProportion]).range([layout.height / 2, layout.margin]);
      setXScale(function () {
        return function (x) {
          return newXScale(x);
        };
      });
      setYScaleTreatment(function () {
        return function (y) {
          return newYScaleTreatment(y);
        };
      });
      setYScaleControl(function () {
        return function (y) {
          return newYScaleControl(y);
        };
      });
    }

    var bandwidth = (layout.width - layout.margin - layout.marginLeft) / 2;
    var unadjustedCBars = svgElement.select("#unadjusted").selectAll(".unadjustedCBars").data(CBins).join("rect").attr("class", "unadjustedCBars").attr("x", function (d, i) {
      return newXScale(d.x0) - bandwidth / 2;
    }).attr("y", function (d) {
      return newYScaleControl(d.length / unadjustedCCount);
    }).attr("width", function (d) {
      return bandwidth;
    }).attr("height", function (d) {
      return newYScaleControl(0) - newYScaleControl(d.length / unadjustedCCount);
    }).attr("fill", "none").attr("stroke", "black");
    var unadjustedTBars = svgElement.select("#unadjusted").selectAll(".unadjustedTBars").data(TBins).join("rect").attr("class", "unadjustedTBars").attr("x", function (d, i) {
      return newXScale(d.x0) - bandwidth / 2;
    }).attr("y", function (d) {
      return newYScaleTreatment(0);
    }).attr("width", bandwidth).attr("height", function (d) {
      return newYScaleTreatment(d.length / unadjustedTCount) - newYScaleTreatment(0);
    }).attr("fill", "none").attr("stroke", "black");

    if (adjustedTreatmentData.length === 0 || adjustedControlData.length === 0) {
      var adjustedCBars = svgElement.select("#adjusted").selectAll(".adjustedCBars").data(CBins).join("rect").attr("class", "adjustedCBars").attr("x", function (d, i) {
        return newXScale(d.x0) - bandwidth / 2;
      }).attr("y", function (d) {
        return newYScaleControl(d3.sum(d, function (v) {
          return v[1];
        }) / adjustedCCount);
      }).attr("width", bandwidth).attr("height", function (d) {
        return newYScaleControl(0) - newYScaleControl(d3.sum(d, function (v) {
          return v[1];
        }) / adjustedCCount);
      }).attr("fill", colorMap.control).attr("stroke", "none");
      var adjustedTBars = svgElement.select("#adjusted").selectAll(".adjustedTBars").data(TBins).join("rect").attr("class", "adjustedTBars").attr("x", function (d, i) {
        return newXScale(d.x0) - bandwidth / 2;
      }).attr("y", function (d) {
        return newYScaleTreatment(0);
      }).attr("width", bandwidth).attr("height", function (d) {
        return newYScaleTreatment(d3.sum(d, function (v) {
          return v[1];
        }) / adjustedTCount) - newYScaleTreatment(0);
      }).attr("fill", colorMap.treatment).attr("stroke", "none");
    } else {
      var _adjustedCBars = svgElement.select("#adjusted").selectAll(".adjustedCBars").data(adjustedCBins).join("rect").attr("class", "adjustedCBars").attr("x", function (d, i) {
        return newXScale(d.x0) - bandwidth / 2;
      }).attr("y", function (d) {
        return newYScaleControl(d.length / adjustedCCount);
      }).attr("width", bandwidth).attr("height", function (d) {
        return newYScaleControl(0) - newYScaleControl(d.length / adjustedCCount);
      }).attr("fill", colorMap.control).attr("stroke", "none");

      var _adjustedTBars = svgElement.select("#adjusted").selectAll(".adjustedTBars").data(adjustedTBins).join("rect").attr("class", "adjustedTBars").attr("x", function (d, i) {
        return newXScale(d.x0) - bandwidth / 2;
      }).attr("y", function (d) {
        return newYScaleTreatment(0);
      }).attr("width", bandwidth).attr("height", function (d) {
        return newYScaleTreatment(d.length / adjustedTCount) - newYScaleTreatment(0);
      }).attr("fill", colorMap.treatment).attr("stroke", "none");
    }
    /*
     *
    Indicate adjusted means
     *
     */


    svgElement.select("#adjustedMean").selectAll(".adjustedCMeanLine").data([adjustedCMean]).join("line").attr("class", "adjustedCMeanLine").attr("x1", function (d) {
      return newXScale(d);
    }).attr("x2", function (d) {
      return newXScale(d);
    }).attr("y1", layout.height / 2).attr("y2", layout.margin - 10).attr("stroke-dasharray", "5 5 2 5").attr("stroke", "black").attr('stroke-width', 2).attr("stroke-linecap", "round");
    svgElement.select("#adjustedMean").selectAll(".adjustedTMeanLine").data([adjustedTMean]).join("line").attr("class", "adjustedTMeanLine").attr("x1", function (d) {
      return newXScale(d);
    }).attr("x2", function (d) {
      return newXScale(d);
    }).attr("y1", layout.height / 2).attr("y2", layout.height - layout.margin + 10).attr("stroke-dasharray", "5 5 2 5").attr("stroke", "black").attr('stroke-width', 2).attr("stroke-linecap", "round");
    svgElement.select("#adjustedMean").selectAll(".adjustedCMean").data([adjustedCMean]).join("circle").attr("class", "adjustedCMean").attr("cx", function (d) {
      return newXScale(d);
    }).attr("cy", function (d) {
      return newYScaleControl(0);
    }).attr("r", 3).attr("fill", "black").attr("stroke", "black");
    svgElement.select("#adjustedMean").selectAll(".adjustedTMean").data([adjustedTMean]).join("circle").attr("class", "adjustedTMean").attr("cx", function (d) {
      return newXScale(d);
    }).attr("cy", function (d) {
      return newYScaleTreatment(0);
    }).attr("r", 3).attr("fill", "black").attr("stroke", "black");
    /*
     *
    Indicate unadjusted means
     *
     */

    svgElement.select("#unadjustedMean").selectAll(".unadjustedCMeanLine").data([unadjustedCMean]).join("line").attr("class", "unadjustedCMeanLine").attr("x1", function (d) {
      return newXScale(d);
    }).attr("x2", function (d) {
      return newXScale(d);
    }).attr("y1", layout.height / 2).attr("y2", layout.margin - 10).attr("stroke-dasharray", "5 5 2 5").attr("stroke", "black").attr("opacity", 0.75).attr("stroke-width", 1);
    svgElement.select("#unadjustedMean").selectAll(".unadjustedTMeanLine").data([unadjustedTMean]).join("line").attr("class", "unadjustedTMeanLine").attr("x1", function (d) {
      return newXScale(d);
    }).attr("x2", function (d) {
      return newXScale(d);
    }).attr("y1", layout.height / 2).attr("y2", layout.height - layout.margin + 10).attr("stroke-dasharray", "5 5 2 5").attr("stroke", "black").attr("opacity", 0.75).attr("stroke-width", 1);
    svgElement.select('#x-axis').attr('transform', "translate(0, " + layout.height / 2 + ")").call(d3.axisBottom(newXScale).tickSize(3).tickValues([0, 1]).tickFormat(d3.format('.0f')));
    svgElement.select('#y-axistreatment').attr('transform', "translate(" + layout.marginLeft + ", 0)").call(d3.axisLeft(newYScaleTreatment).tickSize(3).ticks(2));
    svgElement.select('#y-axiscontrol').attr('transform', "translate(" + layout.marginLeft + ", 0)").call(d3.axisLeft(newYScaleControl).tickSize(3).ticks(2));
    d3.selectAll("#x-axis>.tick>text").each(function (d, i) {
      d3.select(this).style("font-size", "12px");
    });
    d3.selectAll("#y-axistreatment>.tick>text").each(function (d, i) {
      d3.select(this).style("font-size", "12px");
    });
    d3.selectAll("#y-axiscontrol>.tick>text").each(function (d, i) {
      d3.select(this).style("font-size", "12px");
    });
  }, [unadjustedTreatmentData, unadjustedControlData, adjustedTreatmentData, adjustedControlData]);
  (0, _react.useEffect)(function () {
    var histogram = d3.histogram().domain([-0.5, 1.5]).thresholds(bins);
    var selectedBins = histogram(selectedAttribute);
    var bandwidth = (layout.width - layout.margin - layout.marginLeft) / 2;
    svgElement.select("#selected").selectAll(".selectedBars").data(selectedBins).join("rect").attr("class", "selectedBars").attr("x", function (d, i) {
      return xScale(d.x0) - bandwidth / 2;
    }).attr("y", function (d) {
      return selectedTreatment ? yScaleTreatment(0) : yScaleControl(d.length / unadjustedControlData.length);
    }).attr("width", function (d) {
      return bandwidth;
    }).attr("height", function (d) {
      if (selectedTreatment) {
        return yScaleTreatment(d.length / unadjustedTreatmentData.length) - yScaleTreatment(0);
      } else {
        return yScaleControl(0) - yScaleControl(d.length / unadjustedControlData.length);
      }
    }).attr("fill", "none").attr("stroke", "black");
    var isSelected = selectedAttribute.length > 0;

    if (isSelected) {
      svgElement.select("#unadjusted").selectAll(".unadjustedCBars").attr("opacity", 0.2);
      svgElement.select("#unadjusted").selectAll(".unadjustedTBars").attr("opacity", 0.2);
      svgElement.select("#adjusted").selectAll(".adjustedCBars").attr("opacity", 0.2);
      svgElement.select("#adjusted").selectAll(".adjustedTBars").attr("opacity", 0.2);
    } else {
      svgElement.select("#unadjusted").selectAll(".unadjustedCBars").attr("opacity", 1);
      svgElement.select("#unadjusted").selectAll(".unadjustedTBars").attr("opacity", 1);
      svgElement.select("#adjusted").selectAll(".adjustedCBars").attr("opacity", 1);
      svgElement.select("#adjusted").selectAll(".adjustedTBars").attr("opacity", 1);
    }
  }, [selectedAttribute]);
  var iconStyle = {
    "opacity": iconShow ? 1 : 0,
    "cursor": "pointer"
  };
  var covStyle = {
    "display": "flex",
    "alignItems": "center"
  };
  var textStyle = {
    "writingMode": "vertical-rl",
    "transform": "rotate(-180deg)",
    "fontFamily": "sans-serif",
    "fontSize": "12px"
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: covStyle,
    onMouseOver: function onMouseOver(e) {
      return show(e.target);
    },
    onMouseOut: function onMouseOut(e) {
      return hide(e.target);
    }
  }, /*#__PURE__*/_react["default"].createElement(_IconButton["default"], {
    style: iconStyle,
    onClick: function onClick() {
      return handleHide();
    },
    "aria-label": "delete"
  }, /*#__PURE__*/_react["default"].createElement(_VisibilityOff["default"], null)), /*#__PURE__*/_react["default"].createElement("p", {
    style: textStyle
  }, attribute), /*#__PURE__*/_react["default"].createElement("svg", {
    width: layout.width,
    height: layout.height,
    ref: ref,
    id: "svgCompare" + attribute
  }, /*#__PURE__*/_react["default"].createElement("g", null, /*#__PURE__*/_react["default"].createElement("g", {
    id: "adjusted"
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "unadjusted"
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "unadjustedMean"
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "adjustedMean"
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "selected"
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "x-axis"
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "y-axistreatment"
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "y-axiscontrol"
  }))));
};

exports.CompareHistogramVis = CompareHistogramVis;