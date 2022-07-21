import React from 'react';

import { VersionHistory } from '../src/VersionHistory.js'

import DAG1 from '../public/DAG.json'
import DAG2 from '../public/DAG_2.json'
import DAG3 from '../public/DAG_3.json'

import CohortConfounds from '../public/cohort_confounds.json'
import CohortConfounds2 from '../public/cohort_confounds_matched.json'

let versions = [{"DAG":DAG1, "Cohort":CohortConfounds, "ATE": 5},
                {"DAG":DAG1, "Cohort":CohortConfounds2, "ATE": 7},
                {"DAG":DAG2, "Cohort":CohortConfounds2, "ATE": 8},
                {"DAG":DAG3, "Cohort":CohortConfounds, "ATE": 5},
                {"DAG":DAG3, "Cohort":CohortConfounds2, "ATE": 1},]

export default {
  title: 'Versions/Version History',
};

export const ToStorybook = () => (
  <VersionHistory versions={versions} />
)

ToStorybook.story = {
  name: 'Version History',
};
