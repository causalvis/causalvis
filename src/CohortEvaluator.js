import React, {useState, useEffect} from 'react';
import crossfilter from 'crossfilter2';

import { CovariateBalance } from './CovariateBalance';
import { PropDistribution } from './PropDistribution';
import { SMDMenu } from './SMDMenu'

/*
Props:
  - unadjustedCohort: Array, data set before adjustment
  - adjustedCohort: Array, data set after adjustment
  - treatment: String, name of treatment variable
  - propensity: String, name of propensity variable, should be 1-D Array of propensities for each treatment level
  - weights: Array, weight of each item in the data set, order of items should be identical to unadjusted data set
*/
export const CohortEvaluator = ({unadjustedCohort=[], adjustedCohort=[], treatment="treatment", propensity="propensity"}) => {

  const [attributes, setAttributes] = React.useState([]);
  const [selected, setSelected] = React.useState([]);

  const [unadjustedCohortData, setUnadjustedCohortData] = React.useState({"confounds":[], "propensity":[], "treatment":[]});

  const [sort, setSort] = React.useState("Adjusted High to Low");

  let allData = JSON.parse(JSON.stringify(unadjustedCohort));
  let filteredData = crossfilter(allData);

  const [allAttributeFilters, setAllAttributeFilters] = React.useState({})

  useEffect(() => {
    // Get all the confounding attributes, excluding treatment and propensity score
    let allAttributes = new Set(Object.keys(unadjustedCohort[0]));
    allAttributes.delete(treatment);
    allAttributes.delete(propensity);
    allAttributes = Array.from(allAttributes);

    setAttributes(allAttributes);

    let newAttributeFilters = {}

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

  function updateFilter(attribute, extent) {
    let attributeFilter = allAttributeFilters[attribute];
    attributeFilter.filter(extent);

    let newData = attributeFilter.top(Infinity);
    let newFilteredConfounds = JSON.parse(JSON.stringify(newData)).map(d => {delete d.treatment; delete d.propensity; return d});
    let newFilteredTreatments = newData.map(d => d.treatment);
    let newFilteredPropensity = newData.map(d => d.propensity);

    setCohortData({"confounds": newFilteredConfounds, "propensity": newFilteredPropensity, "treatment": newFilteredTreatments})
  }

  let plotLayout = {"display":"flex"};

  return (
    <div>
      <div style={plotLayout}>
        <PropDistribution unadjustedCohortData={unadjustedCohortData} setSelected={setSelected} />
        <CovariateBalance unadjustedCohortData={unadjustedCohortData} attributes={attributes} updateFilter={updateFilter} sort={sort} />
        <SMDMenu setSort={setSort} />
      </div>
    </div>
  )
}