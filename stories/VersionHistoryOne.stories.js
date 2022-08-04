import React from 'react';

import { VersionHistory } from '../src/VersionHistory.js'

import DAG1 from '../public/DAG.json'
import DAG2 from '../public/DAG_2.json'
import DAG3 from '../public/DAG_3.json'

import CohortConfounds from '../public/cohort_confounds.json'

import Cohort1 from '../public/te_test.json'
import Cohort2 from '../public/te_test_2.json'
import Cohort3 from '../public/te_test_3.json'

let versions = [{"DAG":DAG1, "Cohort":Cohort1, "ATE": 5.0}]

export default {
  title: 'Versions/Version History One',
};

export const ToStorybook = () => (
  <div>
    {/*<input id="_dagtest" type="text" />
    <input id="_cohorttest" type="text" />*/}
    <VersionHistory versions={versions} _dag="_dagtest" _cohort="_cohorttest" effect="effect" />
  </div>
)

ToStorybook.story = {
  name: 'Version History One',
};
