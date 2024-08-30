function _createForOfIteratorHelperLoose(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: !0 } : { done: !1, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
import React, { useState, useEffect } from 'react';
import crossfilter from 'crossfilter2';
import { CovariateBalance } from './CohortEvaluator/CovariateBalance';
import { PropDistribution } from './CohortEvaluator/PropDistribution';

/*
Props:
  - unadjustedCohort: Array, data set before adjustment
  - adjustedCohort: Array, data set after adjustment
  - treatment: String, name of treatment variable
  - propensity: String, name of propensity variable, should be 1-D Array of propensities for each treatment level
*/
export var CohortEvaluator = function CohortEvaluator(_ref) {
  var _ref$unadjustedCohort = _ref.unadjustedCohort,
    unadjustedCohort = _ref$unadjustedCohort === void 0 ? [] : _ref$unadjustedCohort,
    _ref$adjustedCohort = _ref.adjustedCohort,
    adjustedCohort = _ref$adjustedCohort === void 0 ? [] : _ref$adjustedCohort,
    _ref$treatment = _ref.treatment,
    treatment = _ref$treatment === void 0 ? "treatment" : _ref$treatment,
    _ref$propensity = _ref.propensity,
    propensity = _ref$propensity === void 0 ? "propensity" : _ref$propensity,
    _selection = _ref._selection,
    _iselection = _ref._iselection;
  var _React$useState = React.useState([]),
    attributes = _React$useState[0],
    setAttributes = _React$useState[1];
  var _React$useState2 = React.useState({
      "selectedData": [],
      "treatment": false
    }),
    selected = _React$useState2[0],
    setSelected = _React$useState2[1];
  var _React$useState3 = React.useState({
      "confounds": [],
      "propensity": [],
      "treatment": []
    }),
    unadjustedCohortData = _React$useState3[0],
    setUnadjustedCohortData = _React$useState3[1];
  var _React$useState4 = React.useState(null),
    adjustedCohortData = _React$useState4[0],
    setAdjustedCohortData = _React$useState4[1];
  var allData = JSON.parse(JSON.stringify(unadjustedCohort));
  var filteredData = crossfilter(allData);
  var _React$useState5 = React.useState({}),
    allAttributeFilters = _React$useState5[0],
    setAllAttributeFilters = _React$useState5[1];
  useEffect(function () {
    // Get all the confounding attributes, excluding treatment and propensity score
    var allAttributes = new Set(Object.keys(unadjustedCohort[0]));
    allAttributes["delete"](treatment);
    allAttributes["delete"](propensity);
    allAttributes = Array.from(allAttributes);
    setAttributes(allAttributes);
    var newAttributeFilters = {};
    var _loop = function _loop() {
      var a = _step.value;
      var attributefilter = filteredData.dimension(function (d) {
        return d[a];
      });
      newAttributeFilters[a] = attributefilter;
    };
    for (var _iterator = _createForOfIteratorHelperLoose(allAttributes), _step; !(_step = _iterator()).done;) {
      _loop();
    }
    setAllAttributeFilters(newAttributeFilters);
    var newCohortConfounds = JSON.parse(JSON.stringify(unadjustedCohort)).map(function (d) {
      delete d.treatment;
      delete d.propensity;
      return d;
    });
    var newCohortTreatments = unadjustedCohort.map(function (d) {
      return d.treatment;
    });
    var newCohortPropensity = unadjustedCohort.map(function (d) {
      return d.propensity;
    });
    setUnadjustedCohortData({
      "confounds": newCohortConfounds,
      "propensity": newCohortPropensity,
      "treatment": newCohortTreatments
    });
  }, [unadjustedCohort]);
  useEffect(function () {
    if (adjustedCohort.length > 0) {
      var newCohortConfounds = JSON.parse(JSON.stringify(adjustedCohort)).map(function (d) {
        delete d.treatment;
        delete d.propensity;
        return d;
      });
      var newCohortTreatments = adjustedCohort.map(function (d) {
        return d.treatment;
      });
      var newCohortPropensity = adjustedCohort.map(function (d) {
        return d.propensity;
      });
      setAdjustedCohortData({
        "confounds": newCohortConfounds,
        "propensity": newCohortPropensity,
        "treatment": newCohortTreatments
      });
    }
  }, [adjustedCohort]);
  function updateFilter(attribute, extent) {
    var attributeFilter = allAttributeFilters[attribute];
    attributeFilter.filter(extent);
    var newData = attributeFilter.top(Infinity);
    var newFilteredConfounds = JSON.parse(JSON.stringify(newData)).map(function (d) {
      delete d.treatment;
      delete d.propensity;
      return d;
    });
    var newFilteredTreatments = newData.map(function (d) {
      return d.treatment;
    });
    var newFilteredPropensity = newData.map(function (d) {
      return d.propensity;
    });
    setCohortData({
      "confounds": newFilteredConfounds,
      "propensity": newFilteredPropensity,
      "treatment": newFilteredTreatments
    });
  }
  var plotLayout = {
    "display": "flex"
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: plotLayout
  }, /*#__PURE__*/React.createElement(PropDistribution, {
    unadjustedCohortData: unadjustedCohortData,
    adjustedCohortData: adjustedCohortData,
    setSelected: setSelected,
    _selection: _selection,
    _iselection: _iselection
  }), /*#__PURE__*/React.createElement(CovariateBalance, {
    unadjustedCohortData: unadjustedCohortData,
    adjustedCohortData: adjustedCohortData,
    attributes: attributes,
    updateFilter: updateFilter,
    selected: selected
  })));
};