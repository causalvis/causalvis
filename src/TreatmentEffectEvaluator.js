import React, {useState, useEffect} from 'react';

import { extent, mean } from "d3-array";

import { BeeswarmLeft } from './TreatmentEffectEvaluator/BeeswarmLeft';
import { BeeswarmTop } from './TreatmentEffectEvaluator/BeeswarmTop';
import { CovariatesManager } from './TreatmentEffectEvaluator/CovariatesManager';
import { LegendVis } from './TreatmentEffectEvaluator/LegendVis';
import { TreatmentEffectVis } from './TreatmentEffectEvaluator/TreatmentEffectVis';
import { TreatmentEffectVisViolin } from './TreatmentEffectEvaluator/TreatmentEffectVis_withViolin';

/*
Props:
  - data: Array, data set before adjustment
  - treatment: String, name of treatment variable
  - outcome: String, name of outcome variable
*/
export const TreatmentEffectEvaluator = ({data=[], treatment="treatment", outcome="outcome", effect="effect"}) => {

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

  // Add a new attribute to facet by
  // For each new attribute, also add the faceting threshold
  function changeStratify(v) {
    let indexV = stratify.map(d => d.attribute).indexOf(v);

    if (indexV < 0) {
      if (stratify.length === 3) {
        return;
      }

      // For continuous variables, set the default faceting threshold to be the mean
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

  function updateLeftThreshold(v) {
    stratify[2].threshold = v;
    setStratify([...stratify]);
  }

  // Divide dataset based on faceting attributes and thresholds
  function splitDataset(dataset, attribute, threshold) {
    let underMean;
    let overMean;

    if (!threshold) {
      underMean = dataset.filter(d => d[attribute] === 0);
      overMean = dataset.filter(d => d[attribute] === 1);

      return [{"data": underMean, "title": `${attribute} = 0`}, {"data": overMean, "title": `${attribute} = 1`}];
    } else {
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
                              "layout": {"height": 600, "width": 600, "margin": 20, "marginLeft": 30, "marginBottom": 35}});
      setStratifiedData([...newStratifiedData]);

    } else if (stratify.length === 2) {

      let newStratifiedData = splitDataset(cohortData, stratify[1].attribute, stratify[1].threshold);
      newStratifiedData = newStratifiedData.map(function(s) {
        s.stratifyBy = stratify[0].attribute;
        s.layout = {"height": 600, "width": 300, "margin": 20, "marginLeft": 30, "marginBottom": 35};
        return s;
      })
      setStratifiedData([...newStratifiedData]);

    } else if (stratify.length === 3) {

      let newStratifiedData = [];

      let firstStratify = splitDataset(cohortData, stratify[2].attribute, stratify[2].threshold);
      firstStratify = firstStratify.reverse();

      for (let sub of firstStratify) {
        let subTitle = sub.title;
        let subStratify = splitDataset(sub.data, stratify[1].attribute, stratify[1].threshold);

        subStratify = subStratify.map(function(s) {
          s.stratifyBy = stratify[0].attribute;
          s.layout = {"height": 300, "width": 300, "margin": 20, "marginLeft": 30, "marginBottom": 35};
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
                              "layout": {"height": 600, "width": 600, "margin": 20, "marginLeft": 30, "marginBottom": 35}});
      setStratifiedData([...newStratifiedData]);

    }

  }, [stratify])

  let mainLayout = {"display":"grid",
                    "grid-template-columns":"auto auto 1fr",
                    "grid-template-rows":"auto auto 1fr",
                    "grid-gap":"20px"};
  let covariateStyle = {"grid-column": "1/2", "grid-row": "3/4", "display":"flex", "alignItems":"center"};
  let headerStyle = {"grid-column":"3/4", "grid-row": "1/2", "display":"flex", "flexDirection":"column", "alignItems":"center", "width":"600px"};

  let plotsTitle = {"fontSize":"16px", "fontFamily":"sans-serif"};

  let btopStyle = {"grid-column": "3/4", "grid-row":"2/3", "width":"600px"};
  let bleftStyle = {"grid-column": "2/3", "grid-row":"3/4"};
  let allVis = {"grid-column": "3/4",
                "grid-row":"3/4",
                "width":"600px",
                "height":"600px",
                "display":"grid", 
                "grid-template-columns":"1fr 1fr",
                "grid-template-rows":"1fr 1fr"}

  return (
    <div style={mainLayout}>
      <div style={covariateStyle}>
        <CovariatesManager
          attributes={attributes}
          changeStratify={changeStratify}
          stratify={stratify.map(d => d.attribute)} />
      </div>
      <div style={headerStyle}>
        <p style={plotsTitle}>Treatment Effect Plot</p>
        <LegendVis />
      </div>
      <div style={btopStyle}>
        {stratify[1] 
          ? <BeeswarmTop  data={cohortData} stratify={stratify[1].attribute} thresholdValue={stratify[1].threshold} updateTopThreshold={updateTopThreshold} />
          : <div />
        }
      </div>
      <div style={bleftStyle}>
        {stratify[2] 
          ? <BeeswarmLeft data={cohortData} stratify={stratify[2].attribute} thresholdValue={stratify[2].threshold} updateLeftThreshold={updateLeftThreshold} />
          : <div />
        }
      </div>
      <div style={allVis}>
        {stratifiedData.map((value, index) => {
            return <TreatmentEffectVisViolin key={`vis${value.stratifyBy}${index}`} index={index} allData={value} />
          })
        }
      </div>
    </div>
  )
}