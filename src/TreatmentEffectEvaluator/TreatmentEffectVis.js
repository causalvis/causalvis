import React, {useRef, useState, useEffect} from 'react';
import regression from 'regression';
import * as d3 from 'd3';

export const TreatmentEffectVis = ({allData={}, index=0, treatment="treatment", outcome="outcome"}) => {

	const ref = useRef('svgTreatmentEffect');

  let svg = d3.select(`#svgTreatmentEffect${index}`);

  let svgElement = svg.select("g");

  // Track color map
  const [colorMap, setColorMap] = React.useState({1: "#6c8496",
                                                  0: "#a1c5c0"});
  // const transitionDuration = 750;

  const [cohortData, setCohortData] = React.useState([]);
  const [stratifyBy, setStratifyBy] = React.useState("");
  const [plotTitle, setPlotTitle] = React.useState("");
  const [layout, setLayout] = React.useState({"height": 500, "width": 600, "margin": 50, "marginLeft": 50});
  const [treatmentReg, setTreatmentReg] = React.useState([[0, 0], [0, 0]]);
  const [controlReg, setControlReg] = React.useState([[0, 0], [0, 0]]);

  useEffect(() => {
  	let cohortData = allData["data"];
  	let stratifyBy = allData["stratifyBy"];

  	setCohortData(cohortData);
  	setStratifyBy(stratifyBy);
  	setPlotTitle(allData["title"]);
  	setLayout(allData["layout"]);

  	let treatmentData = cohortData.filter(d => d[treatment] === 1);
  	let controlData = cohortData.filter(d => d[treatment] === 0);

  	let treatmentLine = regression.linear(treatmentData.map(d => [d[stratifyBy], d[outcome]]));
  	let controlLine = regression.linear(controlData.map(d => [d[stratifyBy], d[outcome]]));

  	let extent = d3.extent(cohortData, d => d[stratifyBy]);

  	let treatmentStart = treatmentLine.predict(extent[0]);
  	let treatmentEnd = treatmentLine.predict(extent[1]);

  	// let controlExtent = d3.extent(controlData, d => d[stratifyBy]);

  	let controlStart = controlLine.predict(extent[0]);
  	let controlEnd = controlLine.predict(extent[1]);

  	setTreatmentReg([treatmentStart, treatmentEnd]);
  	setControlReg([controlStart, controlEnd]);

  	// console.log([treatmentStart, treatmentEnd], [controlStart, controlEnd]);

  }, [allData])

  useEffect(() => {
  	var xScale = d3.scaleLinear()
          .domain(d3.extent(cohortData, d => d[stratifyBy]))
          .range([layout.marginLeft, layout.width - layout.margin])

    var yScale = d3.scaleLinear()
            .domain(d3.extent(cohortData, d => d[outcome]))
            .range([layout.height - layout.marginBottom, layout.margin])

    let outcomes = svgElement.select("#outcomes")
      .selectAll(".outcomeCircles")
      .data(cohortData)
      .join("circle")
      .attr("class", "outcomeCircles")
      .attr("cx", d => xScale(d[stratifyBy]))
      .attr("cy", d => yScale(d[outcome]))
      .attr("r", 3)
      .attr("fill", d => colorMap[d[treatment]])
      .attr("cursor", "pointer")

    let regressionLines = svgElement.select("#regression")
      .selectAll(".regressionLine")
      .data([treatmentReg, controlReg])
      .join("line")
      .attr("class", "regressionLine")
      .attr("x1", d => xScale(d[0][0]))
      .attr("y1", d => yScale(d[0][1]))
      .attr("x2", d => xScale(d[1][0]))
      .attr("y2", d => yScale(d[1][1]))
      .attr("stroke", "black")
      // .attr("fill", d => colorMap[d[treatment]])

    let xAxis = svgElement.select('#x-axis')
            .attr('transform', `translate(0, ${layout.height - layout.marginBottom})`)
            .call(d3.axisBottom(xScale).tickSize(3))

    let yAxis = svgElement.select('#y-axis')
            .attr('transform', `translate(${layout.marginLeft}, 0)`)
            .call(d3.axisLeft(yScale).tickSize(3).ticks(5))

    svgElement.select('#x-axis')
    	.selectAll("#axis-title")
    	.data([stratifyBy])
    	.join("text")
    	.attr("id", "axis-title")
    	.attr("x", layout.width / 2)
    	.attr("y", 25)
    	.attr("text-anchor", "middle")
    	.attr("fill", "black")
    	.attr("font-size", "12px")
    	.text(d => d)

    // let title = svgElement.select('#title')
    // 				.selectAll("text")
    // 				.data([plotTitle])
    // 				.join("text")
    // 				.attr("x", layout.width / 2)
    // 				.attr("y", layout.margin)
    // 				.attr("text-anchor", "middle")
    // 				.attr("font-family", "sans-serif")
    // 				.attr("font-size", "16px")
    // 				.text(d => d)

  }, [cohortData, stratifyBy, layout])

  let subplotStyle = {"display": "flex", "flexDirection":"column", "alignItems":"center"};
  let subplotTitle = {"fontFamily": "sans-serif", "marginTop": "15px", "marginBottom": "0px", "fontSize":"13px"};

  return (
    <div style={subplotStyle}>
    	<p style={subplotTitle}>{plotTitle}</p>
      <svg width={layout.width} height={layout.height} id={`svgTreatmentEffect${index}`}>
        <g>
        	<g id="x-axis" />
          <g id="y-axis" />
          <g id="outcomes" />
          <g id="regression" />
          <g id="title" />
        </g>
      </svg>
    </div>
  )
}