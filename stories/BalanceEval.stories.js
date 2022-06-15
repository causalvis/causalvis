import React from 'react';

import { BalanceEval } from '../src/BalanceEval.js';
import TCDataset from '../public/TCDataset.json';
import SMDDataset from '../public/SMDDataset.json'

// let attributes = Object.keys(dataset[0]);

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Cohort/Balance Evaluator',
};

export const ToStorybook = () => (
  <BalanceEval TCDataset={TCDataset} SMDDataset={SMDDataset} />
)

ToStorybook.story = {
  name: 'Balance Evaluator',
};
