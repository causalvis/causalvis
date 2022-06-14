import React from 'react';

import { DAG } from '../src/DAG.js';
import dataset from '../public/student_data.json';
import graph from '../public/DAG.json'

let attributes = [];

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'DAG from Graph',
};

export const ToStorybook = () => (
  <DAG graph={graph} />
)

ToStorybook.story = {
  name: 'DAG from Graph',
};
