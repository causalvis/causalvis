"use strict";

exports.__esModule = true;
exports.CompareDistributionVis = void 0;

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

var CompareDistributionVis = function CompareDistributionVis(_ref) {
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

  var bins = 30; // Track color map

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
  var svgElement = svg.select("g"); // The following function is modified from https://observablehq.com/@d3/kernel-density-estimation

  function kdeWeighted(kernel, thresholds, data, weights) {
    var density = [];

    if (weights) {
      var _loop = function _loop() {
        var t = _step.value;
        var tValues = data.map(function (d) {
          return kernel(t - d);
        });
        var total = 0;
        var total_weights = 0;

        for (var i = 0; i < tValues.length; i++) {
          var tValue = tValues[i];
          var w = weights[i];
          total += tValue * w;
          total_weights += w;
        }

        var weighted_mean = total_weights === 0 ? 0 : total / total_weights;
        density.push([t, weighted_mean]);
      };

      for (var _iterator = _createForOfIteratorHelperLoose(thresholds), _step; !(_step = _iterator()).done;) {
        _loop();
      }
    } else {
      density = thresholds.map(function (t) {
        return [t, d3.mean(data, function (d) {
          return kernel(t - d);
        })];
      });
    }

    return density;
  } // The following function used as-is from https://observablehq.com/@d3/kernel-density-estimation


  function epanechnikov(bandwidth) {
    return function (x) {
      return Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;
    };
  }

  function getIQR(array) {
    array.sort(function (a, b) {
      return a - b;
    });
    var q1 = array[Math.floor(array.length / 4)];
    var q3 = array[Math.ceil(array.length * (3 / 4))];
    return q3 - q1;
  } // The following function from https://stackoverflow.com/questions/7343890/standard-deviation-javascript


  function getStandardDeviation(array) {
    var n = array.length;
    var mean = array.reduce(function (a, b) {
      return a + b;
    }) / n;
    return Math.sqrt(array.map(function (x) {
      return Math.pow(x - mean, 2);
    }).reduce(function (a, b) {
      return a + b;
    }) / n);
  } // Return svg path given data


  function getLine(thresholds, d, startPoint, endPoint, xScale, yScale, weights) {
    var std = getStandardDeviation(d);
    var b = (thresholds[1] - thresholds[0]) * 3.5;
    var density = kdeWeighted(epanechnikov(b), thresholds, d, weights);
    density = [startPoint].concat(density).concat([endPoint]);
    var line = d3.line().curve(d3.curveBasis).x(function (d) {
      return xScale(d[0]);
    }).y(function (d) {
      return yScale(d[1]);
    });
    return line(density);
  }

  function getArea(binned, binRange, xScale) {
    var totalLength = binned.reduce(function (count, current) {
      return count + current.length;
    }, 0);
    var totalWeight = binned.reduce(function (count, current) {
      return count + d3.sum(current, function (d) {
        return d[1];
      });
    }, 0);
    var maxNum = d3.max(binned.map(function (d) {
      return d.length / totalLength;
    }));
    var maxWeight = d3.max(binned.map(function (d) {
      return d3.sum(d, function (i) {
        return i[1];
      }) / totalWeight;
    }));
    var unadjustedBinScale = d3.scaleLinear().range(binRange).domain([0, maxNum]);
    var adjustedBinScale = d3.scaleLinear().range(binRange).domain([0, maxWeight]);
    var unadjustedArea = d3.area().y0(function (d) {
      return unadjustedBinScale(0);
    }).y1(function (d) {
      return unadjustedBinScale(d.length / totalLength);
    }).x(function (d) {
      return xScale(d.x0);
    }).curve(d3.curveCatmullRom);
    var adjustedArea = d3.area().y0(function (d) {
      return adjustedBinScale(0);
    }).y1(function (d) {
      return adjustedBinScale(d3.sum(d, function (i) {
        return i[1];
      }) / totalWeight);
    }).x(function (d) {
      return xScale(d.x0);
    }).curve(d3.curveCatmullRom);
    return {
      "unadjusted": unadjustedArea(binned),
      "adjusted": adjustedArea(binned)
    };
  }

  function getAreaWithAdjusted(binsUnadjusted, binsAdjusted, binRange, xScale) {
    var totalLengthUnadjusted = binsUnadjusted.reduce(function (count, current) {
      return count + current.length;
    }, 0);
    var totalLengthAdjusted = binsAdjusted.reduce(function (count, current) {
      return count + current.length;
    }, 0);
    var maxNumUnadjusted = d3.max(binsUnadjusted.map(function (d) {
      return d.length / totalLengthUnadjusted;
    }));
    var maxNumAdjusted = d3.max(binsAdjusted.map(function (d) {
      return d.length / totalLengthAdjusted;
    }));
    var unadjustedBinScale = d3.scaleLinear().range(binRange).domain([0, maxNumUnadjusted]);
    var adjustedBinScale = d3.scaleLinear().range(binRange).domain([0, maxNumAdjusted]);
    var unadjustedArea = d3.area().y0(function (d) {
      return unadjustedBinScale(0);
    }).y1(function (d) {
      return unadjustedBinScale(d.length / totalLengthUnadjusted);
    }).x(function (d) {
      return xScale(d.x0);
    }).curve(d3.curveCatmullRom);
    var adjustedArea = d3.area().y0(function (d) {
      return adjustedBinScale(0);
    }).y1(function (d) {
      return adjustedBinScale(d.length / totalLengthAdjusted);
    }).x(function (d) {
      return xScale(d.x0);
    }).curve(d3.curveCatmullRom);
    return {
      "unadjusted": unadjustedArea(binsUnadjusted),
      "adjusted": adjustedArea(binsAdjusted)
    };
  } // Get weighted mean of data


  function getWeightedMean(x, w) {
    var total = 0;
    var totalWeight = 0;

    for (var i = 0; i < x.length; i++) {
      var xValue = x[i][0];
      var wValue = w[i];
      total += xValue * wValue;
      totalWeight += wValue;
    }

    return total / totalWeight;
  }

  function handleHide() {
    hideCovariate(attribute);
  }

  (0, _react.useEffect)(function () {
    if (unadjustedTreatmentData.length === 0 || unadjustedControlData.length === 0) {
      return;
    } // function onBrush(e) {
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
    // Unfortunately, binning seems to be the most effective way of estimating the max values of the yScale


    var histogram = d3.histogram().value(function (d) {
      return d[0];
    }).domain([d3.min(unadjustedAttribute), d3.max(unadjustedAttribute)]).thresholds(bins);
    var TBins = histogram(unadjustedTreatmentData);
    var CBins = histogram(unadjustedControlData);
    var maxProportion = d3.max([d3.max(TBins.map(function (d) {
      return d.length;
    })) / unadjustedTreatmentData.length, d3.max(CBins.map(function (d) {
      return d.length;
    })) / unadjustedControlData.length]); // let maxProportion = 1;

    var newXScale = d3.scaleLinear().domain([d3.min(unadjustedAttribute), d3.max(unadjustedAttribute)]).range([layout.marginLeft, layout.width - layout.margin]);
    var newYScaleTreatment = d3.scaleLinear().domain([0, maxProportion]).range([layout.height / 2, layout.height - layout.margin]);
    var newYScaleControl = d3.scaleLinear().domain([0, maxProportion]).range([layout.height / 2, layout.margin]);
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
    var thresholds = newXScale.ticks(bins / 2);
    var startPoint = [d3.min(unadjustedAttribute), 0];
    var endPoint = [d3.max(unadjustedAttribute), 0]; // Get KDE of unadjusted data

    var unadjustedCLine = getLine(thresholds, unadjustedControlData, startPoint, endPoint, newXScale, newYScaleControl);
    var unadjustedTLine = getLine(thresholds, unadjustedTreatmentData, startPoint, endPoint, newXScale, newYScaleTreatment); // Get mean of unadjusted data

    var unadjustedCMean = d3.mean(unadjustedControlData, function (d) {
      return d[0];
    });
    var unadjustedTMean = d3.mean(unadjustedTreatmentData, function (d) {
      return d[0];
    });
    var adjustedCLine;
    var adjustedTLine;
    var unadjustedCArea;
    var unadjustedTArea;
    var adjustedCArea;
    var adjustedTArea;
    var adjustedCMean;
    var adjustedTMean; // If adjusted data set not provided, calculate adjustment using IPW and get weighted KDE

    if (adjustedTreatmentData.length === 0 || adjustedControlData.length === 0) {
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
      });
      adjustedCLine = getLine(thresholds, unadjustedControlData, startPoint, endPoint, newXScale, newYScaleControl, controlIPW);
      adjustedTLine = getLine(thresholds, unadjustedTreatmentData, startPoint, endPoint, newXScale, newYScaleTreatment, treatmentIPW);
      var CAreas = getArea(CBins, [layout.height / 2, layout.margin], newXScale);
      var TAreas = getArea(TBins, [layout.height / 2, layout.height - layout.margin], newXScale);
      unadjustedCArea = CAreas.unadjusted;
      adjustedCArea = CAreas.adjusted;
      unadjustedTArea = TAreas.unadjusted;
      adjustedTArea = TAreas.adjusted;
      adjustedCMean = getWeightedMean(unadjustedControlData, controlIPW);
      adjustedTMean = getWeightedMean(unadjustedTreatmentData, treatmentIPW);
    } else {
      var TBinsAdjusted = histogram(adjustedTreatmentData);
      var CBinsAdjusted = histogram(adjustedControlData);

      var _CAreas = getAreaWithAdjusted(CBins, CBinsAdjusted, [layout.height / 2, layout.margin], newXScale);

      var _TAreas = getAreaWithAdjusted(TBins, TBinsAdjusted, [layout.height / 2, layout.height - layout.margin], newXScale);

      unadjustedCArea = _CAreas.unadjusted;
      adjustedCArea = _CAreas.adjusted;
      unadjustedTArea = _TAreas.unadjusted;
      adjustedTArea = _TAreas.adjusted;
      adjustedCMean = d3.mean(adjustedControlData, function (d) {
        return d[0];
      });
      adjustedTMean = d3.mean(adjustedTreatmentData, function (d) {
        return d[0];
      });
    }

    svgElement.select("#unadjusted").selectAll(".unadjustedCLine").data([unadjustedCArea]).join("path").attr("class", "unadjustedCLine").attr("fill", "none").attr("stroke", "#000").attr("stroke-width", 1).attr("stroke-linejoin", "round").attr("d", function (d) {
      return d;
    });
    svgElement.select("#adjusted").selectAll(".adjustedCLine").data([adjustedCArea]).join("path").attr("class", "adjustedCLine").attr("fill", colorMap.control).attr("stroke", "none").attr("d", function (d) {
      return d;
    });
    svgElement.select("#unadjusted").selectAll(".unadjustedTLine").data([unadjustedTArea]).join("path").attr("class", "unadjustedTLine").attr("fill", "none").attr("stroke", "#000").attr("stroke-width", 1).attr("stroke-linejoin", "round").attr("d", function (d) {
      return d;
    });
    svgElement.select("#adjusted").selectAll(".adjustedTLine").data([adjustedTArea]).join("path").attr("class", "adjustedTLine").attr("fill", colorMap.treatment).attr("stroke", "none").attr("d", function (d) {
      return d;
    });
    /*
     *
    Indicate adjusted means
     *
     */

    svgElement.select("#adjustedMean").selectAll(".adjustedCMeanLine").data([adjustedCMean]).join("line").attr("class", "adjustedCMeanLine").attr("x1", function (d) {
      return newXScale(d);
    }).attr("x2", function (d) {
      return newXScale(d);
    }).attr("y1", layout.height / 2).attr("y2", layout.margin - 10).attr("stroke-dasharray", "5 5 2 5").attr("stroke", "black").attr("stroke-width", 2).attr("stroke-linecap", "round");
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
    }).attr("y1", layout.height / 2).attr("y2", layout.height - layout.margin + 10).attr("stroke-dasharray", "5 5 2 5").attr("stroke", "black").attr("opacity", 0.75).attr("stroke-width", 1); // let bandwidth = (layout.width - layout.margin * 2) / bins
    // let unadjustedCBars = svgElement.select("#unadjusted")
    //   .selectAll(".unadjustedCBars")
    //   .data(CBins)
    //   .join("rect")
    //   .attr("class", "unadjustedCBars")
    //   .attr("x", (d, i) => newXScale(d.x0))
    //   .attr("y", d => newYScaleControl(d.length / unadjustedControlData.length))
    //   .attr("width", d => newXScale(d.x1) - newXScale(d.x0))
    //   .attr("height", d => newYScaleControl(0) - newYScaleControl(d.length / unadjustedControlData.length))
    //   .attr("fill", "none")
    //   .attr("stroke", "black");
    // let unadjustedTBars = svgElement.select("#unadjusted")
    //   .selectAll(".unadjustedTBars")
    //   .data(TBins)
    //   .join("rect")
    //   .attr("class", "unadjustedTBars")
    //   .attr("x", (d, i) => newXScale(d.x0))
    //   .attr("y", d => newYScaleTreatment(0))
    //   .attr("width", d => newXScale(d.x1) - newXScale(d.x0))
    //   .attr("height", d => newYScaleTreatment(d.length / unadjustedTreatmentData.length) - newYScaleTreatment(0))
    //   .attr("fill", "none")
    //   .attr("stroke", "black");
    // svgElement.select("#unadjustedMean")
    //   .selectAll(".unadjustedCMean")
    //   .data([unadjustedCMean])
    //   .join("circle")
    //   .attr("class", "unadjustedCMean")
    //   .attr("cx", d => xScale(d))
    //   .attr("cy", d => yScaleControl(0))
    //   .attr("r", 3)
    //   .attr("fill", "white")
    //   .attr("stroke", "black")
    // svgElement.select("#unadjustedMean")
    //   .selectAll(".unadjustedTMean")
    //   .data([unadjustedTMean])
    //   .join("circle")
    //   .attr("class", "unadjustedTMean")
    //   .attr("cx", d => xScale(d))
    //   .attr("cy", d => yScaleTreatment(0))
    //   .attr("r", 3)
    //   .attr("fill", "white")
    //   .attr("stroke", "black")

    svgElement.select('#x-axis').attr('transform', "translate(0, " + layout.height / 2 + ")").call(d3.axisBottom(newXScale).tickSize(3).ticks(5));
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
    var histogram = d3.histogram().domain([d3.min(unadjustedAttribute), d3.max(unadjustedAttribute)]).thresholds(bins);
    var selectedBins = histogram(selectedAttribute);
    var unadjustedCCount = unadjustedControlData.length === 0 ? 1 : unadjustedControlData.length;
    var unadjustedTCount = unadjustedTreatmentData.length === 0 ? 1 : unadjustedTreatmentData.length;
    /*
     *
    Indicate selected items
     *
     */

    svgElement.select("#selected").selectAll(".selectedBars").data(selectedBins).join("rect").attr("class", "selectedBars").attr("x", function (d, i) {
      return xScale(d.x0);
    }).attr("y", function (d) {
      return selectedTreatment ? yScaleTreatment(0) : yScaleControl(d.length / unadjustedCCount);
    }).attr("width", function (d) {
      return xScale(d.x1) - xScale(d.x0);
    }).attr("height", function (d) {
      return selectedTreatment ? yScaleTreatment(d.length / unadjustedTCount) - yScaleTreatment(0) : yScaleControl(0) - yScaleControl(d.length / unadjustedCCount);
    }).attr("fill", "none").attr("stroke", "black");
    var isSelected = selectedAttribute.length > 0;

    if (isSelected) {
      svgElement.select("#unadjusted").selectAll(".unadjustedCLine").attr("opacity", 0.2);
      svgElement.select("#unadjusted").selectAll(".unadjustedTLine").attr("opacity", 0.2);
      svgElement.select("#adjusted").selectAll(".adjustedCLine").attr("opacity", 0.2);
      svgElement.select("#adjusted").selectAll(".adjustedTLine").attr("opacity", 0.2);
    } else {
      svgElement.select("#unadjusted").selectAll(".unadjustedCLine").attr("opacity", 1);
      svgElement.select("#unadjusted").selectAll(".unadjustedTLine").attr("opacity", 1);
      svgElement.select("#adjusted").selectAll(".adjustedCLine").attr("opacity", 1);
      svgElement.select("#adjusted").selectAll(".adjustedTLine").attr("opacity", 1);
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

exports.CompareDistributionVis = CompareDistributionVis;