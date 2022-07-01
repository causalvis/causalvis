import React, {useRef, useState, useEffect} from 'react';
import * as d3 from 'd3';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

export const BeeswarmTop = ({layout={"height": 70, "width": 600, "margin": 15, "marginLeft": 20}, data=[], stratify="", thresholdValue=0, updateTopThreshold}) => {

	const ref = useRef('svgBeeswarmTop');

  let svgElement = d3.select(ref.current);

  // Track color map
  const [colorMap, setColorMap] = React.useState({1: "#4e79a7",
                                                  0: "#f28e2b"});


    const isBinary = (new Set(data.map(d => d[stratify]))).size === 2;

    // Jitter the coordinates of each point slightly along the x-axis
    const jitter = 20;

    // Set the slider step increment size to one-hundredth of variable extent
    const extent = d3.extent(data, d => d[stratify]);
    let step = (extent[1] - extent[0]) / 100;
    step = parseFloat(step.toPrecision(2));

    // Update the threshold for faceting
    function handleChange(e, v) {
      updateTopThreshold(v);
    }

    let xScale = d3.scaleLinear()
                    .domain(extent)
                    .range([layout.marginLeft, layout.width - layout.margin])
    
    const circles = svgElement.select("#points")
      .selectAll(".dataPoint")
      .data(data)
      .join("circle")
      .attr("class", "dataPoint")
      .attr("transform", d => `translate(${xScale(d[stratify])},${layout.height / 2 + (Math.random() - 0.5) * jitter})`)
      .attr("r", 3)
      .attr("fill", "none")
      .attr("stroke", d => colorMap[d.treatment])

    // Visualize current threshold
    let thresholdStroke = svgElement.select("#threshold")
      .attr("transform", `translate(${xScale(thresholdValue)}, 0)`)
      .attr("stroke", isBinary ? "none" : "black")
      .attr("stroke-dasharray", "5 5 2 5")

    svgElement.select('#x-axis')
              .attr('transform', `translate(0, ${layout.height - layout.margin})`)
              .call(d3.axisBottom(xScale).tickSize(3))

  let subplotStyle = {"display": "flex", "flexDirection":"column", "alignItems":"center"};
  let subplotTitle = {"fontFamily": "sans-serif", "marginTop": "15px", "marginBottom": "0px", "fontSize":"15px"};
  let thresholdValueIndicator = {"display":"flex", "width":"100%", "justifyContent":"space-around", "fontFamily": "sans-serif",};

  return (
    <div style={subplotStyle}>
      <p style={subplotTitle}>{stratify}</p>
      <svg width={layout.width} height={layout.height} ref={ref} id={`svgBeeswarmTop`}>
        <g id="x-axis" />
        <g id="brush" />
        <g id="points" />
        <line id="threshold" x1={0} x2={0} y1={layout.height - layout.margin} y2={0} />
        <g id="distribution" />
        <g id="title" />
      </svg>
      {isBinary
        ? <div />
          :<Box width={layout.width - layout.marginLeft - layout.margin}>
            <Slider
              size="small"
              min={d3.min(data, d => d[stratify])}
              max={d3.max(data, d => d[stratify])}
              step={step}
              defaultValue={thresholdValue}
              aria-label="Small"
              valueLabelDisplay="auto"
              onChangeCommitted={(e, v) => handleChange(e, v)}
            />
          </Box>
      }
      <div style={thresholdValueIndicator}>
        <p>{isBinary ? 0 : `< ${thresholdValue}`}</p>
        <p>{isBinary ? 1 : `>= ${thresholdValue}`}</p>
      </div>
    </div>
  )
}