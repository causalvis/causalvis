import React, {useRef, useState, useEffect} from 'react';
import * as d3 from 'd3';

export const LegendVis = ({layout={"height": 20, "width": 600, "margin": 20, "marginLeft": 20}}) => {

	const ref = useRef('svgLegendVis');

  let svgElement = d3.select(`#svgLegendVis`);

  // Track color map
  const [colorMap, setColorMap] = React.useState({"treatment": "#6c8496",
                                                  "control": "#a1c5c0"});

  let legend = svgElement.select("#legend")
    .selectAll(".legendCircle")
    .data(["treatment", "control"])
    .join("circle")
    .attr("class", "legendCircle")
    .attr("cx", (d, i) => layout.width / 2 - 80 + 115 * i)
    .attr("cy", d => layout.height / 2)
    .attr("r", 5)
    .attr("fill", d => colorMap[d])

  let legendText = svgElement.select("#legend")
    .selectAll(".legendText")
    .data(["treatment", "control"])
    .join("text")
    .attr("class", "legendText")
    .attr("x", (d, i) => layout.width / 2 - 80 + 115 * i + 10)
    .attr("y", d => layout.height / 2)
    .attr("fill", d => colorMap[d])
    .text(d => d)
    .attr("alignment-baseline", "middle")
    .attr("text-anchor", "start")
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)

  return (
    <div>
      <svg width={layout.width} height={layout.height} id={`svgLegendVis`}>
        <g id="legend">
        </g>
      </svg>
    </div>
  )
}