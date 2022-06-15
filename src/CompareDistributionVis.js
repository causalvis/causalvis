import React, {useRef, useState, useEffect} from 'react'
import * as d3 from 'd3';

export const CompareDistributionVis = ({layout = {"height": 200, "width": 200, "margin": 20, "marginLeft": 20}, reference = [], selection = [], refIndex = ""}) => {

  // // Treatment and control data for the selected attribute
  // const [TAttribute, setTAttribute] = React.useState([])
  // const [CAttribute, setCAttribute] = React.useState([])

  // Get bins for treatment and control groups
  const [referenceBins, setReferenceBins] = React.useState([]);
  const [selectionBins, setSelectionBins] = React.useState([]);

  const referenceSize = reference.length;
  const selectionSize = selection.length;

  const bins = 30;

  useEffect(() => {

    var histogram = d3.histogram().domain([d3.min(reference), d3.max(reference)]).thresholds(bins);
    var newReferenceBins = histogram(reference);
    var newSelectionBins = histogram(selection);

    setReferenceBins(newReferenceBins);
    setSelectionBins(newSelectionBins);

    // console.log(newReferenceBins, newSelectionBins);

  }, [reference, selection])

  // console.log(refIndex);

  let newRef = "svgCompare" + refIndex
  
  const ref = useRef("svgCompare");

  let svg = d3.select(ref.current);

  let svgElement = svg.select("g");

  const xScale = d3.scaleLinear()
    .domain([d3.min(reference), d3.max(reference)])
    .range([layout.marginLeft, layout.width - layout.margin])

  let maxProportion = d3.max([d3.max(referenceBins.map(d => d.length)) / referenceSize, d3.max(selectionBins.map(d => d.length)) / selectionSize]);

  const yScale = d3.scaleLinear()
    .domain([0, maxProportion])
    .range([layout.height - layout.margin, layout.margin])

  // const yScaleControl = d3.scaleLinear()
  //   .domain([0, d3.max(referenceBins.map(d => d.length))])
  //   .range([layout.height / 2, layout.height - layout.margin])

  svgElement.select("#referenceBars")
    .selectAll(".referenceBars")
    .data(referenceBins)
    .join("rect")
    .attr("class", "referenceBars")
    .attr("x", (d, i) => xScale(d.x0))
    .attr("y", d => yScale(d.length / referenceSize))
    .attr("width", d => xScale(d.x1) - xScale(d.x0) - 1)
    .attr("height", d => yScale(0) - yScale(d.length / referenceSize))
    .attr("fill", "none")
    .attr("stroke", "black")
    // .attr("opacity", "0.35")

  svgElement.select("#selectionBars")
    .selectAll(".selectionBars")
    .data(selectionBins)
    .join("rect")
    .attr("class", "selectionBars")
    .attr("x", (d, i) => xScale(d.x0))
    .attr("y", d => yScale(d.length / selectionSize))
    .attr("width", d => xScale(d.x1) - xScale(d.x0) - 1)
    .attr("height", d => yScale(0) - yScale(d.length / selectionSize))
    .attr("fill", "steelblue")

  svgElement.select('#x-axis')
          .attr('transform', `translate(0, ${layout.height - layout.margin})`)
          .call(d3.axisBottom(xScale).tickSize(3).ticks(5))

  svgElement.select('#y-axis')
    .attr('transform', `translate(${layout.marginLeft}, 0)`)
    .call(d3.axisLeft(yScale).tickSize(3).ticks(3))

  return (
    <div>
      <p>{refIndex}</p>
      <svg width={layout.width} height={layout.height} ref={ref} id={`svgCompare${refIndex}`}>
        <g>
          <g id="selectionBars" />
          <g id="referenceBars" />
          
          <g id="x-axis" />
          <g id="y-axis" />
        </g>
      </svg>
    </div>
  )
}