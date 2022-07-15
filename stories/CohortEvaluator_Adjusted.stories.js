import React from 'react';

import { CohortEvaluator } from '../src/CohortEvaluator.js'
import CohortPropensity from '../public/cohort_propensity.json'
import CohortConfounds from '../public/cohort_confounds.json'
import CohortTreatments from '../public/cohort_treatment.json'

import CohortPropensityAdjusted from '../public/cohort_propensity_matched2.json'
import CohortConfoundsAdjusted from '../public/cohort_confounds_matched.json'
import CohortTreatmentsAdjusted from '../public/cohort_treatments_matched.json'

let unadjustedData = JSON.parse(JSON.stringify(CohortConfounds)).map((d, i) => {d.treatment = CohortTreatments[i]; d.propensity = CohortPropensity[i]; return d})
let adjustedData = JSON.parse(JSON.stringify(CohortConfoundsAdjusted)).map((d, i) => {d.treatment = CohortTreatmentsAdjusted[i]; d.propensity = CohortPropensityAdjusted[i]; return d})

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Cohort/Cohort Evaluator Adjusted',
};

export const ToStorybook = () => (
  <CohortEvaluator unadjustedCohort={unadjustedData} adjustedCohort={adjustedData} />
)

ToStorybook.story = {
  name: 'Cohort Evaluator Adjusted',
};
