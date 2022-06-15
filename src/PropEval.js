import React, {useRef, useState, useEffect} from 'react'
// import * as d3 from 'd3';

import { PropDistributionVis } from './PropDistributionVis';
import { CompareDistributionVis } from './CompareDistributionVis';

export const PropEval = ({propensity=[], data=[]}) => {

  const [selected, setSelected] = React.useState([]);
  const [attributes, setAttributes] = React.useState([]);

  useEffect(() => {
    setAttributes(Object.keys(data[0]));
  }, [data])

  // useEffect(() => {
  //   console.log(selected);
  // }, [selected])

  let attributesContainer = {"display":"flex", "width":"100%", "flex-wrap":"wrap"};

  return (
    <div>
      <p>Propensity Distribution</p>
      <PropDistributionVis propensity={propensity} data={data} setSelected={setSelected}/>
      <div style={attributesContainer}>
        {selected.length > 0 ? attributes.map((value, index) => {
          return <CompareDistributionVis reference={data.map(d => d[value])} selection={selected.map(d => d[value])} refIndex={value} />
        }) : <div/> }
      </div>
    </div>
  )
}