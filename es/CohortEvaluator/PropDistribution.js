import React, { useRef, useState, useEffect } from 'react';
import { histogram } from 'd3-array';
import { PropDistributionVis } from './PropDistributionVis';
export var PropDistribution = function PropDistribution(_ref) {
  var _ref$unadjustedCohort = _ref.unadjustedCohortData,
      unadjustedCohortData = _ref$unadjustedCohort === void 0 ? {} : _ref$unadjustedCohort,
      setSelected = _ref.setSelected;

  // Track bins for treatment and control groups
  var _React$useState = React.useState({
    "TBins": [],
    "CBins": []
  }),
      bins = _React$useState[0],
      setBins = _React$useState[1];

  var _React$useState2 = React.useState({
    "TBins": 1,
    "CBins": 1
  }),
      binSize = _React$useState2[0],
      setBinSize = _React$useState2[1];

  var binCount = 20;
  var n = unadjustedCohortData.propensity ? unadjustedCohortData.propensity.length : 0;
  useEffect(function () {
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


      var h = histogram().value(function (d) {
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
  return /*#__PURE__*/React.createElement("div", {
    style: propContainer
  }, /*#__PURE__*/React.createElement(PropDistributionVis, {
    bins: bins,
    n: binSize,
    setSelected: setSelected
  }));
};