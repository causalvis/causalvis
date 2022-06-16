import React from 'react';

import { PropDistribution } from '../src/PropDistribution.js'
import CohortPropensity from '../public/cohort_propensity.json'
import CohortConfounds from '../public/cohort_confounds.json'
import CohortTreatments from '../public/cohort_treatment.json'

// let data = CohortConfounds.map((d, i) => {d.treatment = CohortTreatments[i]; return d});

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Cohort/Propensity Distribution',
};

export const ToStorybook = () => (
  <PropDistribution propensity={CohortPropensity} data={CohortConfounds} treatment={CohortTreatments} />
)

ToStorybook.story = {
  name: 'Propensity Distribution',
};
