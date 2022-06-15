import React from 'react';

import { DAG } from '../src/CausalStructure/DAG.js';
import dataset from '../public/student_data.json';
import graph from '../public/DAG.json'

let attributes = ['age',
                  'job',
                  'marital',
                  'education',
                  'default',
                  'housing',
                  'loan',
                  'contact',
                  'month',
                  'day_of_week',
                  'duration',
                  'campaign',
                  'pdays',
                  'previous',
                  'poutcome',
                  'emp.var.rate',
                  'cons.price.idx',
                  'cons.conf.idx',
                  'euribor3m',
                  'nr.employed',
                  'y']

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'DAG/From Attributes',
};

export const ToStorybook = () => (
  <DAG attributes={attributes} />
)

ToStorybook.story = {
  name: 'From Attributes',
};