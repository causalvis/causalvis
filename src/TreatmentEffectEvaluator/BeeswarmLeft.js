import React, {useRef, useState, useEffect} from 'react';
import * as d3 from 'd3';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

export const BeeswarmLeft = ({layout={"height": 600, "width": 80, "margin": 30, "marginLeft": 10, "marginBottom": 30},
                              data=[],
                              stratify="",
                              thresholdValue=0,
                              updateLeftThreshold,
                              isBinary}) => {

	const ref = useRef('svgBeeswarmLeft');

  let svgElement = d3.select(ref.current);

  // Track color map
  const [colorMap, setColorMap] = React.useState({1: "#698fb8",
                                                  0: "#f0a856"});

  // Jitter the coordinates of each point slightly along the x-axis
  const jitter = 20;

  // Set the slider step increment size to one-hundredth of variable extent
  const extent = d3.extent(data, d => d[stratify]);
  let step = (extent[1] - extent[0]) / 100;
  step = parseFloat(step.toPrecision(2));

  // Update the threshold for faceting
  function handleChange(e, v) {
    updateLeftThreshold(v);
  }

  let yScale;

  if (!isBinary) {
    yScale = d3.scaleLinear()
                  .domain(extent)
                  .range([layout.height - layout.marginBottom, layout.margin])
  } else {
    yScale = d3.scaleLinear()
                  .domain([-0.5, 1.5])
                  .range([layout.height - layout.marginBottom, layout.margin])
  }

  const circles = svgElement.select("#points")
    .selectAll(".dataPoint")
    .data(data)
    .join("circle")
    .attr("class", "dataPoint")
    .attr("transform", d => `translate(${layout.width / 2 + (Math.random() - 0.5) * jitter},${yScale(d[stratify])})`)
    .attr("r", 3)
    .attr("fill", "#698fb8")
    .attr("opacity", 0.2)

  // Visualize current threshold
  let thresholdStroke = svgElement.select("#threshold")
    .attr("transform", `translate(0, ${yScale(thresholdValue)})`)
    .attr("stroke", isBinary ? "none" : "black")
    .attr("stroke-dasharray", "5 5 2 5")

  if (!isBinary) {
    svgElement.select('#y-axis')
            .attr('transform', `translate(${layout.width - layout.margin}, 0)`)
            .call(d3.axisRight(yScale).tickSize(3))
  } else {
    svgElement.select('#y-axis')
            .attr('transform', `translate(${layout.width - layout.margin}, 0)`)
            .call(d3.axisRight(yScale).tickSize(3).tickValues([0, 1]))
  }

    

  let subplotStyle = {"display": "flex", "alignItems":"center"};
  let subplotTitle = {"writingMode":"vertical-rl", "transform":"rotate(-180deg)", "fontFamily": "sans-serif", "marginTop": "15px", "marginBottom": "0px", "fontSize":"15px"};
  let thresholdValueIndicator = {"display":"flex", "flexDirection":"column", "height":"600px", "justifyContent":"space-around"};
  let thresholdText = {"writingMode":"vertical-rl", "transform":"rotate(-180deg)", "fontFamily": "sans-serif",}

  return (
    <div style={subplotStyle}>
      <p style={subplotTitle}>{stratify}</p>
      <svg width={layout.width} height={layout.height} ref={ref} id={`svgBeeswarmLeft`}>
        <g id="y-axis" />
        <g id="brush" />
        <g id="points" />
        <line id="threshold" y1={0} y2={0} x1={layout.width - layout.margin} x2={0} />
        <g id="distribution" />
        <g id="title" />
      </svg>
      {isBinary
        ? <div />
          :<Box height={layout.height - layout.margin * 2}>
            <Slider
              sx={{
                '& input[type="range"]': {
                  WebkitAppearance: 'slider-vertical',
                },
              }}
              orientation="vertical"
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
        <p style={thresholdText}>{isBinary ? <p /> : `>= ${thresholdValue}`}</p>
        <p style={thresholdText}>{isBinary ? <p /> : `< ${thresholdValue}`}</p>
      </div>
    </div>
  )
}