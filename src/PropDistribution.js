import React, {useRef, useState, useEffect} from 'react'
import { histogram } from 'd3-array';

import { PropDistributionVis } from './PropDistributionVis';

export const PropDistribution = ({unadjustedCohortData={}, setSelected}) => {

  // Track bins for treatment and control groups
  const [bins, setBins] = React.useState({"TBins":[], "CBins":[]});

  const binCount = 20;
  const n = unadjustedCohortData.propensity ? unadjustedCohortData.propensity.length : 0;

  useEffect(() => {
    if (unadjustedCohortData.confounds) {
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

      setBins({"TBins": newTBins, "CBins": newCBins});
    }

  }, [unadjustedCohortData])

  return (
    <div>
      <PropDistributionVis bins={bins} n={n} setSelected={setSelected}/> 
    </div>
  )
}