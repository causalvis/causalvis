import React, {useState, useEffect} from 'react';
import crossfilter from 'crossfilter2';

import { CompareDistributionVis } from './CompareDistributionVis';
import { CovariateBalance } from './CovariateBalance';
import { PropDistribution } from './PropDistribution';

export const CohortEvaluator = ({CohortConfounds=[], CohortPropensity=[], CohortTreatments=[]}) => {

  const [attributes, setAttributes] = React.useState([]);
  const [selected, setSelected] = React.useState([]);

  const [filteredConfounds, setFilteredConfounds] = React.useState([]);
  const [filteredTreatments, setFilteredTreatments] = React.useState([]);
  const [filteredPropensity, setFilteredPropensity] = React.useState([]);

  const [cohortData, setCohortData] = React.useState({"confounds":[], "propensity":[], "treatment":[]});

  let allData = JSON.parse(JSON.stringify(CohortConfounds)).map((d, i) => {d["treatment"] = CohortTreatments[i]; d["propensity"] = CohortPropensity[i]; return d});
  let filteredData = crossfilter(allData);

  const [allAttributeFilters, setAllAttributeFilters] = React.useState({})

  // let allAttributeFilters = {};

  useEffect(() => {
    let allAttributes = Object.keys(CohortConfounds[0])

    setAttributes(allAttributes);

    let newAttributeFilters = {}

    for (let a of allAttributes) {
      let attributefilter = filteredData.dimension(function(d) { return d[a]; });
      newAttributeFilters[a] = attributefilter;
    }

    setAllAttributeFilters(newAttributeFilters);

    setCohortData({"confounds": CohortConfounds, "propensity": CohortPropensity, "treatment": CohortTreatments});

  }, [CohortConfounds, CohortPropensity, CohortTreatments])

  function updateFilter(attribute, extent) {
    let attributeFilter = allAttributeFilters[attribute];
    // console.log(attributeFilter, extent);
    attributeFilter.filter(extent);

    let newData = attributeFilter.top(Infinity);
    let newFilteredConfounds = JSON.parse(JSON.stringify(newData)).map(d => {delete d.treatment; delete d.propensity; return d});
    let newFilteredTreatments = newData.map(d => d.treatment);
    let newFilteredPropensity = newData.map(d => d.propensity);

    setCohortData({"confounds": newFilteredConfounds, "propensity": newFilteredPropensity, "treatment": newFilteredTreatments})
  }

  let attributesContainer = {"display":"flex", "width":"100%", "flexWrap":"wrap"};
  let plotLayout = {"display":"flex"};

  return (
    <div>
      <div style={plotLayout}>
        <PropDistribution cohortData={cohortData} setSelected={setSelected} />
        <CovariateBalance cohortData={cohortData} />
      </div>
      <div style={attributesContainer}>
        {selected.length > 0 ? attributes.map((value, index) => {
          return <CompareDistributionVis
                    key={index}
                    reference={CohortConfounds.map(d => d[value])}
                    selection={selected.map(d => d[value])}
                    refIndex={value}
                    updateFilter={updateFilter} />
        }) : <div/> }
      </div>
    </div>
  )
}