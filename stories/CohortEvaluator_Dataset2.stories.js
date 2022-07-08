import React from 'react';

import { CohortEvaluator } from '../src/CohortEvaluator.js'
import CohortPropensity from '../public/cohort2_propensity.json'
import CohortConfounds from '../public/cohort2_confounds.json'
import CohortTreatments from '../public/cohort2_treatment.json'

let unadjustedData = JSON.parse(JSON.stringify(CohortConfounds)).map((d, i) => {d.treatment = CohortTreatments[i]; d.propensity = CohortPropensity[i]; return d})

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Cohort/Cohort Evaluator 2',
};

export const ToStorybook = () => (
  <CohortEvaluator unadjustedCohort={unadjustedData} />
)

ToStorybook.story = {
  name: 'Cohort Evaluator 2',
};
