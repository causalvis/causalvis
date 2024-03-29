import React, {useRef, useState, useEffect} from 'react';
import * as d3 from 'd3';

// This visualization is modified from https://observablehq.com/@d3/zoomable-icicle
export const VersionTree = ({layout={"height": 120, "width": 1200, "margin": 30, "marginLeft": 10, "marginBottom": 30},
                              data={"children": [], "name": "All Versions"},
                              colorScale,
                              _dag,
                              _cohort}) => {

  const ref = useRef('svgVersionTree');

  let component = d3.select(ref.current)

  let svgElement = component.select("svg");

  function partition(data) {
    const root = d3.hierarchy(data)
        .sum(d =>  d.children ? 0 : 1)
    return d3.partition()
        .size([layout.height, (root.height + 1) * layout.width / 3])
      (root);
  }

  const root = partition(data);
  let focus = root;
  let selected = focus.data.name;

  const rect = svgElement.select("#rect")
    .selectAll("rect")
    .data(root.descendants())
    .join("rect")
    .attr("transform", d => `translate(${d.y0},${d.x0})`)
    .attr("width", d => d.y1 - d.y0 - 1)
    .attr("height", d => rectHeight(d))
    .attr("fill-opacity", 0.48)
    .attr("fill", d => {
      if (!d.depth) return "#ccc";
      while (d.depth > 1) d = d.parent;
      return colorScale(JSON.stringify(d.data.DAG));
    })
    .style("cursor", "pointer")
    .on("click", clicked);

  const text = svgElement.select("#text")
      .selectAll("text")
      .data(root.descendants())
      .join("text")
      .attr("transform", d => `translate(${d.y0},${d.x0})`)
      .style("user-select", "none")
      .attr("pointer-events", "none")
      .attr("x", 5)
      .attr("y", 12)
      .attr("fill-opacity", d => +labelVisible(d))
      .text(d => d.data.name)
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px");

  const tspan = svgElement.select("#tspan")
      .selectAll("tspan")
      .data(root.descendants())
      .join("tspan")
      .attr("transform", d => `translate(${d.y0},${d.x0})`)
      .text(d => d.data.name)
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px");

  const selectedTitle = component.select("#selectedTitle")
      .attr("font-family", "sans-serif")
      .attr("font-size", "11px")
      .selectAll("text")
      .data([selected])
      .join("text")
      .text(d => getTitle(d))

  function getTitle(s) {
    if (s !== "All Versions") {
      return `Showing ${s}. `
    } else {
      return "Showing All Versions. "
    }
  }

  function setVariables(node) {
    let DAGInput = document.getElementById(_dag);
    let CohortInput = document.getElementById(_cohort);

    if (node.data.DAG && DAGInput) {
      DAGInput.value = JSON.stringify(node.data.DAG);
      var event = document.createEvent('HTMLEvents');
      event.initEvent('input', false, true);
      DAGInput.dispatchEvent(event);

      if (CohortInput) {
        CohortInput.value = "";
        var event = document.createEvent('HTMLEvents');
        event.initEvent('input', false, true);
        CohortInput.dispatchEvent(event);
      }
    }

    if (node.data.Cohort && CohortInput) {
      CohortInput.value = JSON.stringify(node.data.Cohort);
      var event = document.createEvent('HTMLEvents');
      event.initEvent('input', false, true);
      CohortInput.dispatchEvent(event);

      if (DAGInput) {
        DAGInput.value = "";
        var event = document.createEvent('HTMLEvents');
        event.initEvent('input', false, true);
        DAGInput.dispatchEvent(event);
      }
    }
  }

  function clicked(event, p) {    

    focus = focus === p ? p = p.parent : p;

    selected = focus.data.name;
    setVariables(focus);

    root.each(d => d.target = {
      x0: (d.x0 - p.x0) / (p.x1 - p.x0) * layout.height,
      x1: (d.x1 - p.x0) / (p.x1 - p.x0) * layout.height,
      y0: d.y0 - p.y0,
      y1: d.y1 - p.y0
    });

    const tr = rect.transition().duration(750)
        .attr("transform", d => `translate(${d.target.y0},${d.target.x0})`);

    const tt = text.transition().duration(750)
        .attr("transform", d => `translate(${d.target.y0},${d.target.x0})`);

    const ts = tspan.transition().duration(750)
        .attr("transform", d => `translate(${d.target.y0},${d.target.x0})`);

    rect.transition(tr).attr("height", d => rectHeight(d.target));
    text.transition(tt).attr("fill-opacity", d => +labelVisible(d.target));
    tspan.transition(ts).attr("fill-opacity", d => labelVisible(d.target) * 0.7);

    selectedTitle.text(getTitle(selected));
  }
  
  function rectHeight(d) {
    return d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2);
  }

  function labelVisible(d) {
    return d.y1 <= layout.width && d.y0 >= 0 && d.x1 - d.x0 > 16;
  }

  function handleDownload() {
    console.log('here', focus);
  }

  const titleStyle = {"fontFamily": "sans-serif",
                      "fontSize": "13px",
                      "display": "flex",
                      "alignItems": "center"};
  const downloadStyle = {"color":"steelblue", "cursor": "pointer"}

  return (
    <div ref={ref} >
      <div style={titleStyle}>
        <p id="selectedTitle"></p>
        {/*<p>&nbsp;</p>
        <span style={downloadStyle} onClick={() => handleDownload()}><u>Download.</u></span>*/}
      </div>
      <svg width={layout.width} height={layout.height} id={`svgVersionTree`}>
        <g id="rect" />
        <g id="text" />
        <g id="tspan" />
      </svg>
    </div>
  )
}