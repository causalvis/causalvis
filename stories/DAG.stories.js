import React from 'react';

import { DAG } from '../src';
import dataset from '../public/nsw_treated.json';

let attributes = Object.keys(dataset[0])

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'DAG',
};

export const ToStorybook = () => (
  <DAG dataset={dataset} attributes={attributes} />
)

ToStorybook.story = {
  name: 'DAG',
};
