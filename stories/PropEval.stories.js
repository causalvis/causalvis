import React from 'react';

import { PropEval } from '../src/PropEval.js'
import CohortPropensity from '../public/cohort_propensity.json'
import CohortConfounds from '../public/cohort_confounds.json'
import CohortTreatments from '../public/cohort_treatment.json'

let data = CohortConfounds.map((d, i) => {d.treatment = CohortTreatments[i]; return d});

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Cohort/Propensity Score Evaluator',
};

export const ToStorybook = () => (
  <PropEval propensity={CohortPropensity} data={data} />
)

ToStorybook.story = {
  name: 'Propensity Score Evaluator',
};
