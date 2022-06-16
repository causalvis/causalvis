import React, {useRef, useState, useEffect} from 'react'
// import * as d3 from 'd3';

import { PropDistributionVis } from './PropDistributionVis';

export const PropDistribution = ({propensity=[], data=[], treatment=[], setSelected}) => {

  // console.log(propensity);

  return (
    <div>
      <PropDistributionVis propensity={propensity} data={data} treatment={treatment} setSelected={setSelected}/> 
    </div>
  )
}