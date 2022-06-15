import React from 'react';

import { DAG } from '../src/CausalStructure/DAG.js';
import dataset from '../public/student_data.json';
import graph from '../public/DAG.json'

let attributes = [];

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'DAG Empty',
};

export const ToStorybook = () => (
  <DAG attributes={attributes} />
)

ToStorybook.story = {
  name: 'DAG Empty',
};
