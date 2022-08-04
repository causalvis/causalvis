function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import React, { useRef, useState, useEffect } from 'react';
import { AttributesManager } from './AttributesManager';
import { CompareVersionsVis } from './CompareVersionsVis';
import { mean } from 'd3-array';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
export var CompareVersions = function CompareVersions(_ref) {
  var _ref$versions = _ref.versions,
      versions = _ref$versions === void 0 ? [] : _ref$versions,
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

  var _React$useState2 = React.useState(""),
      stratifyBy = _React$useState2[0],
      setStratifyBy = _React$useState2[1]; // console.log(allAttributes, versionAttributes);


  function handleChange(e, val) {
    if (!val) {
      setStratifyBy("");
    } else {
      setStratifyBy(val);
    }
  }

  useEffect(function () {
    // console.log(stratifyBy);
    if (stratifyBy == "") {
      var newData = [];

      for (var _iterator = _createForOfIteratorHelperLoose(versions), _step; !(_step = _iterator()).done;) {
        var v = _step.value;
        newData.push({
          "ATE": v.ATE,
          "DAG": JSON.stringify(v.DAG)
        });
      }

      setData(newData);
    } else {
      var _newData = [];

      for (var i = 0; i < versions.length; i++) {
        var _v = versions[i];
        var vAttributes = versionAttributes[i];

        if (vAttributes.indexOf(stratifyBy) < 0) {
          continue;
        } else if (effect === "") {
          _newData.push({
            "ATE": _v.ATE,
            "DAG": JSON.stringify(_v.DAG)
          });
        } else if (attributeLevels[stratifyBy].length > 2) {
          (function () {
            var stratifyMean = mean(attributeLevels[stratifyBy]);

            var stratify0 = _v.Cohort.filter(function (d) {
              return d[stratifyBy] < stratifyMean;
            });

            var stratify1 = _v.Cohort.filter(function (d) {
              return d[stratifyBy] >= stratifyMean;
            });

            var ATE0 = getATE(stratify0);
            var ATE1 = getATE(stratify1);

            _newData.push({
              "ATE": ATE0,
              "group": "<" + stratifyMean.toPrecision(2),
              "DAG": JSON.stringify(_v.DAG)
            });

            _newData.push({
              "ATE": ATE1,
              "group": ">=" + stratifyMean.toPrecision(2),
              "DAG": JSON.stringify(_v.DAG)
            });
          })();
        } else if (attributeLevels[stratifyBy].length == 2) {
          var stratify0 = _v.Cohort.filter(function (d) {
            return d[stratifyBy] === 0;
          });

          var stratify1 = _v.Cohort.filter(function (d) {
            return d[stratifyBy] === 1;
          });

          var ATE0 = getATE(stratify0);
          var ATE1 = getATE(stratify1);

          _newData.push({
            "ATE": ATE0,
            "group": "0",
            "DAG": JSON.stringify(_v.DAG)
          });

          _newData.push({
            "ATE": ATE1,
            "group": "1",
            "DAG": JSON.stringify(_v.DAG)
          });
        } else {
          _newData.push({
            "ATE": _v.ATE,
            "DAG": JSON.stringify(_v.DAG)
          });
        }
      }

      setData(_newData);
    }
  }, [versions, stratifyBy, attributeLevels]);

  function getATE(cohort) {
    var total = 0;

    for (var _iterator2 = _createForOfIteratorHelperLoose(cohort), _step2; !(_step2 = _iterator2()).done;) {
      var i = _step2.value;
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