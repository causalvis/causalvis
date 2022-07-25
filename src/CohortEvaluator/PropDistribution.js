import React, {useRef, useState, useEffect} from 'react'
import { histogram } from 'd3-array';

import { PropDistributionVis } from './PropDistributionVis';
import { DownloadSelectedDialog } from './DownloadSelectedDialog';

export const PropDistribution = ({unadjustedCohortData={},
                                  adjustedCohortData,
                                  setSelected,
                                  _selection,
                                  _iselection}) => {

  // Track bins for treatment and control groups
  const [bins, setBins] = React.useState({"TBins":[], "CBins":[]});
  const [binSize, setBinSize] = React.useState({"TBins":1, "CBins":1});

  const [selectRange, setSelectRange] = React.useState(null);
  const [selectedItems, setSelectedItems] = React.useState({"confounds":[], "propensity":[], "treatment":[]});
  const [inverseSelectedItems, setInverseSelectedItems] = React.useState({"confounds":[], "propensity":[], "treatment":[]});

  const [openDownload, setOpenDownload] = React.useState(false);

  const binCount = 20;
  const n = unadjustedCohortData.propensity ? unadjustedCohortData.propensity.length : 0;

  function handleDownloadClose() {
    setOpenDownload(false);
  }

  function updateJupyter(selected, inverseSelected) {
    let jupyter_selection = document.getElementById(_selection);
    let jupyter_iselection = document.getElementById(_iselection);

    // console.log("looking for jupyter...", jupyter_selection, jupyter_iselection);

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

  useEffect(() => {

    let newSelectedItems = {"confounds":[], "propensity":[], "treatment":[]};
    let newInverseSelection = {"confounds":[], "propensity":[], "treatment":[]};

    if (!selectRange) {

      setSelectedItems(newSelectedItems);
      updateJupyter(newSelectedItems, unadjustedCohortData);

    } else if (!adjustedCohortData) {
      for (let i = 0; i < unadjustedCohortData.confounds.length; i++) {
        let treatment = unadjustedCohortData.treatment[i]
        let propensity = unadjustedCohortData.propensity[i][1];

        if (propensity >= selectRange[0] && propensity <= selectRange[1]) {
          newSelectedItems.confounds.push(unadjustedCohortData.confounds[i]);
          newSelectedItems.propensity.push(propensity);
          newSelectedItems.treatment.push(unadjustedCohortData.treatment[i]);
        } else {
          newInverseSelection.confounds.push(unadjustedCohortData.confounds[i]);
          newInverseSelection.propensity.push(propensity);
          newInverseSelection.treatment.push(unadjustedCohortData.treatment[i]);
        }
      }

      setSelectedItems(newSelectedItems);
      updateJupyter(newSelectedItems, newInverseSelection);

    } else {
      for (let i = 0; i < adjustedCohortData.confounds.length; i++) {
        let treatment = adjustedCohortData.treatment[i]
        let propensity = adjustedCohortData.propensity[i][1];

        if (propensity >= selectRange[0] && propensity <= selectRange[1]) {
          newSelectedItems.confounds.push(adjustedCohortData.confounds[i]);
          newSelectedItems.propensity.push(propensity);
          newSelectedItems.treatment.push(adjustedCohortData.treatment[i]);
        } else {
          newInverseSelection.confounds.push(adjustedCohortData.confounds[i]);
          newInverseSelection.propensity.push(propensity);
          newInverseSelection.treatment.push(adjustedCohortData.treatment[i]);
        }
      }

      setSelectedItems(newSelectedItems);
      updateJupyter(newSelectedItems, newInverseSelection);

    }

  }, [selectRange])

  useEffect(() => {

    if (!adjustedCohortData && unadjustedCohortData.confounds) {
      let newTAttribute = [];
      let newCAttribute = [];

      for (let i = 0; i < unadjustedCohortData.confounds.length; i++) {
        let dataRow = JSON.parse(JSON.stringify(unadjustedCohortData.confounds[i]));
        let assignedTreatment = unadjustedCohortData.treatment[i];

        // Separate treatment and control rows
        if (assignedTreatment === 0) {
          dataRow.propensity = unadjustedCohortData.propensity[i][1];
          newCAttribute.push(dataRow);
        } else {
          dataRow.propensity = unadjustedCohortData.propensity[i][1];
          newTAttribute.push(dataRow);
        }
      }

      // Get histogram for treatment and control data sets
      var h = histogram().value(d => d.propensity).domain([0, 1]).thresholds(binCount);
      var newTBins = h(newTAttribute);
      var newCBins = h(newCAttribute);

      var TBinSize = newTBins.reduce((count, current) => count + current.length, 0);
      var CBinSize = newCBins.reduce((count, current) => count + current.length, 0);

      setBins({"TBins": newTBins, "CBins": newCBins});
      setBinSize({"TBins": TBinSize === 0 ? 1 : TBinSize, 
                  "CBins": CBinSize === 0 ? 1 : CBinSize});
    } else if (adjustedCohortData.confounds) {
      let newTAttribute = [];
      let newCAttribute = [];

      for (let i = 0; i < adjustedCohortData.confounds.length; i++) {
        let dataRow = JSON.parse(JSON.stringify(adjustedCohortData.confounds[i]));
        let assignedTreatment = adjustedCohortData.treatment[i];

        // Separate treatment and control rows
        if (assignedTreatment === 0) {
          dataRow.propensity = adjustedCohortData.propensity[i][1];
          newCAttribute.push(dataRow);
        } else {
          dataRow.propensity = adjustedCohortData.propensity[i][1];
          newTAttribute.push(dataRow);
        }
      }

      // Get histogram for treatment and control data sets
      var h = histogram().value(d => d.propensity).domain([0, 1]).thresholds(binCount);
      var newTBins = h(newTAttribute);
      var newCBins = h(newCAttribute);

      var TBinSize = newTBins.reduce((count, current) => count + current.length, 0);
      var CBinSize = newCBins.reduce((count, current) => count + current.length, 0);

      setBins({"TBins": newTBins, "CBins": newCBins});
      setBinSize({"TBins": TBinSize === 0 ? 1 : TBinSize, 
                  "CBins": CBinSize === 0 ? 1 : CBinSize});
    }

  }, [unadjustedCohortData, adjustedCohortData])

  let linkStyle = {"color":"steelblue", "cursor":"pointer"};
  let propContainer = {"marginTop":"0px"};
  let selectContainer = {"height":"48px",
                         "margin":"0px",
                         "display":"flex",
                         "alignItems":"center",
                         "fontFamily":"sans-serif",
                         "fontSize":"11px",};

  return (
    <div style={propContainer}>
      <DownloadSelectedDialog
        open={openDownload}
        handleDownloadClose={handleDownloadClose}
        selectedItems={selectedItems} />
      <p style={selectContainer}>{`${selectedItems.confounds.length}`} selected.&nbsp;<span style={linkStyle} onClick={() => setOpenDownload(true)}><u>Download.</u></span></p>
      <PropDistributionVis bins={bins} n={binSize} setSelectRange={setSelectRange}/> 
    </div>
  )
}