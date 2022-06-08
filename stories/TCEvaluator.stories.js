import React from 'react';

import { TCEvaluator } from '../src/TCEvaluator.js';
import TCDataset from '../public/TCDataset.json';
import SMDDataset from '../public/SMDDataset.json'

// let attributes = Object.keys(dataset[0]);

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Treatment-Control Evaluator',
};

export const ToStorybook = () => (
  <TCEvaluator TCDataset={TCDataset} SMDDataset={SMDDataset} />
)

ToStorybook.story = {
  name: 'Treatment-Control Evaluator',
};
