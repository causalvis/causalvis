"use strict";

exports.__esModule = true;
exports.CompareVersions = void 0;

var _react = _interopRequireWildcard(require("react"));

var _AttributesManager = require("./AttributesManager");

var _CompareVersionsVis = require("./CompareVersionsVis");

var _d3Array = require("d3-array");

var _Autocomplete = _interopRequireDefault(require("@mui/material/Autocomplete"));

var _TextField = _interopRequireDefault(require("@mui/material/TextField"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var CompareVersions = function CompareVersions(_ref) {
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

  var _React$useState = _react["default"].useState([]),
      data = _React$useState[0],
      setData = _React$useState[1];

  var _React$useState2 = _react["default"].useState([]),
      flattened = _React$useState2[0],
      setFlattened = _React$useState2[1];

  var _React$useState3 = _react["default"].useState(""),
      stratifyBy = _React$useState3[0],
      setStratifyBy = _React$useState3[1];

  function handleChange(e, val) {
    if (!val) {
      setStratifyBy("");
    } else {
      setStratifyBy(val);
    }
  }

  (0, _react.useEffect)(function () {
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
  (0, _react.useEffect)(function () {
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

      for (var i = 0; i < flattened.length; i++) {
        var _v = flattened[i];
        var vAttributes = versionAttributes[i];

        if (vAttributes.indexOf(stratifyBy) < 0) {
          continue;
        } else if (effect === "") {
          _newData.push({
            "ATE": _v.ATE,
            "DAG": _v.DAG,
            "name": _v.name
          });
        } else if (attributeLevels[stratifyBy].length > 2) {
          (function () {
            var stratifyMean = (0, _d3Array.mean)(attributeLevels[stratifyBy]);

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
              "DAG": _v.DAG,
              "name": _v.name
            });

            _newData.push({
              "ATE": ATE1,
              "group": ">=" + stratifyMean.toPrecision(2),
              "DAG": _v.DAG,
              "name": _v.name
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
            "DAG": _v.DAG,
            "name": _v.name
          });

          _newData.push({
            "ATE": ATE1,
            "group": "1",
            "DAG": _v.DAG,
            "name": _v.name
          });
        } else {
          _newData.push({
            "ATE": _v.ATE,
            "DAG": _v.DAG,
            "name": _v.name
          });
        }
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
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: ateLayout
  }, /*#__PURE__*/_react["default"].createElement(_Autocomplete["default"], {
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
      return /*#__PURE__*/_react["default"].createElement(_TextField["default"], _extends({}, params, {
        sx: searchStyle,
        label: "Group by"
      }));
    }
  }), /*#__PURE__*/_react["default"].createElement(_CompareVersionsVis.CompareVersionsVis, {
    data: data,
    stratifyBy: stratifyBy,
    colorScale: colorScale
  }));
};

exports.CompareVersions = CompareVersions;