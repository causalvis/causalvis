import React from 'react';

import { VersionHistory } from '../src/VersionHistory.js'

import DAG1 from '../public/DAG.json'
import DAG2 from '../public/DAG_2.json'
import DAG3 from '../public/DAG_3.json'

import CohortConfounds from '../public/cohort_confounds.json'

import Cohort1 from '../public/te_test.json'
import Cohort2 from '../public/te_test_2.json'
import Cohort3 from '../public/te_test_3.json'

let versions = [{"DAG":DAG1, "Cohort":Cohort1, "ATE": 5},
                {"DAG":DAG1, "Cohort":Cohort1, "ATE": 7},
                {"DAG":DAG2, "Cohort":Cohort2, "ATE": 8},
                {"DAG":DAG3, "Cohort":Cohort3, "ATE": 5},
                {"DAG":DAG3, "Cohort":Cohort3, "ATE": 1},
                {"DAG":DAG3, "Cohort":Cohort3, "ATE": 1},]

export default {
  title: 'Versions/Version History',
};

export const ToStorybook = () => (
  <div>
    {/*<input id="_dagtest" type="text" />
    <input id="_cohorttest" type="text" />*/}
    <VersionHistory versions={versions} _dag="_dagtest" _cohort="_cohorttest" effect="effect" />
  </div>
)

ToStorybook.story = {
  name: 'Version History',
};
