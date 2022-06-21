import React, {useRef, useState, useEffect} from 'react'
import { histogram } from 'd3-array';

import { PropDistributionVis } from './PropDistributionVis';

export const PropDistribution = ({cohortData={}, setSelected}) => {

  // Get bins for treatment and control groups
  const [bins, setBins] = React.useState({"TBins":[], "CBins":[]});
  // const [n, setN] = React.useState(cohortData.propensity ? cohortData.propensity.length : 0);

  const binCount = 20;
  const n = cohortData.propensity ? cohortData.propensity.length : 0;

  useEffect(() => {
    // console.log('reset prop')

    if (cohortData.confounds) {
      let newTAttribute = [];
      let newCAttribute = [];

      for (let i = 0; i < cohortData.confounds.length; i++) {
        let dataRow = JSON.parse(JSON.stringify(cohortData.confounds[i]));
        let assignedTreatment = cohortData.treatment[i];

        // console.log(dataRow);

        if (assignedTreatment === 0) {
          // console.log(assignedTreatment, propensity[i]);
          dataRow.propensity = cohortData.propensity[i][1];
          newCAttribute.push(dataRow);
        } else {
          // console.log(assignedTreatment, propensity[i]);
          dataRow.propensity = cohortData.propensity[i][1];
          newTAttribute.push(dataRow);
        }
      }

      var h = histogram().value(d => d.propensity).domain([0, 1]).thresholds(binCount);
      var newTBins = h(newTAttribute);
      var newCBins = h(newCAttribute);

      // console.log(cohortData.propensity.length)

      setBins({"TBins": newTBins, "CBins": newCBins});
      // setN(cohortData.propensity.length);
    }

  }, [cohortData])

  return (
    <div>
      <PropDistributionVis bins={bins} n={n} setSelected={setSelected}/> 
    </div>
  )
}