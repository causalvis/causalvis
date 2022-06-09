import React, {useRef, useState, useEffect} from 'react'
import * as d3 from 'd3';

export const BalanceVis = ({layout = {"height": 600, "width": 600, "margin": 50, "marginLeft": 150}, TDataset = [], CDataset = [], attribute = ""}) => {

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
  
  const ref = useRef('svgBalance');

  let svg = d3.select(ref.current)

  let svgElement = svg.select("g");

  const xScale = d3.scaleLinear()
    .domain([0, 20])
    .range([layout.marginLeft, layout.width - layout.margin])

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(TBins.map(d => d.length))])
    .range([layout.height - layout.margin, layout.margin])

  svgElement.select("#bars")
    .selectAll(".treatmentBars")
    .data(TBins)
    .join("rect")
    .attr("class", "treatmentBars")
    .attr("x", (d, i) => xScale(i))
    .attr("y", d => yScale(d.length))
    .attr("width", (layout.width - 2*layout.margin) / 20)
    .attr("height", d => yScale(0) - yScale(d.length))



  return (
    <div>
      <svg width={layout.width} height={layout.height} ref={ref} id="svgBalance">
        <g>
          <g id="bars" />
          <g id="threshold" />
          <g id="unweighted" />
        </g>
      </svg>
    </div>
  )
}