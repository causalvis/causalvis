import React, {useRef, useState, useEffect} from 'react'
import * as d3 from 'd3';

export const SMDVis = ({layout = {"height": 500, "width": 600, "margin": 50, "marginLeft": 150}, SMDDataset=[], SMDExtent=[]}) => {

  // console.log("rerender...");

  const [SMD, setSMD] = React.useState(SMDDataset);

  const ref = useRef('svgSMD');
  const transitionDuration = 750

  let svg = d3.select(ref.current);

  let svgElement = svg.select("g");

  // console.log("SMD changed")

  useEffect(() => {

    setSMD(SMDDataset);

  }, [SMDDataset])

  // useEffect(() => {
  var xScale = d3.scaleLinear()
        .domain(SMDExtent)
        .range([layout.marginLeft, layout.width - layout.margin])

  var yScale = d3.scaleBand()
          .domain(SMD.map(d => d.covariate))
          .range([layout.height - layout.margin, layout.margin])

  let adjustedCircles = svgElement.select("#adjusted")
    .selectAll(".adjustedSMD")
    .data(SMD)
    .join("circle")
    .attr("class", "adjustedSMD")
    .attr("cy", d => yScale(d.covariate) + yScale.bandwidth() / 2)
    .attr("r", 3)
    .attr("fill", "black")
    .attr("stroke", "black")
    // .transition()
    // .duration(transitionDuration)
    // .ease(d3.easeLinear)
    .attr("cx", d => xScale(d.adjusted) ? xScale(d.adjusted) : layout.marginLeft)

  let unadjustedCircles = svgElement.select("#unadjusted")
    .selectAll(".unadjustedSMD")
    .data(SMD)
    .join("circle")
    .attr("class", "unadjustedSMD")
    .attr("cy", d => yScale(d.covariate) + yScale.bandwidth() / 2)
    .attr("r", 3)
    .attr("fill", "white")
    .attr("stroke", "black")
    // .transition()
    // .duration(transitionDuration)
    // .ease(d3.easeLinear)
    .attr("cx", d => xScale(d.unadjusted) ? xScale(d.unadjusted) : layout.marginLeft)

  let diffLine = svgElement.select("#diff")
    .selectAll(".diffLine")
    .data(SMD)
    .join("line")
    .attr("class", "diffLine")
    .attr("y1", d => yScale(d.covariate) + yScale.bandwidth() / 2)
    .attr("y2", d => yScale(d.covariate) + yScale.bandwidth() / 2)
    .attr("stroke", "black")
    .attr("stroke-dasharray", "2")
    // .transition()
    // .duration(transitionDuration)
    // .ease(d3.easeLinear)
    .attr("x1", d => d3.min([xScale(d.unadjusted), xScale(d.adjusted)]))
    .attr("x2", d => d3.max([xScale(d.unadjusted), xScale(d.adjusted)]))

  let thresholdText = svgElement.select("#threshold")
    .selectAll(".thresholdText")
    .data([0.1])
    .join("text")
    .attr("class", "thresholdText")
    .attr("x", d => xScale(d) + 5)
    .attr("y", layout.margin - 20)
    .text(d => d)
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("alignment-baseline", "hanging")

  let thresholdLine = svgElement.select("#threshold")
    .selectAll(".thresholdLine")
    .data([0.1])
    .join("line")
    .attr("class", "thresholdLine")
    .attr("x1", d => xScale(d))
    .attr("y1", layout.margin - 20)
    .attr("x2", d => xScale(d))
    .attr("y2", layout.height - layout.margin + 20)
    .attr("stroke", "black")
    .attr("stroke-dasharray", "2")

  // thresholdLine.transition()
  //   .duration(1000)
  //   .ease(d3.easeLinear)
  //   .attr("x1", d => xScale(d))
  //   .attr("x2", d => xScale(d))

  // thresholdText.transition()
  //   .duration(1000)
  //   .ease(d3.easeLinear)
  //   .attr("x", d => xScale(d) + 5)

  let xAxis = svgElement.select('#x-axis')
          .attr('transform', `translate(0, ${layout.height - layout.margin})`)
          .call(d3.axisBottom(xScale).tickSize(3).ticks(5))

  let yAxis = svgElement.select('#y-axis')
          .attr('transform', `translate(${layout.marginLeft}, 0)`)
          .call(d3.axisLeft(yScale).tickSize(3).ticks(5))

    // adjustedCircles.transition()
    //   .duration(transitionDuration)
    //   .ease(d3.easeLinear)
    //   .attr("cx", d => xScale(d.adjusted) ? xScale(d.adjusted) : layout.marginLeft)

    // unadjustedCircles.transition()
    //   .duration(transitionDuration)
    //   .ease(d3.easeLinear)
    //   .attr("cx", d => xScale(d.adjusted) ? xScale(d.unadjusted) : layout.marginLeft)

    // diffLine.transition()
    //   .duration(transitionDuration)
    //   .ease(d3.easeLinear)
    //   .attr("x1", d => d3.min([xScale(d.unadjusted), xScale(d.adjusted)]))
    //   .attr("x2", d => d3.max([xScale(d.unadjusted), xScale(d.adjusted)]))

    svgElement.select("#legend")
      .selectAll(".legend")
      .data(["adjusted", "unadjusted"])
      .join("circle")
      .attr("class", "legend")
      .attr("cx", layout.width - 2*layout.margin)
      .attr("cy", (d, i) => layout.height - 2*layout.margin + i * 10)
      .attr("r", 3)
      .attr("fill", d => d === "adjusted" ? "black" : "white")
      .attr("stroke", "black")

    svgElement.select("#legend")
      .selectAll(".legendText")
      .data(['adjusted', 'unadjusted'])
      .join("text")
      .attr("class", "legendText")
      .attr("x", layout.width - 2*layout.margin + 10)
      .attr("y", (d, i) => layout.height - 2*layout.margin + i * 10)
      .text(d => d)
      .attr("alignment-baseline", "middle")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)

    xAxis.transition()
        .duration(transitionDuration)
        .ease(d3.easeLinear)
        .call(d3.axisBottom(xScale).tickSize(3).ticks(5))
  // }, [SMD])

  let containerStyle = {"display":"flex"};

  return (
    <div style={containerStyle}>
      <svg width={layout.width} height={layout.height} ref={ref} id="svgSMD">
        <g>
          <g id="diff" />
          <g id="threshold" />
          <g id="unadjusted" />
          <g id="adjusted" />
          <g id="x-axis" />
          <g id="y-axis" />
          <g id="legend" />
        </g>
      </svg>

    </div>
  )
}