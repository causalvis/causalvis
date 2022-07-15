import React, {useRef, useState, useEffect} from 'react'
import { histogram } from 'd3-array';

import { PropDistributionVis } from './PropDistributionVis';

import { saveAs } from 'file-saver';

export const PropDistribution = ({unadjustedCohortData={}, adjustedCohortData, setSelected}) => {

  // Track bins for treatment and control groups
  const [bins, setBins] = React.useState({"TBins":[], "CBins":[]});
  const [binSize, setBinSize] = React.useState({"TBins":1, "CBins":1});

  const [selectRange, setSelectRange] = React.useState(null);
  const [selectedItems, setSelectedItems] = React.useState({"data":[], "propensity":[], "treatment":[]});

  const binCount = 20;
  const n = unadjustedCohortData.propensity ? unadjustedCohortData.propensity.length : 0;

  function downloadSelected() {
    let fileContent = new Blob([JSON.stringify(selectedItems, null, 4)], {
      type: 'application/json',
      name: 'selected.json'
    });

    saveAs(fileContent, 'selected.json');
  }

  useEffect(() => {

    let newSelectedItems = {"data":[], "propensity":[], "treatment":[]};

    if (!selectRange) {
      setSelectedItems(newSelectedItems);
    } else {
      for (let i = 0; i < unadjustedCohortData.propensity.length; i++) {
        let treatment = unadjustedCohortData.treatment[i]
        let propensity = unadjustedCohortData.propensity[i][treatment];
        // console.log(propensity);

        if (propensity >= selectRange[0] && propensity <= selectRange[1]) {
          newSelectedItems.data.push(unadjustedCohortData.confounds[i]);
          newSelectedItems.propensity.push(propensity);
          newSelectedItems.treatment.push(unadjustedCohortData.treatment[i]);
        }
      }

      setSelectedItems(newSelectedItems);
    }

  }, [selectRange])

  useEffect(() => {
    // console.log(adjustedCohortData);

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
      <p style={selectContainer}>{`${selectedItems.data.length}`} selected.&nbsp;<span style={linkStyle} onClick={() => downloadSelected()}><u>Download.</u></span></p>
      <PropDistributionVis bins={bins} n={binSize} setSelectRange={setSelectRange}/> 
    </div>
  )
}