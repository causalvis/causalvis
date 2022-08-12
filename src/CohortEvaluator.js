import React, {useState, useEffect} from 'react';
import crossfilter from 'crossfilter2';

import { CovariateBalance } from './CohortEvaluator/CovariateBalance';
import { PropDistribution } from './CohortEvaluator/PropDistribution';

/*
Props:
  - unadjustedCohort: Array, data set before adjustment
  - adjustedCohort: Array, data set after adjustment
  - treatment: String, name of treatment variable
  - propensity: String, name of propensity variable, should be 1-D Array of propensities for each treatment level
*/
export const CohortEvaluator = ({unadjustedCohort=[],
                                 adjustedCohort=[],
                                 treatment="treatment",
                                 propensity="propensity",
                                 _selection,
                                 _iselection}) => {

  const [attributes, setAttributes] = React.useState([]);
  const [selected, setSelected] = React.useState({"selectedData":[], "treatment": false});

  const [unadjustedCohortData, setUnadjustedCohortData] = React.useState({"confounds":[], "propensity":[], "treatment":[]});
  const [adjustedCohortData, setAdjustedCohortData] = React.useState(null);

  let allData = JSON.parse(JSON.stringify(unadjustedCohort));
  let filteredData = crossfilter(allData);

  const [allAttributeFilters, setAllAttributeFilters] = React.useState({});

  useEffect(() => {
    // Get all the confounding attributes, excluding treatment and propensity score
    let allAttributes = new Set(Object.keys(unadjustedCohort[0]));
    allAttributes.delete(treatment);
    allAttributes.delete(propensity);
    allAttributes = Array.from(allAttributes);

    setAttributes(allAttributes);

    let newAttributeFilters = {};

    for (let a of allAttributes) {
      let attributefilter = filteredData.dimension(function(d) { return d[a]; });
      newAttributeFilters[a] = attributefilter;
    }

    setAllAttributeFilters(newAttributeFilters);

    let newCohortConfounds = JSON.parse(JSON.stringify(unadjustedCohort)).map(d => {delete d.treatment; delete d.propensity; return d});
    let newCohortTreatments = unadjustedCohort.map(d => d.treatment);
    let newCohortPropensity = unadjustedCohort.map(d => d.propensity);

    setUnadjustedCohortData({"confounds": newCohortConfounds, "propensity": newCohortPropensity, "treatment": newCohortTreatments});

  }, [unadjustedCohort])

  useEffect(() => {

    if (adjustedCohort.length > 0) {
      let newCohortConfounds = JSON.parse(JSON.stringify(adjustedCohort)).map(d => {delete d.treatment; delete d.propensity; return d});
      let newCohortTreatments = adjustedCohort.map(d => d.treatment);
      let newCohortPropensity = adjustedCohort.map(d => d.propensity);

      setAdjustedCohortData({"confounds": newCohortConfounds, "propensity": newCohortPropensity, "treatment": newCohortTreatments});
    }

  }, [adjustedCohort])

  function updateFilter(attribute, extent) {
    let attributeFilter = allAttributeFilters[attribute];
    attributeFilter.filter(extent);

    let newData = attributeFilter.top(Infinity);
    let newFilteredConfounds = JSON.parse(JSON.stringify(newData)).map(d => {delete d.treatment; delete d.propensity; return d});
    let newFilteredTreatments = newData.map(d => d.treatment);
    let newFilteredPropensity = newData.map(d => d.propensity);

    setCohortData({"confounds": newFilteredConfounds, "propensity": newFilteredPropensity, "treatment": newFilteredTreatments});
  }

  let plotLayout = {"display":"flex"};

  return (
    <div>
      <div style={plotLayout}>
        <PropDistribution
          unadjustedCohortData={unadjustedCohortData}
          adjustedCohortData={adjustedCohortData}
          setSelected={setSelected}
          _selection={_selection}
          _iselection={_iselection} />
        <CovariateBalance
          unadjustedCohortData={unadjustedCohortData}
          adjustedCohortData={adjustedCohortData}
          attributes={attributes}
          updateFilter={updateFilter}
          selected={selected} />
      </div>
    </div>
  )
}