import React, {useRef, useState, useEffect} from 'react'
import * as d3 from 'd3';

export const PropDistributionVis = ({layout = {"height": 500, "width": 600, "margin": 50, "marginLeft": 150}, propensity=[], data=[], setSelected}) => {

  // Track color map
  const [colorMap, setColorMap] = React.useState({"treatment": "#4e79a7",
                                                  "outcome": "#f28e2c",});

  // Treatment and control data for the selected attribute
  const [TAttribute, setTAttribute] = React.useState([])
  const [CAttribute, setCAttribute] = React.useState([])

  // Get bins for treatment and control groups
  const [TBins, setTBins] = React.useState([]);
  const [CBins, setCBins] = React.useState([]);

  const bins = 20;
  const n = propensity.length;
  
  const ref = useRef('svgPropDistribution');

  let svg = d3.select(ref.current)

  let svgElement = svg.select("g");

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(TAttribute, d => d.propensity)])
    .range([layout.marginLeft, layout.width - layout.margin])

  const yScaleTreatment = d3.scaleLinear()
    .domain([0, d3.max(TBins.map(d => d.length)) / n])
    .range([layout.height / 2, layout.height - layout.margin])

  const yScaleControl = d3.scaleLinear()
    .domain([0, d3.max(CBins.map(d => d.length)) / n])
    .range([layout.height / 2, layout.margin])

  useEffect(() => {

    let newTAttribute = [];
    let newCAttribute = [];

    for (let i = 0; i < data.length; i++) {
      let dataRow = data[i];
      let assignedTreatment = dataRow.treatment;

      // console.log(dataRow);

      if (assignedTreatment === 0) {
        // console.log(assignedTreatment, propensity[i]);
        dataRow.propensity = propensity[i][1];
        newCAttribute.push(dataRow);
      } else {
        // console.log(assignedTreatment, propensity[i]);
        dataRow.propensity = propensity[i][1];
        newTAttribute.push(dataRow);
      }
    }

    setTAttribute(newTAttribute);
    setCAttribute(newCAttribute);

    var histogram = d3.histogram().value(d => d.propensity).domain([0, 1]).thresholds(bins);
    var newTBins = histogram(newTAttribute);
    var newCBins = histogram(newCAttribute);

    setTBins(newTBins);
    setCBins(newCBins);

  }, [propensity])

  svgElement.select("#bars")
    .selectAll(".controlBars")
    .data(CBins)
    .join("rect")
    .attr("class", "controlBars")
    .attr("x", (d, i) => xScale(d.x0))
    .attr("y", d => yScaleControl(d.length / n))
    .attr("width", d => xScale(d.x1) - xScale(d.x0) - 1)
    .attr("height", d => yScaleControl(0) - yScaleControl(d.length / n))
    .attr("fill", colorMap.outcome)
    .on("click", (e, d) => setSelected(d))

  svgElement.select("#bars")
    .selectAll(".treatmentBars")
    .data(TBins)
    .join("rect")
    .attr("class", "treatmentBars")
    .attr("x", (d, i) => xScale(d.x0))
    .attr("y", d => yScaleTreatment(0))
    .attr("width", d => xScale(d.x1) - xScale(d.x0) - 1)
    .attr("height", d =>  yScaleTreatment(d.length / n) - yScaleTreatment(0))
    .attr("fill", colorMap.treatment)
    .on("click", (e, d) => setSelected(d))

  svgElement.select('#x-axis')
          .attr('transform', `translate(0, ${layout.height / 2})`)
          .call(d3.axisBottom(xScale).tickSize(3).ticks(5))

  svgElement.select('#y-axistreatment')
    .attr('transform', `translate(${layout.marginLeft}, 0)`)
    .call(d3.axisLeft(yScaleTreatment).tickSize(3).ticks(3))
  
  svgElement.select('#y-axiscontrol')
    .attr('transform', `translate(${layout.marginLeft}, 0)`)
    .call(d3.axisLeft(yScaleControl).tickSize(3).ticks(3))

  return (
    <div>
      <svg width={layout.width} height={layout.height} ref={ref} id="svgPropDistribution">
        <g>
          <g id="bars" />
          <g id="x-axis" />
          <g id="y-axistreatment" />
          <g id="y-axiscontrol" />
        </g>
      </svg>
    </div>
  )
}