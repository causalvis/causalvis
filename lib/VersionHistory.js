"use strict";

exports.__esModule = true;
exports.VersionHistory = void 0;

var _react = _interopRequireWildcard(require("react"));

var _VersionTree = require("./VersionHistory/VersionTree");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/*
Props:
  - data: Array, data set before adjustment
  - treatment: String, name of treatment variable
  - outcome: String, name of outcome variable
*/
var VersionHistory = function VersionHistory(_ref) {
  var _ref$versions = _ref.versions,
      versions = _ref$versions === void 0 ? [] : _ref$versions;

  var _React$useState = _react["default"].useState({
    "children": [],
    "name": "All Versions"
  }),
      hierarchy = _React$useState[0],
      setHierarchy = _React$useState[1];

  (0, _react.useEffect)(function () {
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
          "name": "Cohort 1",
          "Cohort": v.Cohort,
          "ATE": v.ATE
        }];
      } else {
        var versionCount = newHierarchy[vDAGString].length;
        newHierarchy[vDAGString].push({
          "name": "Cohort " + (versionCount + 1),
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
  }, [versions]);
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("p", {
    id: "testSelect"
  }, "my content"), /*#__PURE__*/_react["default"].createElement(_VersionTree.VersionTree, {
    data: hierarchy
  }));
};

exports.VersionHistory = VersionHistory;