import React, { useRef, useState, useEffect } from 'react';
import { histogram } from 'd3-array';
import { PropDistributionVis } from './PropDistributionVis';
import { saveAs } from 'file-saver';
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

  var _React$useState3 = React.useState(null),
      selectRange = _React$useState3[0],
      setSelectRange = _React$useState3[1];

  var _React$useState4 = React.useState({
    "data": [],
    "propensity": [],
    "treatment": []
  }),
      selectedItems = _React$useState4[0],
      setSelectedItems = _React$useState4[1];

  var binCount = 20;
  var n = unadjustedCohortData.propensity ? unadjustedCohortData.propensity.length : 0;

  function downloadSelected() {
    var fileContent = new Blob([JSON.stringify(selectedItems, null, 4)], {
      type: 'application/json',
      name: 'selected.json'
    });
    saveAs(fileContent, 'selected.json');
  }

  useEffect(function () {
    if (!selectRange) {
      return;
    }

    var newSelectedItems = {
      "data": [],
      "propensity": [],
      "treatment": []
    };

    for (var i = 0; i < unadjustedCohortData.propensity.length; i++) {
      var treatment = unadjustedCohortData.treatment[i];
      var propensity = unadjustedCohortData.propensity[i][treatment]; // console.log(propensity);

      if (propensity >= selectRange[0] && propensity <= selectRange[1]) {
        newSelectedItems.data.push(unadjustedCohortData.confounds[i]);
        newSelectedItems.propensity.push(propensity);
        newSelectedItems.treatment.push(unadjustedCohortData.treatment[i]);
      }
    } // console.log(newSelectedItems);


    setSelectedItems(newSelectedItems);
  }, [selectRange]);
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
  var linkStyle = {
    "color": "steelblue",
    "cursor": "pointer"
  };
  var propContainer = {
    "marginTop": "0px"
  };
  var selectContainer = {
    "height": "48px",
    "margin": "0px",
    "display": "flex",
    "alignItems": "center",
    "fontFamily": "sans-serif",
    "fontSize": "11px"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: propContainer
  }, /*#__PURE__*/React.createElement("p", {
    style: selectContainer
  }, "" + selectedItems.data.length, " selected.\xA0", /*#__PURE__*/React.createElement("span", {
    style: linkStyle,
    onClick: function onClick() {
      return downloadSelected();
    }
  }, /*#__PURE__*/React.createElement("u", null, "Download."))), /*#__PURE__*/React.createElement(PropDistributionVis, {
    bins: bins,
    n: binSize,
    setSelectRange: setSelectRange
  }));
};