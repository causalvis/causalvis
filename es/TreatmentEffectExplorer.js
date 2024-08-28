function _createForOfIteratorHelperLoose(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: !0 } : { done: !1, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
import React, { useState, useEffect } from 'react';
import { extent, mean } from "d3-array";
import { BeeswarmLeft } from './TreatmentEffectEvaluator/BeeswarmLeft';
import { BeeswarmTop } from './TreatmentEffectEvaluator/BeeswarmTop';
import { CovariatesManager } from './TreatmentEffectEvaluator/CovariatesManager';
import { LegendVis } from './TreatmentEffectEvaluator/LegendVis';
import { TreatmentEffectVis } from './TreatmentEffectEvaluator/TreatmentEffectVis';
import { TreatmentEffectVisViolin } from './TreatmentEffectEvaluator/TreatmentEffectVis_withViolin';

/*
Props:
  - data: Array, data set before adjustment
  - treatment: String, name of treatment variable
  - outcome: String, name of outcome variable
*/
export var TreatmentEffectExplorer = function TreatmentEffectExplorer(_ref) {
  var _ref$data = _ref.data,
    data = _ref$data === void 0 ? [] : _ref$data,
    _ref$treatment = _ref.treatment,
    treatment = _ref$treatment === void 0 ? "treatment" : _ref$treatment,
    _ref$outcome = _ref.outcome,
    outcome = _ref$outcome === void 0 ? "outcome" : _ref$outcome,
    _ref$effect = _ref.effect,
    effect = _ref$effect === void 0 ? "effect" : _ref$effect;
  var _React$useState = React.useState([]),
    attributes = _React$useState[0],
    setAttributes = _React$useState[1];
  var _React$useState2 = React.useState({}),
    attributeLevels = _React$useState2[0],
    setAttributeLevels = _React$useState2[1];
  var _React$useState3 = React.useState({}),
    attributeExtents = _React$useState3[0],
    setAttributeExtents = _React$useState3[1];
  var _React$useState4 = React.useState([]),
    cohortData = _React$useState4[0],
    setCohortData = _React$useState4[1];
  var _React$useState5 = React.useState([0, 0]),
    effectExtent = _React$useState5[0],
    setEffectExtent = _React$useState5[1];
  var _React$useState6 = React.useState([]),
    stratify = _React$useState6[0],
    setStratify = _React$useState6[1];
  var _React$useState7 = React.useState([]),
    stratifiedData = _React$useState7[0],
    setStratifiedData = _React$useState7[1];
  useEffect(function () {
    // Get all the confounding attributes, excluding treatment and propensity score
    var allAttributes = new Set(Object.keys(data[0]));
    allAttributes["delete"](treatment);
    allAttributes["delete"](outcome);
    allAttributes = Array.from(allAttributes);
    setAttributes(allAttributes);
    var newCohortData = JSON.parse(JSON.stringify(data)).map(function (d) {
      d.outcome = d.weight ? d.outcome * d.weight : d.outcome;
      return d;
    });
    setCohortData(newCohortData);
    var newAttributeLevels = {};
    var newAttributeExtents = {};
    var _loop = function _loop() {
      var a = _step.value;
      var attributeValues = data.map(function (d) {
        return d[a];
      });
      var aLevels = Array.from(new Set(attributeValues));
      newAttributeLevels[a] = aLevels;
      var aExtent = extent(attributeValues);
      newAttributeExtents[a] = aExtent;
    };
    for (var _iterator = _createForOfIteratorHelperLoose(allAttributes), _step; !(_step = _iterator()).done;) {
      _loop();
    }
    setAttributeLevels(newAttributeLevels);
    setAttributeExtents(newAttributeExtents);
    setEffectExtent(extent(data, function (d) {
      return d[effect];
    }));
  }, [data]);

  // Add a new attribute to facet by
  // For each new attribute, also add the faceting threshold
  function changeStratify(v) {
    var indexV = stratify.map(function (d) {
      return d.attribute;
    }).indexOf(v);
    if (indexV < 0) {
      if (stratify.length === 3) {
        return;
      }

      // For continuous variables, set the default faceting threshold to be the mean
      var vThreshold = attributeLevels[v].length === 2 ? null : mean(data, function (d) {
        return d[v];
      }).toPrecision(3);
      stratify.push({
        "attribute": v,
        "threshold": vThreshold
      });
      setStratify([].concat(stratify));
    } else {
      stratify.splice(indexV, 1);
      setStratify([].concat(stratify));
    }
  }
  function updateTopThreshold(v) {
    stratify[1].threshold = v;
    setStratify([].concat(stratify));
  }
  function updateLeftThreshold(v) {
    stratify[2].threshold = v;
    setStratify([].concat(stratify));
  }

  // Divide dataset based on faceting attributes and thresholds
  function splitDataset(dataset, attribute, threshold) {
    var underMean;
    var overMean;
    if (!threshold) {
      underMean = dataset.filter(function (d) {
        return d[attribute] === 0;
      });
      overMean = dataset.filter(function (d) {
        return d[attribute] === 1;
      });
      return [{
        "data": underMean,
        "title": attribute + " = 0"
      }, {
        "data": overMean,
        "title": attribute + " = 1"
      }];
    } else {
      underMean = dataset.filter(function (d) {
        return d[attribute] < threshold;
      });
      overMean = dataset.filter(function (d) {
        return d[attribute] > threshold;
      });
      return [{
        "data": underMean,
        "title": "< " + threshold
      }, {
        "data": overMean,
        "title": ">= " + threshold
      }];
    }
  }
  useEffect(function () {
    var newStratifiedData = [];
    if (stratify.length === 1) {
      newStratifiedData.push({
        "data": JSON.parse(JSON.stringify(cohortData)),
        "stratifyBy": stratify[0].attribute,
        "stratifyExtent": attributeExtents[stratify[0].attribute],
        "title": "",
        "layout": {
          "height": 600,
          "width": 600,
          "margin": 20,
          "marginLeft": 50,
          "marginBottom": 35
        }
      });
      setStratifiedData([].concat(newStratifiedData));
    } else if (stratify.length === 2) {
      var _newStratifiedData = splitDataset(cohortData, stratify[1].attribute, stratify[1].threshold);
      _newStratifiedData = _newStratifiedData.map(function (s) {
        s.stratifyBy = stratify[0].attribute;
        s.stratifyExtent = attributeExtents[stratify[0].attribute];
        s.layout = {
          "height": 600,
          "width": 300,
          "margin": 20,
          "marginLeft": 50,
          "marginBottom": 35
        };
        return s;
      });
      setStratifiedData([].concat(_newStratifiedData));
    } else if (stratify.length === 3) {
      var _newStratifiedData2 = [];
      var firstStratify = splitDataset(cohortData, stratify[2].attribute, stratify[2].threshold);
      firstStratify = firstStratify.reverse();
      var _loop2 = function _loop2() {
        var sub = _step2.value;
        var subTitle = sub.title;
        var subStratify = splitDataset(sub.data, stratify[1].attribute, stratify[1].threshold);
        subStratify = subStratify.map(function (s) {
          s.stratifyBy = stratify[0].attribute;
          s.stratifyExtent = attributeExtents[stratify[0].attribute];
          s.layout = {
            "height": 300,
            "width": 300,
            "margin": 20,
            "marginLeft": 50,
            "marginBottom": 35
          };
          s.title = subTitle + ", " + s.title;
          return s;
        });
        _newStratifiedData2 = _newStratifiedData2.concat(subStratify);
      };
      for (var _iterator2 = _createForOfIteratorHelperLoose(firstStratify), _step2; !(_step2 = _iterator2()).done;) {
        _loop2();
      }
      setStratifiedData([].concat(_newStratifiedData2));
    } else if (stratify.length === 0) {
      newStratifiedData.push({
        "data": JSON.parse(JSON.stringify(cohortData)),
        "stratifyBy": "",
        "stratifyExtent": [0, 0],
        "title": "",
        "layout": {
          "height": 600,
          "width": 600,
          "margin": 20,
          "marginLeft": 50,
          "marginBottom": 35
        }
      });
      setStratifiedData([].concat(newStratifiedData));
    }
  }, [stratify, cohortData]);
  var mainLayout = {
    "display": "grid",
    "gridTemplateColumns": "auto auto 1fr",
    "gridTemplateRows": "auto auto 1fr",
    "gridGap": "20px"
  };
  var covariateStyle = {
    "gridColumn": "1/2",
    "gridRow": "3/4",
    "display": "flex",
    "alignItems": "center"
  };
  var headerStyle = {
    "gridColumn": "3/4",
    "gridRow": "1/2",
    "display": "flex",
    "flexDirection": "column",
    "alignItems": "center",
    "width": "600px"
  };
  var plotsTitle = {
    "fontSize": "16px",
    "fontFamily": "sans-serif"
  };
  var btopStyle = {
    "gridColumn": "3/4",
    "gridRow": "2/3",
    "width": "600px"
  };
  var bleftStyle = {
    "gridColumn": "2/3",
    "gridRow": "3/4"
  };
  var allVis = {
    "gridColumn": "3/4",
    "gridRow": "3/4",
    "width": "600px",
    "height": "600px",
    "display": "grid",
    "gridTemplateColumns": "1fr 1fr",
    "gridTemplateRows": "1fr 1fr"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: mainLayout
  }, /*#__PURE__*/React.createElement("div", {
    style: covariateStyle
  }, /*#__PURE__*/React.createElement(CovariatesManager, {
    attributes: attributes,
    changeStratify: changeStratify,
    stratify: stratify.map(function (d) {
      return d.attribute;
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: headerStyle
  }, /*#__PURE__*/React.createElement("p", {
    style: plotsTitle
  }, "Treatment Effect Plot")), /*#__PURE__*/React.createElement("div", {
    style: btopStyle
  }, stratify[1] ? /*#__PURE__*/React.createElement(BeeswarmTop, {
    data: cohortData,
    stratify: stratify[1].attribute,
    thresholdValue: stratify[1].threshold,
    updateTopThreshold: updateTopThreshold,
    isBinary: attributeLevels[stratify[1].attribute].length === 2
  }) : /*#__PURE__*/React.createElement("div", null)), /*#__PURE__*/React.createElement("div", {
    style: bleftStyle
  }, stratify[2] ? /*#__PURE__*/React.createElement(BeeswarmLeft, {
    data: cohortData,
    stratify: stratify[2].attribute,
    thresholdValue: stratify[2].threshold,
    updateLeftThreshold: updateLeftThreshold,
    isBinary: attributeLevels[stratify[2].attribute].length === 2
  }) : /*#__PURE__*/React.createElement("div", null)), /*#__PURE__*/React.createElement("div", {
    style: allVis
  }, stratifiedData.map(function (value, index) {
    return /*#__PURE__*/React.createElement(TreatmentEffectVisViolin, {
      key: "vis" + value.stratifyBy + index,
      index: index,
      allData: value,
      effectExtent: effectExtent,
      isBinary: attributeLevels[value.stratifyBy] ? attributeLevels[value.stratifyBy].length === 2 : false
    });
  })));
};