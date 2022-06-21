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
  - unadjustedCohortData: Object, data set before adjustment, {"confounds":[], "treatment":[], "propensity":[]}
  - adjustedCohortData: Object, data set after adjustment, {"confounds":[], "treatment":[], "propensity":[]}
  - propensity: Array, propensity scores for each item in the data set, order of items should be identical to unadjusted data set
  - weights: Array, weight of each item in the data set, order of items should be identical to unadjusted data set
  - updateFilter: Function, updates filter functions when a covariate range is selected
*/
export const CovariateBalance = ({unadjustedCohortData={}, adjustedCohortData, attributes=[], weights, updateFilter, sort, selected=[]}) => {

  // Unique treatment levels
  const [treatmentLevels, setTreatmentLevels] = React.useState();

  // Track standard mean differences for each attribute
  const [SMD, setSMD] = React.useState([]);
  const [SMDExtent, setSMDExtent] = React.useState([0, 1]);

  const [expand, setExpand] = React.useState(false);

  // const selected = [];

  function handleExpand(e, v) {
    // console.log(v);
    if (v === "collapse") {
      setExpand(false);
    } else if (v === "expand") {
      setExpand(true);
    } else {
      return;
    }
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

    if (unadjustedCohortData.confounds && unadjustedCohortData.confounds.length !== 0) {
      let newSMD = [];

      let treatmentAssignment = unadjustedCohortData.treatment;
      let dataUnadjusted = unadjustedCohortData.confounds;
      let propensity = unadjustedCohortData.propensity;

      // If no adjusted data set provided, use propensity to calculate IPW
      if (!adjustedCohortData) {
        // Get propensity of assigned treatment level
        let allPropensity = propensity.map((p, i) => p[treatmentAssignment[i]]);

        // Get inverse propensity weights
        let propensityWeights = allPropensity.map(p => 1/p);

        newSMD = getSMD(dataUnadjusted, null, propensityWeights, treatmentAssignment);
      }
      

      // console.log(treatmentAssignment, dataUnadjusted, propensity)

      // if (dataAdjusted && dataUnadjusted.length === dataAdjusted.length) {
      //   newSMD = getSMD(dataUnadjusted, dataAdjusted, null, treatmentAssignment);
      // } else if (weights && dataUnadjusted.length === weights.length) {
      //   newSMD = getSMD(dataUnadjusted, null, weights, treatmentAssignment);
      // } else if (propensity && dataUnadjusted.length === propensity.length) {
        
      // } else {
      //   console.log("Missing data");
      // }

      // setSMD(newSMD);

      setSMD(newSMD.sort((a, b) => a.adjusted > b.adjusted));

      let newSMDExtent = [Math.min(min(newSMD, d => d.unadjusted), min(newSMD, d => d.adjusted)), Math.max(max(newSMD, d => d.unadjusted), max(newSMD, d => d.adjusted))];
      setSMDExtent(newSMDExtent);
    }
    
  }, [unadjustedCohortData])

  useEffect(() => {
    let newSMD;

    if (sort === "Adjusted High to Low") {
      newSMD = SMD.sort((a, b) => a.adjusted > b.adjusted);
    } else if (sort === "Adjusted Low to High") {
      newSMD = SMD.sort((a, b) => a.adjusted < b.adjusted);
    } else if (sort === "Unadjusted High to Low") {
      newSMD = SMD.sort((a, b) => a.unadjusted > b.unadjusted);
    } else if (sort === "Unadjusted Low to High") {
      newSMD = SMD.sort((a, b) => a.unadjusted < b.unadjusted);
    } else if (sort === "Difference High to Low") {
      newSMD = SMD.sort((a, b) => Math.abs(a.unadjusted - a.adjusted) > Math.abs(b.unadjusted - b.adjusted));
    } else if (sort === "Difference Low to High") {
      newSMD = SMD.sort((a, b) => Math.abs(a.unadjusted - a.adjusted) < Math.abs(b.unadjusted - b.adjusted));
    }

    setSMD([...newSMD]);
  }, [sort])

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
                    unadjustedAttribute={unadjustedCohortData.confounds.map(d => d[value])}
                    unadjustedTreatment={unadjustedCohortData.treatment}
                    unadjustedPropensity={unadjustedCohortData.propensity}
                    attribute={value}
                    updateFilter={updateFilter}
                    selectedAttribute={selected.selectedData.map(d => d[value])} />
        })}
    </div>
      {/*<DistributionVis TDataset={TDataset} CDataset={CDataset} attribute="age" />*/}
    </div>
  )
}