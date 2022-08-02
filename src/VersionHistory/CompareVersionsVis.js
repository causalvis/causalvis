import React, {useRef, useState, useEffect} from 'react'
import * as d3 from 'd3';

export const CompareVersionsVis = ({layout={"height": 120, "width": 1200, "margin": 35, "marginLeft": 50, "marginBottom": 30},
                                    data=[],
                                    stratifyBy="",
                                    colorScale}) => {

  const [ATE, setATE] = React.useState(data);
  const [subGroup, setSubGroup] = React.useState(stratifyBy);

  useEffect(() => {
    setATE(data);
  }, [data])

  useEffect(() => {
    setSubGroup(stratifyBy);
  }, [stratifyBy])

  const ref = useRef('svgCompareVersionsVis');

  let svg = d3.select(ref.current);

  let svgElement = svg.select("g");

  useEffect(() => {

    let xScale = d3.scaleLinear()
      .domain(d3.extent(ATE, d => d.ATE))
      .range([layout.marginLeft, layout.width - layout.margin])

    let yScale;

    if (stratifyBy != "") {
      yScale = d3.scaleOrdinal()
        .domain(d3.extent(ATE, d => d.group))
        .range([layout.margin + 10, layout.height - layout.margin - 10])
    }

    let atePoints = svgElement.select("#ate")
      .selectAll(".atePoints")
      .data(ATE)
      .join("circle")
      .attr("class", "atePoints")
      .attr("cx", d => xScale(d.ATE))
      .attr("cy", d => stratifyBy ? yScale(d.group) : layout.height / 2)
      .attr("r", 5)
      .attr("fill", d => colorScale(d.DAG))
      .attr("opacity", "0.48")

    svgElement.select("#x-axis")
            .attr("transform", `translate(0, ${layout.height - layout.margin + 10})`)
            .call(d3.axisBottom(xScale).tickSize(3).ticks(5))

    svgElement.selectAll("#x-axis")
      .selectAll(".axisText")
      .data(["ATE"])
      .join("text")
      .attr("class", "axisText")
      .attr("transform", `translate(${(layout.width - layout.margin)}, ${25})`)
      .attr("font-family", "sans-serif")
      .attr("fill", "black")
      .text(d => d)

    if (yScale) {
      svgElement.select('#y-axis')
            .attr('opacity', 1)
            .attr('transform', `translate(${layout.marginLeft - 10}, 0)`)
            .call(d3.axisLeft(yScale))
            .call(g => g.select(".domain").remove())
    } else {
      svgElement.select('#y-axis')
            .attr('opacity', 0)
    }

  }, [ATE, subGroup])

  return (
    <div>
      <svg width={layout.width} height={layout.height} ref={ref} id="svgCompareVersionsVis">
        <g>
          <g id="ate" />
          <g id="x-axis">
          </g>
          <g id="y-axis" />
        </g>
      </svg>
    </div>
  )
}