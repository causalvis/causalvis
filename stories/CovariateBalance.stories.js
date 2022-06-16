import React from 'react';

import { CovariateBalance } from '../src/CovariateBalance.js';
import CohortPropensity from '../public/cohort_propensity.json'
import CohortConfounds from '../public/cohort_confounds.json'
import CohortTreatments from '../public/cohort_treatment.json'

// let attributes = Object.keys(dataset[0]);

// let confounds = CohortConfounds.map(c => {delete c.treatment; return c});

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Cohort/Covariate Evaluator',
};

export const ToStorybook = () => (
  <CovariateBalance dataUnadjusted={CohortConfounds} treatment={CohortTreatments} propensity={CohortPropensity} />
)

ToStorybook.story = {
  name: 'Covariate Evaluator',
};
