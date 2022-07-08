"use strict";

exports.__esModule = true;
exports.TreatmentEffectEvaluator = void 0;

var _react = _interopRequireWildcard(require("react"));

var _d3Array = require("d3-array");

var _BeeswarmLeft = require("./TreatmentEffectEvaluator/BeeswarmLeft");

var _BeeswarmTop = require("./TreatmentEffectEvaluator/BeeswarmTop");

var _CovariatesManager = require("./TreatmentEffectEvaluator/CovariatesManager");

var _LegendVis = require("./TreatmentEffectEvaluator/LegendVis");

var _TreatmentEffectVis = require("./TreatmentEffectEvaluator/TreatmentEffectVis");

var _TreatmentEffectVis_withViolin = require("./TreatmentEffectEvaluator/TreatmentEffectVis_withViolin");

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
var TreatmentEffectEvaluator = function TreatmentEffectEvaluator(_ref) {
  var _ref$data = _ref.data,
      data = _ref$data === void 0 ? [] : _ref$data,
      _ref$treatment = _ref.treatment,
      treatment = _ref$treatment === void 0 ? "treatment" : _ref$treatment,
      _ref$outcome = _ref.outcome,
      outcome = _ref$outcome === void 0 ? "outcome" : _ref$outcome;

  var _React$useState = _react["default"].useState([]),
      attributes = _React$useState[0],
      setAttributes = _React$useState[1];

  var _React$useState2 = _react["default"].useState({}),
      attributeLevels = _React$useState2[0],
      setAttributeLevels = _React$useState2[1];

  var _React$useState3 = _react["default"].useState([]),
      cohortData = _React$useState3[0],
      setCohortData = _React$useState3[1];

  var _React$useState4 = _react["default"].useState([]),
      stratify = _React$useState4[0],
      setStratify = _React$useState4[1];

  var _React$useState5 = _react["default"].useState([]),
      stratifiedData = _React$useState5[0],
      setStratifiedData = _React$useState5[1];

  (0, _react.useEffect)(function () {
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

    var _loop = function _loop() {
      var a = _step.value;
      var levels = Array.from(new Set(data.map(function (d) {
        return d[a];
      })));
      newAttributeLevels[a] = levels;
    };

    for (var _iterator = _createForOfIteratorHelperLoose(allAttributes), _step; !(_step = _iterator()).done;) {
      _loop();
    }

    setAttributeLevels(newAttributeLevels);
  }, [data]); // Add a new attribute to facet by
  // For each new attribute, also add the faceting threshold

  function changeStratify(v) {
    var indexV = stratify.map(function (d) {
      return d.attribute;
    }).indexOf(v);

    if (indexV < 0) {
      if (stratify.length === 3) {
        return;
      } // For continuous variables, set the default faceting threshold to be the mean


      var vThreshold = attributeLevels[v].length === 2 ? null : (0, _d3Array.mean)(data, function (d) {
        return d[v];
      }).toPrecision(2);
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
  } // Divide dataset based on faceting attributes and thresholds


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

  (0, _react.useEffect)(function () {
    var newStratifiedData = [];

    if (stratify.length === 1) {
      newStratifiedData.push({
        "data": JSON.parse(JSON.stringify(cohortData)),
        "stratifyBy": stratify[0].attribute,
        "title": "",
        "layout": {
          "height": 600,
          "width": 600,
          "margin": 20,
          "marginLeft": 20,
          "marginBottom": 35
        }
      });
      setStratifiedData([].concat(newStratifiedData));
    } else if (stratify.length === 2) {
      var _newStratifiedData = splitDataset(cohortData, stratify[1].attribute, stratify[1].threshold);

      _newStratifiedData = _newStratifiedData.map(function (s) {
        s.stratifyBy = stratify[0].attribute;
        s.layout = {
          "height": 600,
          "width": 300,
          "margin": 20,
          "marginLeft": 20,
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
          s.layout = {
            "height": 300,
            "width": 300,
            "margin": 20,
            "marginLeft": 20,
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
        "data": [],
        "stratifyBy": "",
        "title": "",
        "layout": {
          "height": 600,
          "width": 600,
          "margin": 20,
          "marginLeft": 20,
          "marginBottom": 35
        }
      });
      setStratifiedData([].concat(newStratifiedData));
    }
  }, [stratify]);
  var mainLayout = {
    "display": "grid",
    "grid-template-columns": "auto auto 1fr",
    "grid-template-rows": "auto auto 1fr",
    "grid-gap": "20px"
  };
  var covariateStyle = {
    "grid-column": "1/2",
    "grid-row": "3/4",
    "display": "flex",
    "alignItems": "center"
  };
  var headerStyle = {
    "grid-column": "3/4",
    "grid-row": "1/2",
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
    "grid-column": "3/4",
    "grid-row": "2/3",
    "width": "600px"
  };
  var bleftStyle = {
    "grid-column": "2/3",
    "grid-row": "3/4"
  };
  var allVis = {
    "grid-column": "3/4",
    "grid-row": "3/4",
    "width": "600px",
    "height": "600px",
    "display": "grid",
    "grid-template-columns": "1fr 1fr",
    "grid-template-rows": "1fr 1fr"
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: mainLayout
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: covariateStyle
  }, /*#__PURE__*/_react["default"].createElement(_CovariatesManager.CovariatesManager, {
    attributes: attributes,
    changeStratify: changeStratify,
    stratify: stratify.map(function (d) {
      return d.attribute;
    })
  })), /*#__PURE__*/_react["default"].createElement("div", {
    style: headerStyle
  }, /*#__PURE__*/_react["default"].createElement("p", {
    style: plotsTitle
  }, "Treatment Effect Plot"), /*#__PURE__*/_react["default"].createElement(_LegendVis.LegendVis, null)), /*#__PURE__*/_react["default"].createElement("div", {
    style: btopStyle
  }, stratify[1] ? /*#__PURE__*/_react["default"].createElement(_BeeswarmTop.BeeswarmTop, {
    data: cohortData,
    stratify: stratify[1].attribute,
    thresholdValue: stratify[1].threshold,
    updateTopThreshold: updateTopThreshold
  }) : /*#__PURE__*/_react["default"].createElement("div", null)), /*#__PURE__*/_react["default"].createElement("div", {
    style: bleftStyle
  }, stratify[2] ? /*#__PURE__*/_react["default"].createElement(_BeeswarmLeft.BeeswarmLeft, {
    data: cohortData,
    stratify: stratify[2].attribute,
    thresholdValue: stratify[2].threshold,
    updateLeftThreshold: updateLeftThreshold
  }) : /*#__PURE__*/_react["default"].createElement("div", null)), /*#__PURE__*/_react["default"].createElement("div", {
    style: allVis
  }, stratifiedData.map(function (value, index) {
    return /*#__PURE__*/_react["default"].createElement(_TreatmentEffectVis_withViolin.TreatmentEffectVisViolin, {
      key: "vis" + value.stratifyBy + index,
      index: index,
      allData: value
    });
  })));
};

exports.TreatmentEffectEvaluator = TreatmentEffectEvaluator;