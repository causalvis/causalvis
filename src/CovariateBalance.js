import React, {useState, useEffect} from 'react';

import { SMDVis } from './SMDVis';
import { min, max } from 'd3-array';

import { CompareDistributionVis } from './CompareDistributionVis';

import ViewHeadlineSharpIcon from '@mui/icons-material/ViewHeadlineSharp';
import ViewStreamSharpIcon from '@mui/icons-material/ViewStreamSharp';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

// import SortRoundedIcon from '@mui/icons-material/SortRounded';

/*
Props:
  - dataUnadjusted: Array, data set before adjustment
  - dataAdjusted: Array, data set after adjustment, order of items should be identical to unadjusted data set
  - treatment: String, name of treatment variable
               Array, treatment assignment for each item in the data set, order of items should be identical to unadjusted data set
  - propensity: Array, propensity scores for each item in the data set, order of items should be identical to unadjusted data set
  - weights: Array, weight of each item in the data set, order of items should be identical to unadjusted data set
*/
export const CovariateBalance = ({cohortData={}, dataAdjusted, weights, updateFilter}) => {

  // Unique treatment levels
  const [treatmentLevels, setTreatmentLevels] = React.useState();

  // Treatment assignment for dataset
  const [treatmentAssignment, setTreatmentAssignment] = React.useState();

  // Track standard mean differences for each attribute
  const [SMD, setSMD] = React.useState([]);
  const [SMDExtent, setSMDExtent] = React.useState([0, 1]);

  const [attributes, setAttributes] = React.useState([]);

  const [expand, setExpand] = React.useState(false);

  const selected = [];

  function handleExpand(e, v) {
    console.log(v);
    if (v === "collapse") {
      setExpand(false);
    } else if (v === "expand") {
      setExpand(true);
    } else {
      return;
    }
    // setExpand(!expand);
  }

  function getWeightedMean(x, w) {
    let total = 0;
    let totalWeight = 0;

    for (let i = 0; i < x.length; i++) {
      let xValue = x[i];
      let wValue = typeof w === "number" ? w : w[i];

      total += xValue * wValue;
      totalWeight += wValue;
    }

    return total/totalWeight;
  }

  function getWeightedVar(x, w, weighted_mean) {
    let total = 0;
    let totalWeight = 0;

    for (let i = 0; i < x.length; i++) {
      let xValue = x[i];
      let wValue = typeof w === "number" ? w : w[i];

      total += wValue * ((xValue - weighted_mean) ** 2);
      totalWeight += wValue;
    }

    return total/totalWeight;
  }

  function getVar(x, w) {
    let mean = x.reduce((sum, a) => sum + a, 0) / x.length;
    let total = 0;

    for (let i = 0; i < x.length; i++) {
      let xValue = x[i];

      total += (xValue - mean) ** 2;
    }

    return total/x.length;
  }

  function attributeSMD(x_treated, x_untreated, w_treated=1, w_untreated=1) {
    let mean_treated = getWeightedMean(x_treated, w_treated);
    let var_treated = getVar(x_treated, w_treated);

    let mean_untreated = getWeightedMean(x_untreated, w_untreated);
    let var_untreated = getVar(x_untreated, w_untreated);

    return (mean_treated - mean_untreated) / Math.sqrt(var_treated + var_untreated);
  }

  function getSMD(dataUnadjusted, dataAdjusted, weights, treatmentAssignment) {
    let newSMD = [];

    let attributes = Object.keys(dataUnadjusted[0]);
    // console.log(attributes);

    for (let a of attributes) {

      // console.log(a);

      // data before adjustment
      let x_unadjusted = dataUnadjusted.map(d => d[a]);

      let x_unadjusted_treated = x_unadjusted.filter((u, i) => treatmentAssignment[i] === 1);
      let x_unadjusted_untreated = x_unadjusted.filter((u, i) => treatmentAssignment[i] === 0);

      let SMD_unadjusted = attributeSMD(x_unadjusted_treated, x_unadjusted_untreated);

      let SMD_adjusted;

      // Use adjusted data if it exists, otherwise use weights
      if (dataAdjusted) {
        let x_adjusted = dataAdjusted.map(d => d[a]);

        let x_adjusted_treated = x_adjusted.filter((u, i) => treatmentAssignment[i] === 1);
        let x_adjusted_untreated = x_adjusted.filter((u, i) => treatmentAssignment[i] === 0);

        SMD_adjusted = attributeSMD(x_adjusted_treated, x_adjusted_untreated);
      } else {
        let x_adjusted_treated = x_unadjusted.filter((u, i) => treatmentAssignment[i] === 1);
        let x_adjusted_untreated = x_unadjusted.filter((u, i) => treatmentAssignment[i] === 0);

        let w_adjusted_treated = weights.filter((u, i) => treatmentAssignment[i] === 1);
        let w_adjusted_untreated = weights.filter((u, i) => treatmentAssignment[i] === 0);

        SMD_adjusted = attributeSMD(x_adjusted_treated, x_adjusted_untreated, w_adjusted_treated, w_adjusted_untreated);
      }

      newSMD.push({"covariate":a, "unadjusted": Math.abs(SMD_unadjusted), "adjusted": Math.abs(SMD_adjusted)});
    }

    return newSMD;
  }

  useEffect(() => {

    // console.log("reset");

    if (cohortData.confounds && cohortData.confounds.length !== 0) {
      let newSMD = [];

      let treatmentAssignment = cohortData.treatment;
      let dataUnadjusted = cohortData.confounds;
      let propensity = cohortData.propensity;

      // console.log(treatmentAssignment, dataUnadjusted, propensity)

      if (dataAdjusted && dataUnadjusted.length === dataAdjusted.length) {
        newSMD = getSMD(dataUnadjusted, dataAdjusted, null, treatmentAssignment);
      } else if (weights && dataUnadjusted.length === weights.length) {
        newSMD = getSMD(dataUnadjusted, null, weights, treatmentAssignment);
      } else if (propensity && dataUnadjusted.length === propensity.length) {
        let treatmentPropensity = propensity.map((p, i) => p[treatmentAssignment[i]]);
        let propensityWeights = treatmentPropensity.map(p => 1/p);
        newSMD = getSMD(dataUnadjusted, null, propensityWeights, treatmentAssignment);
      } else {
        console.log("Missing data");
      }

      setSMD(newSMD.sort((a, b) => a.adjusted > b.adjusted));

      let newSMDExtent = [Math.min(min(newSMD, d => d.unadjusted), min(newSMD, d => d.adjusted)), Math.max(max(newSMD, d => d.unadjusted), max(newSMD, d => d.adjusted))];
      setSMDExtent(newSMDExtent);
      setAttributes(Object.keys(dataUnadjusted[0]));
    }
    
  }, [cohortData])

  let SMDContainer = {"display": !expand ? "flex" : "none"};
  let attributesContainer = {"display": expand ? "flex" : "none",
                            "minWidth":"600px",
                            "flexDirection":"column",
                            "height": "600px",
                            "overflow":"scroll"};

  let testAttribute = ["age", "emp.var.rate", "euribor3m"]

  return (
    <div>
      <ToggleButtonGroup
        value={expand ? "expand" : "collapse"}
        exclusive
        onChange={(e, v) => handleExpand(e, v)}
        aria-label="text alignment"
      >
        <ToggleButton value="collapse" aria-label="left aligned">
          <ViewHeadlineSharpIcon />
        </ToggleButton>
        <ToggleButton value="expand" aria-label="centered">
          <ViewStreamSharpIcon />
        </ToggleButton>
      </ToggleButtonGroup>
      <div style={SMDContainer}>
        <SMDVis SMDDataset={SMD} SMDExtent={SMDExtent} />
      </div>
      <div style={attributesContainer}>
        {testAttribute.map((value, index) => {
          return <CompareDistributionVis
                    key={index}
                    unadjusted={cohortData.confounds.map(d => d[value])}
                    selection={selected.map(d => d[value])}
                    propensity={cohortData.propensity}
                    treatmentAssignment={cohortData.treatment}
                    refIndex={value}
                    updateFilter={updateFilter} />
        })}
    </div>
      {/*<DistributionVis TDataset={TDataset} CDataset={CDataset} attribute="age" />*/}
    </div>
  )
}