import React, {useRef, useState, useEffect} from 'react'
import * as d3 from 'd3';

export const DistributionVis = ({layout = {"height": 300, "width": 800, "margin": 50, "marginLeft": 150}, TDataset = [], CDataset = [], attribute = ""}) => {

  // Treatment and control data for the selected attribute
  const [TAttribute, setTAttribute] = React.useState([])
  const [CAttribute, setCAttribute] = React.useState([])

  // Get bins for treatment and control groups
  const [TBins, setTBins] = React.useState([]);
  const [CBins, setCBins] = React.useState([]);

  useEffect(() => {

    let newTAttribute = TDataset.map(d => d[attribute]);
    let newCAttribute = CDataset.map(d => d[attribute]);

    setTAttribute(newTAttribute);
    setCAttribute(newCAttribute);

    var histogram = d3.histogram().thresholds(20);
    var newTBins = histogram(newTAttribute);
    var newCBins = histogram(newCAttribute);

    setTBins(newTBins);
    setCBins(newCBins);

  }, [TDataset, CDataset, attribute])
  
  const ref = useRef('svgDist');

  let svg = d3.select(ref.current)

  let svgElement = svg.select("g");

  const xScale = d3.scaleLinear()
    .domain([0, 20])
    .range([layout.marginLeft, layout.width - layout.margin])

  const yScaleTreatment = d3.scaleLinear()
    .domain([0, d3.max(TBins.map(d => d.length))])
    .range([layout.height / 2, layout.margin])

  const yScaleControl = d3.scaleLinear()
    .domain([0, d3.max(TBins.map(d => d.length))])
    .range([layout.height / 2, layout.height - layout.margin])

  svgElement.select("#bars")
    .selectAll(".treatmentBars")
    .data(TBins)
    .join("rect")
    .attr("class", "treatmentBars")
    .attr("x", (d, i) => xScale(i))
    .attr("y", d => yScaleTreatment(d.length))
    .attr("width", (layout.width - 2*layout.margin) / 20)
    .attr("height", d => yScaleTreatment(0) - yScaleTreatment(d.length))
    .attr("fill", "steelblue")

  svgElement.select("#bars")
    .selectAll(".controlBars")
    .data(CBins)
    .join("rect")
    .attr("class", "controlBars")
    .attr("x", (d, i) => xScale(i))
    .attr("y", d => yScaleControl(0))
    .attr("width", (layout.width - 2*layout.margin) / 20)
    .attr("height", d =>  yScaleControl(d.length) - yScaleControl(0))
    .attr("fill", "orange")

  svgElement.select('#x-axis')
          .attr('transform', `translate(0, ${layout.height / 2})`)
          .call(d3.axisBottom(xScale).tickSize(3).ticks(5))

  return (
    <div>
      <p>Distribution of {attribute}</p>
      <svg width={layout.width} height={layout.height} ref={ref} id="svgDist">
        <g>
          <g id="bars" />
          <g id="x-axis" />
          <g id="unweighted" />
        </g>
      </svg>
    </div>
  )
}