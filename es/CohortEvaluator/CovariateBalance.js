function _createForOfIteratorHelperLoose(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: !0 } : { done: !1, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
import React, { useState, useEffect } from 'react';
import { SMDVis } from './SMDVis';
import { min, max } from 'd3-array';
import { CompareDistributionVis } from './CompareDistributionVis';
import { CompareHistogramVis } from './CompareHistogramVis';
import { CompareHistogramContinuousVis } from './CompareHistogramContinuousVis';
import { CovariateSelector } from './CovariateSelector';
import { SMDMenu } from './SMDMenu';
import ViewHeadlineSharpIcon from '@mui/icons-material/ViewHeadlineSharp';
import ViewStreamSharpIcon from '@mui/icons-material/ViewStreamSharp';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

// import SortRoundedIcon from '@mui/icons-material/SortRounded';

/*
Props:
  - unadjustedCohortData: Object, data set before adjustment, {"confounds":[], "treatment":[], "propensity":[]}
  - adjustedCohortData: Object, data set after adjustment, {"confounds":[], "treatment":[], "propensity":[]}
  - propensity: Array, propensity scores for each item in the data set, order of items should be identical to unadjusted data set
  - weights: Array, weight of each item in the data set, order of items should be identical to unadjusted data set
  - updateFilter: Function, updates filter functions when a covariate range is selected
*/
export var CovariateBalance = function CovariateBalance(_ref) {
  var _ref$unadjustedCohort = _ref.unadjustedCohortData,
    unadjustedCohortData = _ref$unadjustedCohort === void 0 ? {} : _ref$unadjustedCohort,
    adjustedCohortData = _ref.adjustedCohortData,
    _ref$attributes = _ref.attributes,
    attributes = _ref$attributes === void 0 ? [] : _ref$attributes,
    weights = _ref.weights,
    updateFilter = _ref.updateFilter,
    _ref$selected = _ref.selected,
    selected = _ref$selected === void 0 ? [] : _ref$selected;
  // Unique treatment levels
  var _React$useState = React.useState(),
    treatmentLevels = _React$useState[0],
    setTreatmentLevels = _React$useState[1];
  var _React$useState2 = React.useState({}),
    attributeLevels = _React$useState2[0],
    setAttributeLevels = _React$useState2[1];

  // Track standard mean differences for each attribute
  var _React$useState3 = React.useState([]),
    SMD = _React$useState3[0],
    setSMD = _React$useState3[1];
  var _React$useState4 = React.useState([0, 1]),
    SMDExtent = _React$useState4[0],
    setSMDExtent = _React$useState4[1];

  // Toggles between summary view and details/expanded view
  var _React$useState5 = React.useState(false),
    expand = _React$useState5[0],
    setExpand = _React$useState5[1];

  // Keeps track of which covariates have an expanded view
  var _React$useState6 = React.useState([]),
    attributeDetails = _React$useState6[0],
    setAttributeDetails = _React$useState6[1];
  // True if list of expanded covariates is customized
  var _React$useState7 = React.useState(false),
    customDetails = _React$useState7[0],
    setCustomDetails = _React$useState7[1];

  // Keeps track of the sorting used
  var _React$useState8 = React.useState("Adjusted High to Low"),
    sort = _React$useState8[0],
    setSort = _React$useState8[1];

  // Controls whether the covariate selector is open
  var _React$useState9 = React.useState(false),
    covariateOpen = _React$useState9[0],
    setCovariateOpen = _React$useState9[1];

  // Hides covariate in the expanded view
  function hideCovariate(v) {
    var cIndex = attributeDetails.indexOf(v);
    attributeDetails.splice(cIndex, 1);
    setAttributeDetails([].concat(attributeDetails));
    setCustomDetails(true);
  }

  // function showCovariate(v) {
  //   setAttributeDetails([...attributeDetails, v]);
  //   setCustomDetails(true);
  // }

  function groupEditCovariate(newDetails) {
    setAttributeDetails(Array.from(newDetails));
    setCustomDetails(true);
  }

  // Opens the covariate selector dialog menu
  function handleEdit() {
    setCovariateOpen(true);
  }

  // Toggles between summary view and details/expanded view
  function handleExpand(e, v) {
    // console.log(v);
    if (v === "collapse") {
      setExpand(false);
    } else if (v === "expand") {
      setExpand(true);
    } else {
      return;
    }
  }
  function getWeightedMean(x, w) {
    var total = 0;
    var totalWeight = 0;
    for (var i = 0; i < x.length; i++) {
      var xValue = x[i];
      var wValue = typeof w === "number" ? w : w[i];
      total += xValue * wValue;
      totalWeight += wValue;
    }
    return total / totalWeight;
  }
  function getWeightedVar(x, w, weighted_mean) {
    var total = 0;
    var totalWeight = 0;
    for (var i = 0; i < x.length; i++) {
      var xValue = x[i];
      var wValue = typeof w === "number" ? w : w[i];
      total += wValue * Math.pow(xValue - weighted_mean, 2);
      totalWeight += wValue;
    }
    return total / totalWeight;
  }
  function getVar(x, w) {
    var mean = x.reduce(function (sum, a) {
      return sum + a;
    }, 0) / x.length;
    var total = 0;
    for (var i = 0; i < x.length; i++) {
      var xValue = x[i];
      total += Math.pow(xValue - mean, 2);
    }
    return total / x.length;
  }
  function attributeSMD(x_treated, x_untreated, w_treated, w_untreated) {
    if (w_treated === void 0) {
      w_treated = 1;
    }
    if (w_untreated === void 0) {
      w_untreated = 1;
    }
    var mean_treated = getWeightedMean(x_treated, w_treated);
    var var_treated = getVar(x_treated, w_treated);
    var mean_untreated = getWeightedMean(x_untreated, w_untreated);
    var var_untreated = getVar(x_untreated, w_untreated);
    return (mean_treated - mean_untreated) / Math.sqrt(var_treated + var_untreated);
  }
  function getSMD(dataUnadjusted, dataAdjusted, weights, treatmentAssignmentUnadjusted, treatmentAssignmentAdjusted) {
    var newSMD = [];
    var _loop = function _loop() {
      var a = _step.value;
      // console.log(a);

      // data before adjustment
      var x_unadjusted = dataUnadjusted.map(function (d) {
        return d[a];
      });
      var x_unadjusted_treated = x_unadjusted.filter(function (u, i) {
        return treatmentAssignmentUnadjusted[i] === 1;
      });
      var x_unadjusted_untreated = x_unadjusted.filter(function (u, i) {
        return treatmentAssignmentUnadjusted[i] === 0;
      });
      var SMD_unadjusted = attributeSMD(x_unadjusted_treated, x_unadjusted_untreated);
      var SMD_adjusted;

      // Use adjusted data if it exists, otherwise use weights
      if (dataAdjusted) {
        var x_adjusted = dataAdjusted.map(function (d) {
          return d[a];
        });
        var x_adjusted_treated = x_adjusted.filter(function (u, i) {
          return treatmentAssignmentAdjusted[i] === 1;
        });
        var x_adjusted_untreated = x_adjusted.filter(function (u, i) {
          return treatmentAssignmentAdjusted[i] === 0;
        });

        // console.log(x_adjusted_treated, x_adjusted_untreated)

        SMD_adjusted = attributeSMD(x_adjusted_treated, x_adjusted_untreated);
      } else {
        var _x_adjusted_treated = x_unadjusted.filter(function (u, i) {
          return treatmentAssignmentUnadjusted[i] === 1;
        });
        var _x_adjusted_untreated = x_unadjusted.filter(function (u, i) {
          return treatmentAssignmentUnadjusted[i] === 0;
        });
        var w_adjusted_treated = weights.filter(function (u, i) {
          return treatmentAssignmentUnadjusted[i] === 1;
        });
        var w_adjusted_untreated = weights.filter(function (u, i) {
          return treatmentAssignmentUnadjusted[i] === 0;
        });
        SMD_adjusted = attributeSMD(_x_adjusted_treated, _x_adjusted_untreated, w_adjusted_treated, w_adjusted_untreated);
      }
      newSMD.push({
        "covariate": a,
        "unadjusted": Math.abs(SMD_unadjusted),
        "adjusted": Math.abs(SMD_adjusted)
      });
    };
    for (var _iterator = _createForOfIteratorHelperLoose(attributes), _step; !(_step = _iterator()).done;) {
      _loop();
    }
    return newSMD;
  }
  useEffect(function () {
    if (unadjustedCohortData.confounds && unadjustedCohortData.confounds.length !== 0) {
      var newSMD = [];
      var treatmentAssignmentUnadjusted = unadjustedCohortData.treatment;
      var dataUnadjusted = unadjustedCohortData.confounds;
      var propensityUnadjusted = unadjustedCohortData.propensity;

      // If no adjusted data set provided, use propensity to calculate IPW
      if (!adjustedCohortData) {
        // Get propensity of assigned treatment level
        var allPropensity = propensityUnadjusted.map(function (p, i) {
          return p[treatmentAssignmentUnadjusted[i]];
        });
        // Get inverse propensity weights
        var propensityWeights = allPropensity.map(function (p) {
          return 1 / p;
        });
        newSMD = getSMD(dataUnadjusted, null, propensityWeights, treatmentAssignmentUnadjusted, null);
      } else {
        var dataAdjusted = adjustedCohortData.confounds;
        var treatmentAssignmentAdjusted = adjustedCohortData.treatment;
        newSMD = getSMD(dataUnadjusted, dataAdjusted, null, treatmentAssignmentUnadjusted, treatmentAssignmentAdjusted);
      }
      var newAttributeLevels = {};
      var _loop2 = function _loop2() {
        var a = _step2.value;
        var attributeValues = dataUnadjusted.map(function (d) {
          return d[a];
        });
        newAttributeLevels[a] = Array.from(new Set(attributeValues));
      };
      for (var _iterator2 = _createForOfIteratorHelperLoose(attributes), _step2; !(_step2 = _iterator2()).done;) {
        _loop2();
      }
      setAttributeLevels(newAttributeLevels);
      var SMDSorted = newSMD.sort(function (a, b) {
        return b.adjusted - a.adjusted;
      });

      // console.log("init sorted", newSMD, SMDSorted);

      setSMD(SMDSorted);
      var newAttributeDetails = SMDSorted.filter(function (s) {
        return s.adjusted > 0.1;
      });
      setAttributeDetails(newAttributeDetails.map(function (s) {
        return s.covariate;
      }));
      var newSMDExtent = [Math.min(min(newSMD, function (d) {
        return d.unadjusted;
      }), min(newSMD, function (d) {
        return d.adjusted;
      })), Math.max(max(newSMD, function (d) {
        return d.unadjusted;
      }), max(newSMD, function (d) {
        return d.adjusted;
      }))];
      setSMDExtent(newSMDExtent);
    }
  }, [unadjustedCohortData, adjustedCohortData]);
  useEffect(function () {
    var newSMD;
    // let newAttributeDetails;

    // console.log("new sort...", sort);

    if (sort === "Adjusted High to Low") {
      newSMD = SMD.sort(function (a, b) {
        return b.adjusted - a.adjusted;
      });
    } else if (sort === "Adjusted Low to High") {
      // console.log("here...")
      newSMD = SMD.sort(function (a, b) {
        return a.adjusted - b.adjusted;
      });
    } else if (sort === "Unadjusted High to Low") {
      newSMD = SMD.sort(function (a, b) {
        return b.unadjusted - a.unadjusted;
      });
    } else if (sort === "Unadjusted Low to High") {
      newSMD = SMD.sort(function (a, b) {
        return a.unadjusted - b.unadjusted;
      });
    } else if (sort === "Difference High to Low") {
      newSMD = SMD.sort(function (a, b) {
        return Math.abs(b.unadjusted - b.adjusted) - Math.abs(a.unadjusted - a.adjusted);
      });
    } else if (sort === "Difference Low to High") {
      newSMD = SMD.sort(function (a, b) {
        return Math.abs(a.unadjusted - a.adjusted) - Math.abs(b.unadjusted - b.adjusted);
      });
    } else if (sort === "A-Z Alphebatically") {
      newSMD = SMD.sort(function (a, b) {
        return a.covariate > b.covariate ? 1 : -1;
      });
    } else if (sort === "Z-A Alphebatically") {
      newSMD = SMD.sort(function (a, b) {
        return b.covariate > a.covariate ? 1 : -1;
      });
    }

    // console.log("sorting...", newSMD);

    setSMD([].concat(newSMD));

    // let newAttributeDetails = newSMD.filter(s => s.adjusted > 0.1);
    // setAttributeDetails(newAttributeDetails.map(s => s.covariate));
  }, [sort]);
  var SMDContainer = {
    "height": !expand ? "auto" : "0px",
    "overflow": "hidden",
    "display": "flex"
  };
  var attributesContainer = {
    "minWidth": "600px",
    "marginTop": "30px",
    "flexDirection": "column",
    "height": expand ? "420px" : "0px",
    "overflow": "scroll"
  };
  var detailsStyle = {
    "fontFamily": "sans-serif",
    "fontSize": "11px",
    "marginLeft": "auto"
  };
  var symbolStyle = {
    "verticalAlign": "sub"
  };
  var linkStyle = {
    "color": "steelblue",
    "cursor": "pointer"
  };
  var expandMenu = {
    "display": "flex",
    "alignItems": "center"
  };

  // let testAttribute = ["age", "cons.price.idx", "emp.var.rate", "euribor3m", "job=blue-collar", "month=aug"];
  var testAttribute = ["cons.price.idx"];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: expandMenu
  }, /*#__PURE__*/React.createElement(CovariateSelector, {
    open: covariateOpen,
    handleClose: function handleClose() {
      return setCovariateOpen(false);
    },
    attributes: attributes,
    addedAttributes: attributeDetails,
    groupEditCovariate: groupEditCovariate
  }), /*#__PURE__*/React.createElement(ToggleButtonGroup, {
    value: expand ? "expand" : "collapse",
    exclusive: true,
    onChange: function onChange(e, v) {
      return handleExpand(e, v);
    },
    "aria-label": "text alignment"
  }, /*#__PURE__*/React.createElement(ToggleButton, {
    value: "collapse",
    "aria-label": "left aligned"
  }, /*#__PURE__*/React.createElement(ViewHeadlineSharpIcon, null)), /*#__PURE__*/React.createElement(ToggleButton, {
    value: "expand",
    "aria-label": "centered"
  }, /*#__PURE__*/React.createElement(ViewStreamSharpIcon, null))), customDetails && expand ? /*#__PURE__*/React.createElement("p", {
    style: detailsStyle
  }, /*#__PURE__*/React.createElement("span", {
    style: linkStyle,
    onClick: function onClick() {
      return handleEdit();
    }
  }, /*#__PURE__*/React.createElement("u", null, "Show/Hide covariates."))) : expand ? /*#__PURE__*/React.createElement("p", {
    style: detailsStyle
  }, /*#__PURE__*/React.createElement("span", {
    style: symbolStyle
  }, "*"), " only showing covariate details for SMD > 0.1. ", /*#__PURE__*/React.createElement("span", {
    style: linkStyle,
    onClick: function onClick() {
      return handleEdit();
    }
  }, /*#__PURE__*/React.createElement("u", null, "Show/Hide covariates."))) : /*#__PURE__*/React.createElement("p", null)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: SMDContainer
  }, /*#__PURE__*/React.createElement(SMDVis, {
    SMDDataset: SMD,
    SMDExtent: SMDExtent
  }), /*#__PURE__*/React.createElement(SMDMenu, {
    setSort: setSort
  })), /*#__PURE__*/React.createElement("div", {
    style: attributesContainer
  }, attributeDetails.map(function (value, index) {
    if (attributeLevels[value] && attributeLevels[value].length === 2) {
      return /*#__PURE__*/React.createElement(CompareHistogramVis, {
        key: value,
        unadjustedAttribute: unadjustedCohortData.confounds.map(function (d) {
          return d[value];
        }),
        adjustedAttribute: adjustedCohortData ? adjustedCohortData.confounds.map(function (d) {
          return d[value];
        }) : null,
        unadjustedTreatment: unadjustedCohortData.treatment,
        adjustedTreatment: adjustedCohortData ? adjustedCohortData.treatment : null,
        unadjustedPropensity: unadjustedCohortData.propensity,
        adjustedPropensity: adjustedCohortData ? adjustedCohortData.propensity : null,
        attribute: value,
        updateFilter: updateFilter,
        selectedAttribute: selected.selectedData.map(function (d) {
          return d[value];
        }),
        selectedTreatment: selected.treatment,
        hideCovariate: hideCovariate
      });
    } else {
      return /*#__PURE__*/React.createElement(CompareDistributionVis, {
        key: value,
        unadjustedAttribute: unadjustedCohortData.confounds.map(function (d) {
          return d[value];
        }),
        adjustedAttribute: adjustedCohortData ? adjustedCohortData.confounds.map(function (d) {
          return d[value];
        }) : null,
        unadjustedTreatment: unadjustedCohortData.treatment,
        adjustedTreatment: adjustedCohortData ? adjustedCohortData.treatment : null,
        unadjustedPropensity: unadjustedCohortData.propensity,
        adjustedPropensity: adjustedCohortData ? adjustedCohortData.propensity : null,
        attribute: value,
        updateFilter: updateFilter,
        selectedAttribute: selected.selectedData.map(function (d) {
          return d[value];
        }),
        selectedTreatment: selected.treatment,
        hideCovariate: hideCovariate
      });
    }
  }))));
};