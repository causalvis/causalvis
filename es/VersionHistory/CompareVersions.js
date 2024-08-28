function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _createForOfIteratorHelperLoose(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: !0 } : { done: !1, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
import React, { useRef, useState, useEffect } from 'react';
import { AttributesManager } from './AttributesManager';
import { CompareVersionsVis } from './CompareVersionsVis';
import { mean } from 'd3-array';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
export var CompareVersions = function CompareVersions(_ref) {
  var _ref$versions = _ref.versions,
    versions = _ref$versions === void 0 ? [] : _ref$versions,
    _ref$hierarchy = _ref.hierarchy,
    hierarchy = _ref$hierarchy === void 0 ? {} : _ref$hierarchy,
    _ref$allAttributes = _ref.allAttributes,
    allAttributes = _ref$allAttributes === void 0 ? [] : _ref$allAttributes,
    _ref$versionAttribute = _ref.versionAttributes,
    versionAttributes = _ref$versionAttribute === void 0 ? {} : _ref$versionAttribute,
    _ref$attributeLevels = _ref.attributeLevels,
    attributeLevels = _ref$attributeLevels === void 0 ? {} : _ref$attributeLevels,
    _ref$effect = _ref.effect,
    effect = _ref$effect === void 0 ? "" : _ref$effect,
    colorScale = _ref.colorScale;
  var _React$useState = React.useState([]),
    data = _React$useState[0],
    setData = _React$useState[1];
  var _React$useState2 = React.useState([]),
    flattened = _React$useState2[0],
    setFlattened = _React$useState2[1];
  var _React$useState3 = React.useState(""),
    stratifyBy = _React$useState3[0],
    setStratifyBy = _React$useState3[1];
  function handleChange(e, val) {
    if (!val) {
      setStratifyBy("");
    } else {
      setStratifyBy(val);
    }
  }
  useEffect(function () {
    var DAGs = Object.keys(hierarchy);
    var newFlattened = [];
    for (var i = 0; i < DAGs.length; i++) {
      var DAG = DAGs[i];
      var DAGChildren = hierarchy[DAG];
      for (var _iterator = _createForOfIteratorHelperLoose(DAGChildren), _step; !(_step = _iterator()).done;) {
        var child = _step.value;
        child["DAG"] = JSON.parse(DAG);
        child["name"] = "DAG " + (i + 1) + ": " + child["name"];
        newFlattened.push(child);
      }
    }
    setFlattened(newFlattened);
  }, [hierarchy]);
  useEffect(function () {
    if (stratifyBy == "") {
      var newData = [];
      for (var _iterator2 = _createForOfIteratorHelperLoose(flattened), _step2; !(_step2 = _iterator2()).done;) {
        var v = _step2.value;
        newData.push({
          "ATE": v.ATE,
          "DAG": v.DAG,
          "name": v.name
        });
      }
      setData(newData);
    } else {
      var _newData = [];
      var _loop = function _loop() {
        var v = flattened[i];
        var vAttributes = versionAttributes[i];
        if (vAttributes.indexOf(stratifyBy) < 0) {
          return 1; // continue
        } else if (effect === "") {
          _newData.push({
            "ATE": v.ATE,
            "DAG": v.DAG,
            "name": v.name
          });
        } else if (attributeLevels[stratifyBy].length > 2) {
          var stratifyMean = mean(attributeLevels[stratifyBy]);
          var stratify0 = v.Cohort.filter(function (d) {
            return d[stratifyBy] < stratifyMean;
          });
          var stratify1 = v.Cohort.filter(function (d) {
            return d[stratifyBy] >= stratifyMean;
          });
          var ATE0 = getATE(stratify0);
          var ATE1 = getATE(stratify1);
          _newData.push({
            "ATE": ATE0,
            "group": "<" + stratifyMean.toPrecision(2),
            "DAG": v.DAG,
            "name": v.name
          });
          _newData.push({
            "ATE": ATE1,
            "group": ">=" + stratifyMean.toPrecision(2),
            "DAG": v.DAG,
            "name": v.name
          });
        } else if (attributeLevels[stratifyBy].length == 2) {
          var _stratify = v.Cohort.filter(function (d) {
            return d[stratifyBy] === 0;
          });
          var _stratify2 = v.Cohort.filter(function (d) {
            return d[stratifyBy] === 1;
          });
          var _ATE = getATE(_stratify);
          var _ATE2 = getATE(_stratify2);
          _newData.push({
            "ATE": _ATE,
            "group": "0",
            "DAG": v.DAG,
            "name": v.name
          });
          _newData.push({
            "ATE": _ATE2,
            "group": "1",
            "DAG": v.DAG,
            "name": v.name
          });
        } else {
          _newData.push({
            "ATE": v.ATE,
            "DAG": v.DAG,
            "name": v.name
          });
        }
      };
      for (var i = 0; i < flattened.length; i++) {
        if (_loop()) continue;
      }
      setData(_newData);
    }
  }, [flattened, stratifyBy, attributeLevels]);
  function getATE(cohort) {
    var total = 0;
    for (var _iterator3 = _createForOfIteratorHelperLoose(cohort), _step3; !(_step3 = _iterator3()).done;) {
      var i = _step3.value;
      total = total + i[effect];
    }
    return total / cohort.length;
  }
  var attributesStyle = {
    "width": "150px",
    "marginRight": "50px"
  };
  var ateLayout = {
    "display": "block"
  };
  var searchStyle = {
    "height": "48px",
    "borderRadius": "24px",
    "marginTop": "11px",
    "& .MuiOutlinedInput-input": {
      height: "12px"
    },
    "& .MuiOutlinedInput-root": {
      "padding": "11px"
    },
    "& .MuiInputLabel-formControl": {
      "top": "-1px"
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: ateLayout
  }, /*#__PURE__*/React.createElement(Autocomplete, {
    disablePortal: true,
    id: "combo-box-demo",
    options: Array.from(allAttributes),
    sx: {
      width: 300
    },
    onChange: function onChange(e, val) {
      return handleChange(e, val);
    },
    renderInput: function renderInput(params) {
      return /*#__PURE__*/React.createElement(TextField, _extends({}, params, {
        sx: searchStyle,
        label: "Group by"
      }));
    }
  }), /*#__PURE__*/React.createElement(CompareVersionsVis, {
    data: data,
    stratifyBy: stratifyBy,
    colorScale: colorScale
  }));
};