"use strict";

exports.__esModule = true;
exports.VersionHistory = void 0;

var _react = _interopRequireWildcard(require("react"));

var _d3Scale = require("d3-scale");

var _d3ScaleChromatic = require("d3-scale-chromatic");

var _CompareVersions = require("./VersionHistory/CompareVersions");

var _VersionTree = require("./VersionHistory/VersionTree");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var VersionHistory = function VersionHistory(_ref) {
  var _ref$versions = _ref.versions,
      versions = _ref$versions === void 0 ? [] : _ref$versions,
      _ref$effect = _ref.effect,
      effect = _ref$effect === void 0 ? "" : _ref$effect,
      ITE = _ref.ITE,
      _dag = _ref._dag,
      _cohort = _ref._cohort;

  var _React$useState = _react["default"].useState({}),
      hierarchy = _React$useState[0],
      setHierarchy = _React$useState[1];

  var _React$useState2 = _react["default"].useState({
    "height": 120,
    "width": 1200,
    "margin": 30,
    "marginLeft": 10,
    "marginBottom": 30
  }),
      layout = _React$useState2[0],
      setLayout = _React$useState2[1];

  var _React$useState3 = _react["default"].useState({
    "children": [],
    "name": "All Versions"
  }),
      nested = _React$useState3[0],
      setNested = _React$useState3[1];

  var _React$useState4 = _react["default"].useState(new Set()),
      allAttributes = _React$useState4[0],
      setAllAttributes = _React$useState4[1];

  var _React$useState5 = _react["default"].useState({}),
      attributeLevels = _React$useState5[0],
      setAttributeLevels = _React$useState5[1];

  var _React$useState6 = _react["default"].useState(function () {
    return function (x) {
      return "black";
    };
  }),
      colorScale = _React$useState6[0],
      setColorScale = _React$useState6[1];

  var _React$useState7 = _react["default"].useState([]),
      versionAttributes = _React$useState7[0],
      setVersionAttributes = _React$useState7[1];

  (0, _react.useEffect)(function () {
    var newDAGs = [];
    var newHierarchy = {};
    var newVersionAttributes = [];
    var newAllAttributes = [];
    var newAttributeLevels = {};

    var _loop = function _loop() {
      var v = _step.value;
      var vDAG = v.DAG;
      var vDAGString = JSON.stringify(vDAG);
      var isIncluded = newDAGs.filter(function (nd) {
        return nd === vDAGString;
      }).length > 0;
      var attributes = Object.keys(v.Cohort[0]);
      newVersionAttributes.push(attributes);
      newAllAttributes = newAllAttributes.concat(attributes);

      var _loop2 = function _loop2() {
        var a = _attributes[_i2];
        var versionAttributeValues = Array.from(new Set(v.Cohort.map(function (d) {
          return d[a];
        })));

        if (a in newAttributeLevels) {
          newAttributeLevels[a] = newAttributeLevels[a].concat(versionAttributeValues);
        } else {
          newAttributeLevels[a] = versionAttributeValues;
        }
      };

      for (var _i2 = 0, _attributes = attributes; _i2 < _attributes.length; _i2++) {
        _loop2();
      }

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

    setHierarchy(newHierarchy);
    var colors;

    if (newDAGs.length > 1) {
      colors = _d3ScaleChromatic.schemeYlGnBu[newDAGs.length + 1].slice(1);
    } else if (newDAGs.length === 1) {
      colors = [_d3ScaleChromatic.schemeYlGnBu[3][1]];
    } else {
      colors = ["gray"];
    }

    var newColorScale = (0, _d3Scale.scaleOrdinal)().domain(newDAGs).range(colors);
    setColorScale(function () {
      return function (x) {
        return newColorScale(x);
      };
    });

    for (var _i = 0, _Object$keys = Object.keys(newAttributeLevels); _i < _Object$keys.length; _i++) {
      var attr = _Object$keys[_i];
      newAttributeLevels[attr] = Array.from(new Set(newAttributeLevels[attr]));
    }

    setVersionAttributes(newVersionAttributes);
    setAllAttributes(new Set(newAllAttributes));
    setAttributeLevels(newAttributeLevels);
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

    setNested(data);

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
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_VersionTree.VersionTree, {
    layout: layout,
    data: nested,
    colorScale: colorScale,
    _dag: _dag,
    _cohort: _cohort
  }), versions.length > 0 ? /*#__PURE__*/_react["default"].createElement(_CompareVersions.CompareVersions, {
    versions: versions,
    hierarchy: hierarchy,
    allAttributes: allAttributes,
    versionAttributes: versionAttributes,
    attributeLevels: attributeLevels,
    effect: effect,
    colorScale: colorScale
  }) : /*#__PURE__*/_react["default"].createElement("div", null));
};

exports.VersionHistory = VersionHistory;