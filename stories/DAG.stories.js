import React from 'react';

import { DAG } from '../src';
import dataset from '../public/student_data.json';
import graph from '../public/student_nodelink.json'

let attributes = Object.keys(dataset[0]);

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'DAG',
};

export const ToStorybook = () => (
  <DAG dataset={dataset} attributes={attributes} graph={graph} />
)

ToStorybook.story = {
  name: 'DAG',
};
