import React, {useRef, useState, useEffect} from 'react'
import * as d3 from 'd3';

export const PropDistributionVis = ({layout = {"height": 500, "width": 500, "margin": 50, "marginLeft": 50},
                                     bins={},
                                     n={},
                                     maxPropensity=1,
                                     setSelectRange}) => {

  // Track color map
  const [colorMap, setColorMap] = React.useState({"treatment": "#bf99ba",
                                                  "outcome": "#f28e2c",
                                                  "control": "#a5c8d4"});

  // Track previous bar heights
  const [prevCBins, setPrevCBins] = React.useState(null);
  const [prevTBins, setPrevTBins] = React.useState(null);
  
  const ref = useRef('svgPropDistribution');

  const transitionDuration = 1000;

  let svg = d3.select(ref.current)

  let svgElement = svg.select("g");

  useEffect(() => {
    let newCBins = [];
    let newTBins = [];

    var xScale = d3.scaleLinear()
      .domain([0, maxPropensity])
      .range([layout.marginLeft, layout.width - layout.margin])

    let controlCount = n.CBins;
    let treatmentCount = n.TBins;

    let yMax = d3.max([d3.max(bins.TBins.map(d => d.length)) / treatmentCount, d3.max(bins.CBins.map(d => d.length)) / controlCount]);

    // Some hardcoding to ensure proper scaling on initialization;
    if (yMax === 0) {yMax = 1};

    var yScaleTreatment = d3.scaleLinear()
      .domain([0, yMax])
      .range([layout.height / 2, layout.height - layout.margin])

    var yScaleControl = d3.scaleLinear()
      .domain([0, yMax])
      .range([layout.height / 2, layout.margin])

    function onBrush(e) {
      // let brushSelection = e.selection;
      // console.log(brushSelection[1], xScale.invert(brushSelection[1]));
    }

    function brushEnd(e) {
      let brushSelection = e.selection;
      let brushExtent;

      if (brushSelection) {
        brushExtent = [xScale.invert(brushSelection[0]), xScale.invert(brushSelection[1])];
        // console.log(brushExtent)
        setSelectRange(brushExtent);
      } else {
        brushExtent = null;
        setSelectRange(null);
      }
      
      // updateFilter(refIndex, brushExtent);
    }

    var brush = d3.brushX()
                .extent([[layout.marginLeft, layout.margin], [layout.width-layout.margin, layout.height-layout.margin, layout.margin]])
                // .on("brush", (e) => onBrush(e))
                .on("end", (e) => brushEnd(e))

    svgElement.call(brush)

    let controlBars = svgElement.select("#bars")
      .selectAll(".controlBars")
      .data(bins.CBins)
      .join("rect")
      .attr("class", "controlBars")
      .attr("x", (d, i) => xScale(d.x0))
      .attr("y", (d, i) => prevCBins[i] ? prevCBins[i].y : yScaleControl(0))
      .attr("width", d => xScale(d.x1) - xScale(d.x0) - 1)
      .attr("height", (d, i) => prevCBins[i] ? prevCBins[i].height : 0)
      .attr("fill", colorMap.control)
      .attr("cursor", "pointer")
      .on("click", function (e, d) {
        if (d3.select(this).attr("opacity") === "1") {
          // setSelected({"selectedData":[], "treatment":false});
          controlBars.attr("opacity", null);
          treatmentBars.attr("opacity", null);
        } else {
          // setSelected({"selectedData":d, "treatment":false});
          controlBars.attr("opacity", 0.5);
          treatmentBars.attr("opacity", 0.5);
          d3.select(this).attr("opacity", 1);
        }
      })
      
    controlBars.transition()
      .duration(transitionDuration)
      .ease(d3.easeLinear)
      .attr("y", (d, i) => {
        newCBins[i] = {"y": yScaleControl(d.length / controlCount)};
        return yScaleControl(d.length / controlCount)})
      .attr("height", (d, i) => {
        newCBins[i].height = yScaleControl(0) - yScaleControl(d.length / controlCount);
        return yScaleControl(0) - yScaleControl(d.length / controlCount)
      })

    let treatmentBars = svgElement.select("#bars")
      .selectAll(".treatmentBars")
      .data(bins.TBins)
      .join("rect")
      .attr("class", "treatmentBars")
      .attr("x", (d, i) => xScale(d.x0))
      .attr("y", (d, i) => yScaleTreatment(0))
      .attr("width", d => xScale(d.x1) - xScale(d.x0) - 1)
      .attr("height", (d, i) => prevTBins[i] ? prevTBins[i].height : 0)
      .attr("fill", colorMap.treatment)
      .attr("cursor", "pointer")
      .on("click", function (e, d) {
        if (d3.select(this).attr("opacity") === "1") {
          // setSelected({"selectedData":[], "treatment":false});
          controlBars.attr("opacity", null);
          treatmentBars.attr("opacity", null);
        } else {
          // setSelected({"selectedData":d, "treatment":true});
          controlBars.attr("opacity", 0.5);
          treatmentBars.attr("opacity", 0.5);
          d3.select(this).attr("opacity", 1);
        }
      })

    treatmentBars.transition()
      .duration(transitionDuration)
      .ease(d3.easeLinear)
      .attr("height", (d, i) => {
        newTBins[i] = {"height":yScaleTreatment(d.length / treatmentCount) - yScaleTreatment(0)};
        return yScaleTreatment(d.length / treatmentCount) - yScaleTreatment(0)
      })

    let xAxis = svgElement.select('#x-axis')
            .attr('transform', `translate(0, ${layout.height - layout.margin})`)
            .call(d3.axisBottom(xScale).tickSize(3).ticks(5))

    let yAxisTreatment = svgElement.select('#y-axistreatment')
            .attr('transform', `translate(${layout.marginLeft}, 0)`)
            .call(d3.axisLeft(yScaleTreatment).tickSize(3).ticks(3))
      
    let yAxisControl = svgElement.select('#y-axiscontrol')
            .attr('transform', `translate(${layout.marginLeft}, 0)`)
            .call(d3.axisLeft(yScaleControl).tickSize(3).ticks(3))

    svgElement.select("#zero")
          .selectAll(".zeroLine")
          .data([0])
          .join("line")
          .attr("class", "zeroLine")
          .attr("y1", d => yScaleTreatment(0))
          .attr("x1", layout.marginLeft)
          .attr("y2", d => yScaleTreatment(0))
          .attr("x2", layout.width - layout.margin)
          .attr("stroke", "black")
          .attr("stroke-dasharray", "5 5 2 5")

    // controlBars.transition()
    //   .duration(transitionDuration)
    //   .ease(d3.easeLinear)
    //   .attr("y", d => yScaleControl(d.length / n))
    //   .attr("height", d => yScaleControl(0) - yScaleControl(d.length / n))

    // treatmentBars.transition()
    //   .duration(1000)
    //   .ease(d3.easeLinear)
    //   .attr("height", d =>  yScaleTreatment(d.length / n) - yScaleTreatment(0))

    svgElement.select("#legend")
      .selectAll(".legend")
      .data(["control", "treatment"])
      .join("rect")
      .attr("class", "legend")
      .attr("x", (d, i) => layout.width / 2 - 55 + 80 * i)
      .attr("y", (d, i) => layout.margin / 2 - 16)
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", d => colorMap[d])

    svgElement.select("#legend")
      .selectAll(".legendText")
      .data(["control", "treatment"])
      .join("text")
      .attr("class", "legendText")
      .attr("x", (d, i) => layout.width / 2 - 55 + 80 * i + 18)
      .attr("y", (d, i) => layout.margin / 2 - 10)
      .attr("alignment-baseline", "middle")
      .attr("text-anchor", "start")
      .attr("fill", d => colorMap[d])
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .text(d => d)

    // svgElement.select("#title")
    //   .selectAll(".title")
    //   .data(["Propensity Score Distribution Plot"])
    //   .join("text")
    //   .attr("class", "title")
    //   .attr("x", layout.width / 2)
    //   .attr("y", layout.margin / 2)
    //   .attr("text-anchor", "middle")
    //   .attr("font-family", "sans-serif")
    //   .attr("font-size", 12)
    //   .text(d => d)

    xAxis.transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .call(d3.axisBottom(xScale).tickSize(3).ticks(5))

    yAxisTreatment.transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .call(d3.axisLeft(yScaleTreatment).tickSize(3).ticks(3))

    yAxisControl.transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .call(d3.axisLeft(yScaleControl).tickSize(3).ticks(3))

    d3.selectAll("#x-axis>.tick>text")
      .each(function(d, i){
        d3.select(this).style("font-size","12px");
      });

    d3.selectAll("#y-axistreatment>.tick>text")
      .each(function(d, i){
        d3.select(this).style("font-size","12px");
      });

    d3.selectAll("#y-axiscontrol>.tick>text")
      .each(function(d, i){
        d3.select(this).style("font-size","12px");
      });

    setPrevCBins([...newCBins]);
    setPrevTBins([...newTBins]);
  }, [bins])

  let containerStyle = {"display":"flex",
                        "flexDirection":"column",
                        "alignItems":"center"};
  let titleStyle = {"marginLeft":layout.marginLeft,
                    "fontFamily":"sans-serif",
                    "fontSize":"15px"}

  return (
    <div style={containerStyle}>
      <p style={titleStyle}>Propensity Score Distribution Plot</p>
      <svg width={layout.width} height={layout.height} ref={ref} id="svgPropDistribution">
        <g>
          <g id="bars" />
          <g id="x-axis" />
          <g id="y-axistreatment" />
          <g id="y-axiscontrol" />
          <g id="legend" />
          <g id="title" />
          <g id="zero" />
        </g>
      </svg>
    </div>
  )
}