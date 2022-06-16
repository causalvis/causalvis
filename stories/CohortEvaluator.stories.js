import React from 'react';

import { CohortEvaluator } from '../src/CohortEvaluator.js'
import CohortPropensity from '../public/cohort_propensity.json'
import CohortConfounds from '../public/cohort_confounds.json'
import CohortTreatments from '../public/cohort_treatment.json'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Cohort/Cohort Evaluator',
};

export const ToStorybook = () => (
  <CohortEvaluator CohortConfounds={CohortConfounds} CohortPropensity={CohortPropensity} CohortTreatments={CohortTreatments} />
)

ToStorybook.story = {
  name: 'Cohort Evaluator',
};
