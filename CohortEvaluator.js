"use strict";

exports.__esModule = true;
exports.CohortEvaluator = void 0;

var _react = _interopRequireWildcard(require("react"));

var _crossfilter = _interopRequireDefault(require("crossfilter2"));

var _CovariateBalance = require("./CohortEvaluator/CovariateBalance");

var _PropDistribution = require("./CohortEvaluator/PropDistribution");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/*
Props:
  - unadjustedCohort: Array, data set before adjustment
  - adjustedCohort: Array, data set after adjustment
  - treatment: String, name of treatment variable
  - propensity: String, name of propensity variable, should be 1-D Array of propensities for each treatment level
*/
var CohortEvaluator = function CohortEvaluator(_ref) {
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

  var _React$useState = _react["default"].useState([]),
      attributes = _React$useState[0],
      setAttributes = _React$useState[1];

  var _React$useState2 = _react["default"].useState({
    "selectedData": [],
    "treatment": false
  }),
      selected = _React$useState2[0],
      setSelected = _React$useState2[1];

  var _React$useState3 = _react["default"].useState({
    "confounds": [],
    "propensity": [],
    "treatment": []
  }),
      unadjustedCohortData = _React$useState3[0],
      setUnadjustedCohortData = _React$useState3[1];

  var _React$useState4 = _react["default"].useState(null),
      adjustedCohortData = _React$useState4[0],
      setAdjustedCohortData = _React$useState4[1];

  var allData = JSON.parse(JSON.stringify(unadjustedCohort));
  var filteredData = (0, _crossfilter["default"])(allData);

  var _React$useState5 = _react["default"].useState({}),
      allAttributeFilters = _React$useState5[0],
      setAllAttributeFilters = _React$useState5[1];

  (0, _react.useEffect)(function () {
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
  (0, _react.useEffect)(function () {
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
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
    style: plotLayout
  }, /*#__PURE__*/_react["default"].createElement(_PropDistribution.PropDistribution, {
    unadjustedCohortData: unadjustedCohortData,
    adjustedCohortData: adjustedCohortData,
    setSelected: setSelected,
    _selection: _selection,
    _iselection: _iselection
  }), /*#__PURE__*/_react["default"].createElement(_CovariateBalance.CovariateBalance, {
    unadjustedCohortData: unadjustedCohortData,
    adjustedCohortData: adjustedCohortData,
    attributes: attributes,
    updateFilter: updateFilter,
    selected: selected
  })));
};

exports.CohortEvaluator = CohortEvaluator;