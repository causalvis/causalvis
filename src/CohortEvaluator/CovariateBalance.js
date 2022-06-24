import React, {useState, useEffect} from 'react';

import { SMDVis } from './SMDVis';
import { min, max } from 'd3-array';

import { CompareDistributionVis } from './CompareDistributionVis';
import { CompareHistogramVis } from './CompareHistogramVis';
import { CovariateSelector } from './CovariateSelector';
import { SMDMenu } from './SMDMenu'

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
export const CovariateBalance = ({unadjustedCohortData={}, adjustedCohortData, attributes=[], weights, updateFilter, selected=[]}) => {

  // Unique treatment levels
  const [treatmentLevels, setTreatmentLevels] = React.useState();
  const [attributeLevels, setAttributeLevels] = React.useState({});

  // Track standard mean differences for each attribute
  const [SMD, setSMD] = React.useState([]);
  const [SMDExtent, setSMDExtent] = React.useState([0, 1]);

  const [expand, setExpand] = React.useState(false);

  const [attributeDetails, setAttributeDetails] = React.useState([]);
  const [customDetails, setCustomDetails] = React.useState(false);

  const [sort, setSort] = React.useState("Adjusted High to Low");

  const [covariateOpen, setCovariateOpen] = React.useState(false);

  // const selected = [];

  function hideCovariate(v) {
    let cIndex = attributeDetails.indexOf(v);
    attributeDetails.splice(cIndex, 1);

    setAttributeDetails([...attributeDetails]);
    setCustomDetails(true);
  }

  function showCovariate(v) {
    setAttributeDetails([...attributeDetails, v]);
    setCustomDetails(true);
  }

  function handleEdit() {
    setCovariateOpen(true);
  }

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
      
      let newAttributeLevels = {};

      for (let a of attributes) {
        let attributeValues = dataUnadjusted.map(d => d[a]);
        newAttributeLevels[a] = Array.from(new Set(attributeValues));
      }

      setAttributeLevels(newAttributeLevels);

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

      let SMDSorted = newSMD.sort((a, b) => a.adjusted < b.adjusted);
      setSMD(SMDSorted);
      
      let newAttributeDetails = SMDSorted.filter(s => s.adjusted > 0.1);
      setAttributeDetails(newAttributeDetails.map(s => s.covariate));

      let newSMDExtent = [Math.min(min(newSMD, d => d.unadjusted), min(newSMD, d => d.adjusted)), Math.max(max(newSMD, d => d.unadjusted), max(newSMD, d => d.adjusted))];
      setSMDExtent(newSMDExtent);
    }
    
  }, [unadjustedCohortData])

  useEffect(() => {
    let newSMD;
    // let newAttributeDetails;

    if (sort === "Adjusted High to Low") {
      newSMD = SMD.sort((a, b) => a.adjusted < b.adjusted);
    } else if (sort === "Adjusted Low to High") {
      newSMD = SMD.sort((a, b) => a.adjusted > b.adjusted);
    } else if (sort === "Unadjusted High to Low") {
      newSMD = SMD.sort((a, b) => a.unadjusted < b.unadjusted);
    } else if (sort === "Unadjusted Low to High") {
      newSMD = SMD.sort((a, b) => a.unadjusted > b.unadjusted);
    } else if (sort === "Difference High to Low") {
      newSMD = SMD.sort((a, b) => Math.abs(a.unadjusted - a.adjusted) > Math.abs(b.unadjusted - b.adjusted));
    } else if (sort === "Difference Low to High") {
      newSMD = SMD.sort((a, b) => Math.abs(a.unadjusted - a.adjusted) < Math.abs(b.unadjusted - b.adjusted));
    }

    setSMD([...newSMD]);

    // let newAttributeDetails = newSMD.filter(s => s.adjusted > 0.1);
    // setAttributeDetails(newAttributeDetails.map(s => s.covariate));
  }, [sort])

  let SMDContainer = {"height": !expand ? "auto" : "0px", "overflow": "hidden", "display": "flex"};
  let attributesContainer = {"minWidth":"600px",
                            "marginTop":"30px",
                            "flexDirection":"column",
                            "height": expand ? "480px" : "0px",
                            "overflow":"scroll"};
  let detailsStyle = {"fontFamily":"sans-serif", "fontSize":"11px"};
  let symbolStyle = {"verticalAlign":"sub"};
  let linkStyle = {"color":"steelblue", "cursor":"pointer"};

  // let testAttribute = ["age", "cons.price.idx", "emp.var.rate", "euribor3m", "job=blue-collar", "month=aug"];
  let testAttribute = ["cons.price.idx"];

  return (
    <div>
      <CovariateSelector open={covariateOpen} handleClose={() => setCovariateOpen(false)} attributes={attributes}/>
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
      <div>
        <div style={SMDContainer}>
          <SMDVis SMDDataset={SMD} SMDExtent={SMDExtent} />
          <SMDMenu setSort={setSort} />
        </div>
        <div style={attributesContainer}>
          {
            customDetails
              ? <p style={detailsStyle}><span style={linkStyle} onClick={() => handleEdit()}><u>Select covariates.</u></span></p>
              : <p style={detailsStyle}><span style={symbolStyle}>*</span> only showing covariate details for SMD > 0.1. <span style={linkStyle} onClick={() => handleEdit()}><u>Select covariates.</u></span></p>
          }
          {attributeDetails.map((value, index) => {
            if (attributeLevels[value] && attributeLevels[value].length === 2) {
              return <CompareHistogramVis
                      key={value}
                      unadjustedAttribute={unadjustedCohortData.confounds.map(d => d[value])}
                      unadjustedTreatment={unadjustedCohortData.treatment}
                      unadjustedPropensity={unadjustedCohortData.propensity}
                      attribute={value}
                      updateFilter={updateFilter}
                      selectedAttribute={selected.selectedData.map(d => d[value])}
                      selectedTreatment={selected.treatment}
                      hideCovariate={hideCovariate} />
            } else {
              return <CompareDistributionVis
                      key={value}
                      unadjustedAttribute={unadjustedCohortData.confounds.map(d => d[value])}
                      unadjustedTreatment={unadjustedCohortData.treatment}
                      unadjustedPropensity={unadjustedCohortData.propensity}
                      attribute={value}
                      updateFilter={updateFilter}
                      selectedAttribute={selected.selectedData.map(d => d[value])}
                      selectedTreatment={selected.treatment}
                      hideCovariate={hideCovariate} />
            }
          })}
        </div>
      </div>
      {/*<DistributionVis TDataset={TDataset} CDataset={CDataset} attribute="age" />*/}
    </div>
  )
}