import React from 'react';

import { DAG } from '../src/DAG.js';
import dataset from '../public/student_data.json';
import graph from '../public/DAG.json'
import graph2 from '../public/DAG_2.json'
import graph3 from '../public/DAG_3.json'

let attributes = [];

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'DAG/From Graph',
};

export const ToStorybook = () => (
  <DAG graph={graph3} />
)

ToStorybook.story = {
  name: 'From Graph',
};
