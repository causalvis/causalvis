"use strict";

exports.__esModule = true;
exports.PropDistribution = void 0;

var _react = _interopRequireWildcard(require("react"));

var _d3Array = require("d3-array");

var _PropDistributionVis = require("./PropDistributionVis");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var PropDistribution = function PropDistribution(_ref) {
  var _ref$unadjustedCohort = _ref.unadjustedCohortData,
      unadjustedCohortData = _ref$unadjustedCohort === void 0 ? {} : _ref$unadjustedCohort,
      setSelected = _ref.setSelected;

  // Track bins for treatment and control groups
  var _React$useState = _react["default"].useState({
    "TBins": [],
    "CBins": []
  }),
      bins = _React$useState[0],
      setBins = _React$useState[1];

  var _React$useState2 = _react["default"].useState({
    "TBins": 1,
    "CBins": 1
  }),
      binSize = _React$useState2[0],
      setBinSize = _React$useState2[1];

  var binCount = 20;
  var n = unadjustedCohortData.propensity ? unadjustedCohortData.propensity.length : 0;
  (0, _react.useEffect)(function () {
    if (unadjustedCohortData.confounds) {
      var newTAttribute = [];
      var newCAttribute = [];

      for (var i = 0; i < unadjustedCohortData.confounds.length; i++) {
        var dataRow = JSON.parse(JSON.stringify(unadjustedCohortData.confounds[i]));
        var assignedTreatment = unadjustedCohortData.treatment[i]; // Separate treatment and control rows

        if (assignedTreatment === 0) {
          dataRow.propensity = unadjustedCohortData.propensity[i][1];
          newCAttribute.push(dataRow);
        } else {
          dataRow.propensity = unadjustedCohortData.propensity[i][1];
          newTAttribute.push(dataRow);
        }
      } // Get histogram for treatment and control data sets


      var h = (0, _d3Array.histogram)().value(function (d) {
        return d.propensity;
      }).domain([0, 1]).thresholds(binCount);
      var newTBins = h(newTAttribute);
      var newCBins = h(newCAttribute);
      var TBinSize = newTBins.reduce(function (count, current) {
        return count + current.length;
      }, 0);
      var CBinSize = newCBins.reduce(function (count, current) {
        return count + current.length;
      }, 0);
      setBins({
        "TBins": newTBins,
        "CBins": newCBins
      });
      setBinSize({
        "TBins": TBinSize === 0 ? 1 : TBinSize,
        "CBins": CBinSize === 0 ? 1 : CBinSize
      });
    }
  }, [unadjustedCohortData]);
  var propContainer = {
    "marginTop": "48px"
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: propContainer
  }, /*#__PURE__*/_react["default"].createElement(_PropDistributionVis.PropDistributionVis, {
    bins: bins,
    n: binSize,
    setSelected: setSelected
  }));
};

exports.PropDistribution = PropDistribution;