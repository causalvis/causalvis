function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import React, { useState, useEffect } from 'react';
import { VersionTree } from './VersionHistory/VersionTree';
/*
Props:
  - data: Array, data set before adjustment
  - treatment: String, name of treatment variable
  - outcome: String, name of outcome variable
*/

export var VersionHistory = function VersionHistory(_ref) {
  var _ref$versions = _ref.versions,
      versions = _ref$versions === void 0 ? [] : _ref$versions,
      _dag = _ref._dag,
      _cohort = _ref._cohort;

  var _React$useState = React.useState({
    "children": [],
    "name": "All Versions"
  }),
      hierarchy = _React$useState[0],
      setHierarchy = _React$useState[1];

  var _React$useState2 = React.useState({
    "height": 120,
    "width": 1200,
    "margin": 30,
    "marginLeft": 10,
    "marginBottom": 30
  }),
      layout = _React$useState2[0],
      setLayout = _React$useState2[1];

  useEffect(function () {
    var newDAGs = [];
    var newHierarchy = {};

    var _loop = function _loop() {
      var v = _step.value;
      var vDAG = v.DAG;
      var vDAGString = JSON.stringify(vDAG);
      var isIncluded = newDAGs.filter(function (nd) {
        return nd === vDAGString;
      }).length > 0;

      if (!isIncluded) {
        newDAGs.push(vDAGString);
        newHierarchy[vDAGString] = [{
          "name": "Cohort 1: " + v.Cohort.length + " rows",
          "Cohort": v.Cohort,
          "ATE": v.ATE
        }];
      } else {
        var versionCount = newHierarchy[vDAGString].length;
        newHierarchy[vDAGString].push({
          "name": "Cohort " + (versionCount + 1) + ": " + v.Cohort.length + " rows",
          "Cohort": v.Cohort,
          "ATE": v.ATE
        });
      }
    };

    for (var _iterator = _createForOfIteratorHelperLoose(versions), _step; !(_step = _iterator()).done;) {
      _loop();
    }

    var data = {
      "children": [],
      "name": "All Versions"
    };
    var DAGUnique = Object.keys(newHierarchy);
    var DAGCount = DAGUnique.length;

    for (var i = 0; i < DAGCount; i++) {
      var d = DAGUnique[i];
      data.children.push({
        "name": "DAG " + (i + 1),
        "DAG": JSON.parse(d),
        "id": i,
        "children": newHierarchy[d]
      });
    }

    setHierarchy(data);

    if (versions.length > 5) {
      setLayout({
        "height": 24 * versions.length,
        "width": 1200,
        "margin": 30,
        "marginLeft": 10,
        "marginBottom": 30
      });
    }
  }, [versions]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(VersionTree, {
    layout: layout,
    data: hierarchy,
    _dag: _dag,
    _cohort: _cohort
  }));
};