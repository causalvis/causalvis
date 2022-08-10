import React, {useRef, useState, useEffect} from 'react'
import * as d3 from 'd3';

export const SMDVis = ({layout = {"height": 500, "width": 600, "margin": 50, "marginLeft": 150}, SMDDataset=[], SMDExtent=[]}) => {

  const ref = useRef('svgSMD');
  const transitionDuration = 750;

  let svg = d3.select(ref.current);

  let svgElement = svg.select("g");

  useEffect(() => {
    var xScale = d3.scaleLinear()
          .domain(SMDExtent)
          .range([layout.marginLeft, layout.width - layout.margin])

    var yScale = d3.scaleBand()
            .domain(SMDDataset.map(d => d.covariate))
            .range([layout.margin, layout.height - layout.margin])

    // Create a tooltip
    var tooltip = d3.select("#tooltip")
      .attr("opacity", 0)

    var tooltip_text = tooltip.select("#tooltip_text")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "hanging")
      .attr("x", "11")
      .attr("y", "1")
      .style("font-size", "11px")
      .style("font-family", "sans-serif");

    var tooltip_rect = tooltip.select("#tooltip_rect")
      .attr("fill", "white")
      .attr("width", "22")
      .attr("height", "12")
      .attr("x", "0")
      .attr("y", "0");

    let adjustedCircles = svgElement.select("#adjusted")
      .selectAll(".adjustedSMD")
      .data(SMDDataset)
      .join("circle")
      .attr("class", "adjustedSMD")
      .attr("cy", d => yScale(d.covariate) + yScale.bandwidth() / 2)
      .attr("r", 3)
      .attr("fill", "black")
      .attr("stroke", "black")
      .attr("cx", d => xScale(d.adjusted) ? xScale(d.adjusted) : layout.marginLeft)
      .attr("cursor", "pointer")
      .on("mouseover", function(e, d) {

        let adj = d.adjusted;
        let cov = d.covariate;

        tooltip.attr("opacity", 1)
              .attr("transform", `translate(${xScale(adj) ? xScale(adj) - 11 : layout.marginLeft - 11}, ${yScale(cov) + yScale.bandwidth() / 2 - 15})`)
              // .attr("x", d => xScale(adj) ? xScale(adj) : layout.marginLeft)
              // .attr("y", d => yScale(cov) + yScale.bandwidth() / 2 - 10)

        tooltip_text.text(`${Math.round(adj * 100) / 100}`);
      })
      .on("mouseout", function() {
        tooltip.attr("opacity", 0);
      });
      

    let unadjustedCircles = svgElement.select("#unadjusted")
      .selectAll(".unadjustedSMD")
      .data(SMDDataset)
      .join("circle")
      .attr("class", "unadjustedSMD")
      .attr("cy", d => yScale(d.covariate) + yScale.bandwidth() / 2)
      .attr("r", 3)
      .attr("fill", "white")
      .attr("stroke", "black")
      .attr("cx", d => xScale(d.unadjusted) ? xScale(d.unadjusted) : layout.marginLeft)
      .attr("cursor", "pointer")
      .on("mouseover", function(e, d) {

        let unadj = d.unadjusted;
        let cov = d.covariate;

        tooltip.attr("opacity", 1)
              .attr("transform", `translate(${xScale(unadj) ? xScale(unadj) - 11 : layout.marginLeft - 11}, ${yScale(cov) + yScale.bandwidth() / 2 - 15})`)
              // .attr("x", d => xScale(unadj) ? xScale(unadj) : layout.marginLeft)
              // .attr("y", d => yScale(cov) + yScale.bandwidth() / 2 - 10)
        
        tooltip_text.text(`${Math.round(unadj * 100) / 100}`);
      })
      .on("mouseout", function() {
        tooltip.attr("opacity", 0);
      });

    let diffLine = svgElement.select("#diff")
      .selectAll(".diffLine")
      .data(SMDDataset)
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
      .attr("font-size", "10px")
      .attr("alignment-baseline", "hanging")

    let thresholdLine = svgElement.select("#threshold")
      .selectAll(".thresholdLine")
      .data([0.1])
      .join("line")
      .attr("class", "thresholdLine")
      .attr("x1", d => xScale(d))
      .attr("y1", layout.margin - 20)
      .attr("x2", d => xScale(d))
      .attr("y2", layout.height - layout.margin)
      .attr("stroke", "black")
      .attr("stroke-dasharray", "5 5 2 5")

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

    // svgElement.select("#legend")
    //   .attr("transform", "translate(25px)")

    svgElement.select("#legend")
      .selectAll(".legend")
      .data(["adjusted", "unadjusted"])
      .join("circle")
      .attr("class", "legend")
      .attr("cx", (d, i) => ((layout.width - layout.marginLeft - layout.margin) / 2 + layout.marginLeft) - 48 + 80 * i)
      .attr("cy", (d, i) => layout.margin / 2 - 10)
      .attr("r", 3)
      .attr("fill", d => d === "adjusted" ? "black" : "white")
      .attr("stroke", "black")

    svgElement.select("#legend")
      .selectAll(".legendText")
      .data(['adjusted', 'unadjusted'])
      .join("text")
      .attr("class", "legendText")
      .attr("x", (d, i) => ((layout.width - layout.marginLeft - layout.margin) / 2 + layout.marginLeft) - 48 + 80 * i + 10)
      .attr("y", (d, i) => layout.margin / 2 - 10)
      .text(d => d)
      .attr("alignment-baseline", "middle")
      .attr("font-family", "sans-serif")
      .attr("font-size", "12px")

    xAxis.transition()
        .duration(transitionDuration)
        .ease(d3.easeLinear)
        .call(d3.axisBottom(xScale).tickSize(3).ticks(5))

    // Add plot title
    // svgElement.select("#title")
    //   .selectAll(".title")
    //   .data(["Standardized Mean Difference"])
    //   .join("text")
    //   .attr("class", "title")
    //   .attr("x", (layout.width - layout.marginLeft - layout.margin) / 2 + layout.marginLeft)
    //   .attr("y", layout.margin / 2)
    //   .attr("text-anchor", "middle")
    //   .attr("font-family", "sans-serif")
    //   .attr("font-size", 12)
    //   .text(d => d)

    d3.selectAll("#x-axis>.tick>text")
      .each(function(d, i){
        d3.select(this).style("font-size","12px");
      });

  }, [SMDDataset])

  let containerStyle = {"display":"flex",
                        "flexDirection":"column",
                        "alignItems":"center"};
  let titleStyle = {"marginLeft":layout.marginLeft,
                    "fontFamily":"sans-serif",
                    "fontSize":"15px"}

  return (
    <div style={containerStyle}>
      <p style={titleStyle}>Standardized Mean Difference</p>
      <svg width={layout.width} height={layout.height} ref={ref} id="svgSMD">
        <g>
          <g id="diff" />
          <g id="threshold" />
          <g id="unadjusted" />
          <g id="adjusted" />
          <g id="x-axis" />
          <g id="y-axis" />
          <g id="legend" />
          <g id="title" />
          <g id="tooltip">
            <rect id="tooltip_rect" />
            <text id="tooltip_text" />
          </g>
        </g>
        {/*<div id="tooltip" />*/}
      </svg>
     

    </div>
  )
}