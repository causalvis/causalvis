import React, {useRef, useState, useEffect} from 'react';
import * as d3 from 'd3';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

export const BeeswarmTop = ({layout={"height": 70, "width": 600, "margin": 15, "marginLeft": 20}, data=[], stratify="", thresholdValue=0, updateTopThreshold}) => {

	const ref = useRef('svgBeeswarmTop');

  let svgElement = d3.select(ref.current);

  // Track color map
  const [colorMap, setColorMap] = React.useState({0: "#6c8496",
                                                  1: "#a1c5c0"});
  // const [data, setData] = React.useState([]);
  // const [stratify, setStratify] = React.useState("");
  // const [thresholdValue, setThresholdValue] = React.useState(0);
  // const [beeswarm, setBeeswarm] = React.useState({"data":[], "stratify":"", "thresholdValue":0});

  // useEffect(() => {
  //   // setBeeswarm(allData);
  //   setData(allData.cohortData);
  //   setStratify(allData.stratify);
  //   setThresholdValue(allData.thresholdValue);
  // }, [allData])

  // useEffect(() => {
    // let data=beeswarm.cohortData;
    // let stratify=beeswarm.stratify;
    // let thresholdValue=beeswarm.thresholdValue;

    // console.log(beeswarm)

    const bins = 50;
    let jitter = 20;

    function handleChange(e, v) {
      // console.log(e, v);
      updateTopThreshold(v);
    }

    // var histogram = d3.histogram()
    //                   .value(d => d[stratify])
    //                   .domain(d3.extent(data, d => d[stratify]))
    //                   .thresholds(bins);
    // var binned = histogram(data);

    let xScale = d3.scaleLinear()
                    .domain(d3.extent(data, d => d[stratify]))
                    .range([layout.marginLeft, layout.width - layout.margin])
    // let yScale = d3.scaleLinear()
    //                 .domain([0, d3.max(binned, d => d.length)])
    //                 .range([layout.height - layout.margin, layout.margin])

    // let histogramBins = svgElement.select("#distribution")
    //   .selectAll(".binRect")
    //   .data(binned)
    //   .join("rect")
    //   .attr("class", "binRect")
    //   .attr("x", (d, i) => xScale(d.x0))
    //   .attr("y", d => yScale(d.length))
    //   .attr("width", d => xScale(d.x1) - xScale(d.x0))
    //   .attr("height", d => yScale(0) - yScale(d.length))
    //   .attr("r", 3)
    //   .attr("fill", "steelblue")
      // .attr("stroke", d => colorMap[d.treatment])

    // const brush = d3.brushX()
    //   .extent([[0, 0], [layout.width, layout.height]])

    // svgElement.select("#brush")
    //           .call(brush)
    //           .call(brush.move, [xScale(thresholdValue) - 20, xScale(thresholdValue) + 20]);

    const circles = svgElement.select("#points")
      .selectAll(".dataPoint")
      .data(data)
      .join("circle")
      .attr("class", "dataPoint")
      .attr("transform", d => `translate(${xScale(d[stratify])},${layout.height / 2 + (Math.random() - 0.5) * jitter})`)
      .attr("r", 3)
      .attr("fill", "none")
      .attr("stroke", d => colorMap[d.treatment])

    let thresholdStroke = svgElement.select("#threshold")
      .attr("transform", `translate(${xScale(thresholdValue)}, 0)`)
      .attr("stroke", "black")
      .attr("stroke-dasharray", "5 5 2 5")
    //   .attr("cursor", "pointer")
    //   .call(d3.drag()
    //       .on("start", function(e, d) {
    //         // console.log("dragging");
    //       })
    //       .on("drag", function (e, d) {

    //         // console.log(e, d);

    //         thresholdStroke.attr("transform", `translate(${e.x}, 0)`)

    //       })
    //       .on("end", function (e, d) {

    //       })
    //     )

    // let legendText = svgElement.select("#legend")
    //   .selectAll(".legendText")
    //   .data(["treatment", "control"])
    //   .join("text")
    //   .attr("class", "legendText")
    //   .attr("x", (d, i) => layout.width / 2 - 80 + 115 * i + 10)
    //   .attr("y", d => layout.height / 2)
    //   .attr("fill", d => colorMap[d])
    //   .text(d => d)
    //   .attr("alignment-baseline", "middle")
    //   .attr("text-anchor", "start")
    //   .attr("font-family", "sans-serif")
    //   .attr("font-size", 12)

    svgElement.select('#x-axis')
              .attr('transform', `translate(0, ${layout.height - layout.margin})`)
              .call(d3.axisBottom(xScale).tickSize(3))

    // svgElement.select("#title")
    //   .selectAll(".attributeName")
    //   .data([stratify])
    //   .join("text")
    //   .attr("x", layout.width / 2)
    //   .attr("y", layout.margin)
    //   .attr("text-anchor", "middle")
    //   .text(d => d);

    // removes handle to resize the brush
    // d3.selectAll('.handle').remove();
    // removes crosshair cursor
    // d3.selectAll('.brush>.overlay').remove();

  // }, [data, stratify, thresholdValue])

  let subplotStyle = {"display": "flex", "flexDirection":"column", "alignItems":"center"};
  let subplotTitle = {"fontFamily": "sans-serif", "marginTop": "15px", "marginBottom": "0px", "fontSize":"15px"};

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
       <Box width={layout.width - layout.marginLeft - layout.margin}>
          <Slider
            size="small"
            min={d3.min(data, d => d[stratify])}
            max={d3.max(data, d => d[stratify])}
            step={0.00000001}
            defaultValue={thresholdValue}
            aria-label="Small"
            valueLabelDisplay="auto"
            onChangeCommitted={(e, v) => handleChange(e, v)}
          />
        </Box>
    </div>
  )
}