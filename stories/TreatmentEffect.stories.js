import React from 'react';

import { TreatmentEffectEvaluator } from '../src/TreatmentEffectEvaluator.js'
import CohortOutcomes from '../public/cohort2_outcome.json'
import CohortConfounds from '../public/cohort2_confounds.json'
import CohortTreatments from '../public/cohort2_treatment.json'
import CohortPropensity from '../public/cohort2_propensity.json'
import CohortPredictions from '../public/standardized_predictions.json'
import IndividualEffects from '../public/individual_treatment_effect.json'

// console.log(CohortConfounds.length, IndividualEffects.length);

let data = JSON.parse(JSON.stringify(CohortConfounds)).map((d, i) => {
  d.treatment = CohortTreatments[i];
  d.outcome = CohortOutcomes[i];
  d.weight = 1/CohortPropensity[i][CohortTreatments[i]];
  d.effect = IndividualEffects[i]["('ratio', 0)"];
  return d
});

console.log(data);

// let data2 = JSON.parse(JSON.stringify(CohortConfounds));

// for (let i = 0; i < data2.length; i++) {

//   let d = data2[i];
//   d.treatment = CohortTreatments[i];

//   console.log(CohortPredictions[i])
//   d.outcome = CohortPredictions[i][`(${d.treatment}, 1)`];
// }

// console.log(data2.length, CohortTreatments.length, CohortPredictions.length);
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Treatment Effect/Treatment Effect Evaluator',
};

export const ToStorybook = () => (
  <TreatmentEffectEvaluator data={data} />
)

ToStorybook.story = {
  name: 'Treatment Effect Evaluator',
};
