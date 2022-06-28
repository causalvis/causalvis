import React, {useState, useEffect} from 'react';

import { extent, mean } from "d3-array";

import { LegendVis } from './LegendVis';
import { CovariatesManager } from './CovariatesManager';
import { TreatmentEffectVis } from './TreatmentEffectVis';

/*
Props:
  - cohort: Array, data set before adjustment
  - treatment: String, name of treatment variable
  - outcome: String, name of outcome variable
  - weights: Array, weight of each item in the data set, order of items should be identical to unadjusted data set
*/
export const TreatmentEffectEvaluator = ({data=[], treatment="treatment", outcome="outcome"}) => {

  const [attributes, setAttributes] = React.useState([]);
  const [cohortData, setCohortData] = React.useState([]);

  const [stratify, setStratify] = React.useState([]);
  const [stratifiedData, setStratifiedData] = React.useState([]);

  useEffect(() => {
    // Get all the confounding attributes, excluding treatment and propensity score
    let allAttributes = new Set(Object.keys(data[0]));
    allAttributes.delete(treatment);
    allAttributes.delete(outcome);
    allAttributes = Array.from(allAttributes);

    setAttributes(allAttributes);

    let newCohortData = JSON.parse(JSON.stringify(data)).map(d => {d.outcome = d.weight ? d.outcome * d.weight : d.outcome; return d});

    setCohortData(newCohortData);

  }, [data])

  function changeStratify(v) {
    let indexV = stratify.indexOf(v);

    if (indexV < 0) {
      if (stratify.length === 3) {
        return;
      }
      stratify.push(v);
      setStratify([...stratify]);
    } else {
      stratify.splice(indexV, 1);
      setStratify([...stratify]);
    }
  }

  useEffect(() => {
    let newStratifiedData = [];

    if (stratify.length === 1) {
      newStratifiedData.push({"data": JSON.parse(JSON.stringify(cohortData)),
                              "stratifyBy": stratify[0],
                              "title": ``,
                              "layout": {"height": 550, "width": 600, "margin": 20, "marginLeft": 20, "marginBottom": 30}});
      setStratifiedData([...newStratifiedData]);
    } else if (stratify.length === 2) {
      let covMean = mean(cohortData, d => d[stratify[1]]);
      covMean = Math.round(covMean * 100) / 100

      let underMean = cohortData.filter(d => d[stratify[1]] < covMean);
      let overMean = cohortData.filter(d => d[stratify[1]] >= covMean);

      newStratifiedData.push({"data": underMean,
                              "stratifyBy": stratify[0],
                              "title": `${stratify[1]} < ${covMean}`,
                              "layout": {"height": 500, "width": 300, "margin": 20, "marginLeft": 20, "marginBottom": 30}});
      newStratifiedData.push({"data": overMean,
                              "stratifyBy": stratify[0],
                              "title": `${stratify[1]} >= ${covMean}`,
                              "layout": {"height": 500, "width": 300, "margin": 20, "marginLeft": 20, "marginBottom": 30}});

      setStratifiedData([...newStratifiedData]);
    } else if (stratify.length === 3) {
      let covMean1 = mean(cohortData, d => d[stratify[1]]);
      covMean1 = Math.round(covMean1 * 100) / 100

      let underMean = cohortData.filter(d => d[stratify[1]] < covMean1);
      let overMean = cohortData.filter(d => d[stratify[1]] >= covMean1);

      let covMean2 = mean(cohortData, d => d[stratify[2]]);
      covMean2 = Math.round(covMean2 * 100) / 100

      let underUnderMean = underMean.filter(d => d[stratify[2]] < covMean2);
      let underOverMean = underMean.filter(d => d[stratify[2]] >= covMean2);

      let overUnderMean = overMean.filter(d => d[stratify[2]] < covMean2);
      let overOverMean = overMean.filter(d => d[stratify[2]] >= covMean2);

      newStratifiedData.push({"data": underUnderMean,
                              "stratifyBy": stratify[0],
                              "title": `${stratify[1]} < ${covMean1}, ${stratify[2]} < ${covMean2}`,
                              "layout": {"height": 250, "width": 300, "margin": 20, "marginLeft": 20, "marginBottom": 30}});
      newStratifiedData.push({"data": underOverMean,
                              "stratifyBy": stratify[0],
                              "title": `${stratify[1]} < ${covMean1}, ${stratify[2]} >= ${covMean2}`,
                              "layout": {"height": 250, "width": 300, "margin": 20, "marginLeft": 20, "marginBottom": 30}});

      newStratifiedData.push({"data": overUnderMean,
                              "stratifyBy": stratify[0],
                              "title": `${stratify[1]} > ${covMean1}, ${stratify[2]} < ${covMean2}`,
                              "layout": {"height": 250, "width": 300, "margin": 20, "marginLeft": 20, "marginBottom": 30}});
      newStratifiedData.push({"data": overOverMean,
                              "stratifyBy": stratify[0],
                              "title": `${stratify[1]} >= ${covMean1}, ${stratify[2]} >= ${covMean2}`,
                              "layout": {"height": 250, "width": 300, "margin": 20, "marginLeft": 20, "marginBottom": 30}});

      setStratifiedData([...newStratifiedData]);
    } else if (stratify.length === 0) {
      newStratifiedData.push({"data": [],
                              "stratifyBy": "",
                              "title": ``,
                              "layout": {"height": 550, "width": 600, "margin": 20, "marginLeft": 20, "marginBottom": 30}});
      setStratifiedData([...newStratifiedData]);
    }

  }, [stratify])

  // useEffect(() => {
  //   console.log("stratified", stratifiedData);

  // }, [stratifiedData])

  let mainLayout = {"display":"flex"};
  let plotsWrapper = {"display": "flex", "flexDirection":"column", "alignItems":"center", "width":"600px"};
  let plotsTitle = {"fontSize":"16px", "fontFamily":"sans-serif"};
  let plotsLayout = {"display":"flex", "flex-wrap":"wrap"};

  return (
    <div style={mainLayout}>
      <CovariatesManager
        attributes={attributes}
        changeStratify={changeStratify}
        stratify={stratify} />
      <div style={plotsWrapper}>
        <p style={plotsTitle}>Treatment Effect Plot</p>
        <LegendVis />
        <div style={plotsLayout}>
          {stratifiedData.map((value, index) => {
              return <TreatmentEffectVis key={`vis${value.stratifyBy}${index}`} index={index} allData={value} />
            })
          }
        </div>
      </div>
    </div>
  )
}