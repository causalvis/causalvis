import React, {useState, useEffect} from 'react';

import { extent, mean } from "d3-array";

import { BeeswarmTop } from './BeeswarmTop';
import { CovariatesManager } from './CovariatesManager';
import { LegendVis } from './LegendVis';
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
  const [attributeLevels, setAttributeLevels] = React.useState({});
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

    let newAttributeLevels = {};

    for (let a of allAttributes) {
      let levels = Array.from(new Set(data.map(d => d[a])));
      newAttributeLevels[a] = levels;
    }

    setAttributeLevels(newAttributeLevels);

  }, [data])

  function changeStratify(v) {
    let indexV = stratify.map(d => d.attribute).indexOf(v);

    if (indexV < 0) {
      if (stratify.length === 3) {
        return;
      }

      let vThreshold = attributeLevels[v].length === 2 ? null : mean(data, d => d[v]).toPrecision(2);

      stratify.push({"attribute":v, "threshold":vThreshold});
      setStratify([...stratify]);
    } else {
      stratify.splice(indexV, 1);
      setStratify([...stratify]);
    }
  }

  function updateTopThreshold(v) {
    stratify[1].threshold = v;
    setStratify([...stratify]);
  }

  function splitDataset(dataset, attribute, threshold) {
    // let isBinary = attributeLevels[attribute].length === 2;

    let underMean;
    let overMean;

    if (!threshold) {
      underMean = dataset.filter(d => d[attribute] === 0);
      overMean = dataset.filter(d => d[attribute] === 1);

      return [{"data": underMean, "title": `${attribute} = 0`}, {"data": overMean, "title": `${attribute} = 1`}];
    } else {
      // let attributeMean = mean(dataset, d => d[attribute]);
      // attributeMean = attributeMean.toPrecision(2);

      underMean = dataset.filter(d => d[attribute] < threshold);
      overMean = dataset.filter(d => d[attribute] > threshold);

      return [{"data": underMean, "title": `< ${threshold}`}, {"data": overMean, "title": `>= ${threshold}`}]
    }
  }

  useEffect(() => {
    let newStratifiedData = [];

    if (stratify.length === 1) {

      newStratifiedData.push({"data": JSON.parse(JSON.stringify(cohortData)),
                              "stratifyBy": stratify[0].attribute,
                              "title": ``,
                              "layout": {"height": 550, "width": 600, "margin": 20, "marginLeft": 20, "marginBottom": 35}});
      setStratifiedData([...newStratifiedData]);

    } else if (stratify.length === 2) {

      let newStratifiedData = splitDataset(cohortData, stratify[1].attribute, stratify[1].threshold);
      newStratifiedData = newStratifiedData.map(function(s) {
        s.stratifyBy = stratify[0].attribute;
        s.layout = {"height": 500, "width": 300, "margin": 20, "marginLeft": 20, "marginBottom": 35};
        return s;
      })
      setStratifiedData([...newStratifiedData]);

    } else if (stratify.length === 3) {

      let newStratifiedData = [];

      let firstStratify = splitDataset(cohortData, stratify[2].attribute, stratify[2].threshold);

      for (let sub of firstStratify) {
        let subTitle = sub.title;
        let subStratify = splitDataset(sub.data, stratify[1].attribute, stratify[1].threshold);

        subStratify = subStratify.map(function(s) {
          s.stratifyBy = stratify[0].attribute;
          s.layout = {"height": 250, "width": 300, "margin": 20, "marginLeft": 20, "marginBottom": 35};
          s.title = `${subTitle}, ${s.title}`;
          return s;
        })

        newStratifiedData = newStratifiedData.concat(subStratify);
      }
      setStratifiedData([...newStratifiedData]);

    } else if (stratify.length === 0) {

      newStratifiedData.push({"data": [],
                              "stratifyBy": "",
                              "title": ``,
                              "layout": {"height": 550, "width": 600, "margin": 20, "marginLeft": 20, "marginBottom": 35}});
      setStratifiedData([...newStratifiedData]);

    }

  }, [stratify])

  let mainLayout = {"display":"flex"};
  let plotsWrapper = {"display": "flex", "flexDirection":"column", "alignItems":"center", "width":"600px"};
  let plotsTitle = {"fontSize":"16px", "fontFamily":"sans-serif"};
  let plotsLayout = {"display":"flex", "flex-wrap":"wrap"};

  return (
    <div style={mainLayout}>
      <CovariatesManager
        attributes={attributes}
        changeStratify={changeStratify}
        stratify={stratify.map(d => d.attribute)} />
      <div style={plotsWrapper}>
        <p style={plotsTitle}>Treatment Effect Plot</p>
        <LegendVis />
        <div style={plotsLayout}>
          {stratify[1] 
            ? <BeeswarmTop data={cohortData} stratify={stratify[1].attribute} thresholdValue={stratify[1].threshold} updateTopThreshold={updateTopThreshold} />
            : <div />
          }
          {stratifiedData.map((value, index) => {
              return <TreatmentEffectVis key={`vis${value.stratifyBy}${index}`} index={index} allData={value} />
            })
          }
        </div>
      </div>
    </div>
  )
}