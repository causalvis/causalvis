"use strict";

exports.__esModule = true;
exports.PropDistribution = void 0;

var _react = _interopRequireWildcard(require("react"));

var _d3Array = require("d3-array");

var _PropDistributionVis = require("./PropDistributionVis");

var _DownloadSelectedDialog = require("./DownloadSelectedDialog");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var PropDistribution = function PropDistribution(_ref) {
  var _ref$unadjustedCohort = _ref.unadjustedCohortData,
      unadjustedCohortData = _ref$unadjustedCohort === void 0 ? {} : _ref$unadjustedCohort,
      adjustedCohortData = _ref.adjustedCohortData,
      setSelected = _ref.setSelected,
      _selection = _ref._selection,
      _iselection = _ref._iselection;

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

  var _React$useState3 = _react["default"].useState(null),
      selectRange = _React$useState3[0],
      setSelectRange = _React$useState3[1];

  var _React$useState4 = _react["default"].useState({
    "confounds": [],
    "propensity": [],
    "treatment": []
  }),
      selectedItems = _React$useState4[0],
      setSelectedItems = _React$useState4[1];

  var _React$useState5 = _react["default"].useState({
    "confounds": [],
    "propensity": [],
    "treatment": []
  }),
      inverseSelectedItems = _React$useState5[0],
      setInverseSelectedItems = _React$useState5[1];

  var _React$useState6 = _react["default"].useState(false),
      openDownload = _React$useState6[0],
      setOpenDownload = _React$useState6[1];

  var binCount = 20;
  var n = unadjustedCohortData.propensity ? unadjustedCohortData.propensity.length : 0;

  function handleDownloadClose() {
    setOpenDownload(false);
  }

  function updateJupyter(selected, inverseSelected) {
    var jupyter_selection = document.getElementById(_selection);
    var jupyter_iselection = document.getElementById(_iselection); // console.log("looking for jupyter...", jupyter_selection, jupyter_iselection);

    if (jupyter_selection) {
      // console.log("setting selection...");
      jupyter_selection.value = JSON.stringify(selected);
      var event = document.createEvent('HTMLEvents');
      event.initEvent('input', false, true);
      jupyter_selection.dispatchEvent(event);
    }

    if (jupyter_iselection) {
      // console.log("setting inverse selection...");
      jupyter_iselection.value = JSON.stringify(inverseSelected);
      var event = document.createEvent('HTMLEvents');
      event.initEvent('input', false, true);
      jupyter_iselection.dispatchEvent(event);
    }
  }

  function changeSelection(selectRange) {
    // console.log(selectRange);
    setSelectRange(selectRange);
    var newSelectedItems = {
      "confounds": [],
      "propensity": [],
      "treatment": []
    };
    var newInverseSelection = {
      "confounds": [],
      "propensity": [],
      "treatment": []
    };

    if (!selectRange) {
      // console.log("no range");
      setSelectedItems(newSelectedItems);
      updateJupyter(newSelectedItems, unadjustedCohortData);
    } else if (!adjustedCohortData) {
      for (var i = 0; i < unadjustedCohortData.confounds.length; i++) {
        var treatment = unadjustedCohortData.treatment[i];
        var propensity = unadjustedCohortData.propensity[i][1];

        if (propensity >= selectRange[0] && propensity <= selectRange[1]) {
          newSelectedItems.confounds.push(unadjustedCohortData.confounds[i]);
          newSelectedItems.propensity.push(propensity);
          newSelectedItems.treatment.push(unadjustedCohortData.treatment[i]);
        } else {
          newInverseSelection.confounds.push(unadjustedCohortData.confounds[i]);
          newInverseSelection.propensity.push(propensity);
          newInverseSelection.treatment.push(unadjustedCohortData.treatment[i]);
        }
      } // console.log(newInverseSelection);


      setSelectedItems(newSelectedItems);
      updateJupyter(newSelectedItems, newInverseSelection);
    } else {
      for (var _i = 0; _i < adjustedCohortData.confounds.length; _i++) {
        var _treatment = adjustedCohortData.treatment[_i];
        var _propensity = adjustedCohortData.propensity[_i][1];

        if (_propensity >= selectRange[0] && _propensity <= selectRange[1]) {
          newSelectedItems.confounds.push(adjustedCohortData.confounds[_i]);
          newSelectedItems.propensity.push(_propensity);
          newSelectedItems.treatment.push(adjustedCohortData.treatment[_i]);
        } else {
          newInverseSelection.confounds.push(adjustedCohortData.confounds[_i]);
          newInverseSelection.propensity.push(_propensity);
          newInverseSelection.treatment.push(adjustedCohortData.treatment[_i]);
        }
      }

      setSelectedItems(newSelectedItems);
      updateJupyter(newSelectedItems, newInverseSelection);
    }
  }

  (0, _react.useEffect)(function () {
    if (!adjustedCohortData && unadjustedCohortData.confounds) {
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
    } else if (adjustedCohortData.confounds) {
      var _newTAttribute = [];
      var _newCAttribute = [];

      for (var _i2 = 0; _i2 < adjustedCohortData.confounds.length; _i2++) {
        var _dataRow = JSON.parse(JSON.stringify(adjustedCohortData.confounds[_i2]));

        var _assignedTreatment = adjustedCohortData.treatment[_i2]; // Separate treatment and control rows

        if (_assignedTreatment === 0) {
          _dataRow.propensity = adjustedCohortData.propensity[_i2][1];

          _newCAttribute.push(_dataRow);
        } else {
          _dataRow.propensity = adjustedCohortData.propensity[_i2][1];

          _newTAttribute.push(_dataRow);
        }
      } // Get histogram for treatment and control data sets


      var h = (0, _d3Array.histogram)().value(function (d) {
        return d.propensity;
      }).domain([0, 1]).thresholds(binCount);
      var newTBins = h(_newTAttribute);
      var newCBins = h(_newCAttribute);
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
  }, [unadjustedCohortData, adjustedCohortData]);
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
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: propContainer
  }, /*#__PURE__*/_react["default"].createElement(_DownloadSelectedDialog.DownloadSelectedDialog, {
    open: openDownload,
    handleDownloadClose: handleDownloadClose,
    selectedItems: selectedItems
  }), /*#__PURE__*/_react["default"].createElement("p", {
    style: selectContainer
  }, "" + selectedItems.confounds.length, " selected.\xA0", /*#__PURE__*/_react["default"].createElement("span", {
    style: linkStyle,
    onClick: function onClick() {
      return setOpenDownload(true);
    }
  }, /*#__PURE__*/_react["default"].createElement("u", null, "Download."))), /*#__PURE__*/_react["default"].createElement(_PropDistributionVis.PropDistributionVis, {
    bins: bins,
    n: binSize,
    setSelectRange: changeSelection
  }));
};

exports.PropDistribution = PropDistribution;