import React, {useState, useEffect} from 'react';

import { CompareDistributionVis } from './CompareDistributionVis';
import { CovariateBalance } from './CovariateBalance';
import { PropDistribution } from './PropDistribution';

export const CohortEvaluator = ({CohortConfounds=[], CohortPropensity=[], CohortTreatments=[]}) => {

  const [attributes, setAttributes] = React.useState([]);
  const [selected, setSelected] = React.useState([]);

  useEffect(() => {
    setAttributes(Object.keys(CohortConfounds[0]));
  }, [CohortConfounds])

  let attributesContainer = {"display":"flex", "width":"100%", "flexWrap":"wrap"};
  let plotLayout = {"display":"flex"};

  return (
    <div>
      <div style={plotLayout}>
        <PropDistribution data={CohortConfounds} treatment={CohortTreatments} propensity={CohortPropensity} setSelected={setSelected} />
        <CovariateBalance dataUnadjusted={CohortConfounds} treatment={CohortTreatments} propensity={CohortPropensity} />
      </div>
      <div style={attributesContainer}>
        {selected.length > 0 ? attributes.map((value, index) => {
          return <CompareDistributionVis reference={CohortConfounds.map(d => d[value])} selection={selected.map(d => d[value])} refIndex={value} />
        }) : <div/> }
      </div>
    </div>
  )
}