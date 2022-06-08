import React, {useRef, useState, useEffect} from 'react'
import * as d3 from 'd3';

export const SMDVis = ({layout = {"height": 500, "width": 500, "margin": 50}, SMDDataset = []}) => {

  const ref = useRef('svgSMD');

  let svg = d3.select(ref.current)

  let svgElement = svg.select("g");

  var xScale = d3.scaleLinear()
          .domain([Math.min(d3.min(SMDDataset, d => d.unweighted), d3.min(SMDDataset, d => d.weighted)), Math.max(d3.max(SMDDataset, d => d.unweighted), d3.max(SMDDataset, d => d.weighted))])
          .range([layout.margin, layout.width - layout.margin])

  var yScale = d3.scaleBand()
          .domain(SMDDataset.map(d => d.covariate))
          .range([layout.height - layout.margin, layout.margin])

  svgElement.select("#weighted")
    .selectAll(".weightedSMD")
    .data(SMDDataset)
    .join("circle")
    .attr("class", "weightedSMD")
    .attr("cx", d => xScale(d.weighted))
    .attr("cy", d => yScale(d.covariate))
    .attr("r", 3)
    .attr("fill", "steelblue")
    .attr("stroke", "steelblue")

  svgElement.select("#unweighted")
    .selectAll(".unweightedSMD")
    .data(SMDDataset)
    .join("circle")
    .attr("class", "weightedSMD")
    .attr("cx", d => xScale(d.unweighted))
    .attr("cy", d => yScale(d.covariate))
    .attr("r", 3)
    .attr("fill", "white")
    .attr("stroke", "orange")

  svgElement.select("#diff")
    .selectAll(".diffLine")
    .data(SMDDataset)
    .join("line")
    .attr("class", "diffLine")
    .attr("x1", d => xScale(d.unweighted))
    .attr("y1", d => yScale(d.covariate))
    .attr("x2", d => xScale(d.weighted))
    .attr("y2", d => yScale(d.covariate))
    .attr("stroke", "black")
    .attr("stroke-dasharray", "2")

  svgElement.select("#threshold")
    .selectAll(".thresholdLine")
    .data([0.1])
    .join("line")
    .attr("class", "thresholdLine")
    .attr("x1", d => xScale(d))
    .attr("y1", 0)
    .attr("x2", d => xScale(d))
    .attr("y2", layout.height)
    .attr("stroke", "black")
    .attr("stroke-dasharray", "2")

  svgElement.select("#threshold")
    .selectAll(".thresholdText")
    .data([0.1])
    .join("text")
    .attr("class", "thresholdText")
    .attr("x", d => xScale(d) + 5)
    .attr("y", layout.margin - 20)
    .text(d => d)
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)

  svgElement.select("#legend")
    .selectAll(".legend")
    .data(['weighted', 'unweighted'])
    .join("circle")
    .attr("class", "legend")
    .attr("cx", layout.width - 2*layout.margin)
    .attr("cy", (d, i) => layout.height - 2*layout.margin + i * 10)
    .attr("r", 3)
    .attr("fill", d => d === "weighted" ? "steelblue" : "orange")

  svgElement.select("#legend")
    .selectAll(".legendText")
    .data(['weighted', 'unweighted'])
    .join("text")
    .attr("class", "legendText")
    .attr("x", layout.width - 2*layout.margin + 10)
    .attr("y", (d, i) => layout.height - 2*layout.margin + i * 10)
    .text(d => d)
    .attr('alignment-baseline', 'middle')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)

  svgElement.select('#x-axis')
          .attr('transform', `translate(0, ${layout.height - layout.margin})`)
          .call(d3.axisBottom(xScale).tickSize(3).ticks(5))

  svgElement.select('#y-axis')
          .attr('transform', `translate(${layout.margin}, 0)`)
          .call(d3.axisLeft(yScale).tickSize(3).ticks(5))

  return (
    <div>
      <svg width={layout.width} height={layout.height} ref={ref} id="svgSMD">
        <g>
          <g id="diff" />
          <g id="threshold" />
          <g id="unweighted" />
          <g id="weighted" />
          <g id="x-axis" />
          <g id="y-axis" />
          <g id="legend" />
        </g>
      </svg>
    </div>
  )
}