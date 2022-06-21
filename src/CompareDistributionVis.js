import React, {useRef, useState, useEffect} from 'react'
import * as d3 from 'd3';

export const CompareDistributionVis = ({layout = {"height": 120, "width": 500, "margin": 20, "marginLeft": 20}, unadjusted = [], adjusted, selection = [], treatmentAssignment = [], propensity = [], refIndex = "", updateFilter}) => {

  // Get bins for treatment and control groups
  const [unadjustedTBins, setUnadjustedTBins] = React.useState([]);
  const [unadjustedCBins, setUnadjustedCBins] = React.useState([]);

  const [selectionBins, setSelectionBins] = React.useState([]);

  const unadjustedSize = unadjusted.length;
  const selectionSize = selection.length;

  const bins = 50;

  // Track color map
  const [colorMap, setColorMap] = React.useState({"treatment": "#4e79a7",
                                                  "outcome": "#f28e2c",
                                                  "control": "#90b0d1"});

  // console.log(refIndex);

  useEffect(() => {

    let treatment = unadjusted.filter((r, i) => treatmentAssignment[i] === 1);
    let control = unadjusted.filter((r, i) => treatmentAssignment[i] === 0);

    var histogram = d3.histogram().domain([d3.min(unadjusted), d3.max(unadjusted)]).thresholds(bins);
    var newReferenceTBins = histogram(treatment);
    var newReferenceCBins = histogram(control);
    var newSelectionBins = histogram(selection);

    setUnadjustedTBins(newReferenceTBins);
    setUnadjustedCBins(newReferenceCBins);
    setSelectionBins(newSelectionBins);

    // console.log(newReferenceBins, newSelectionBins);

  }, [unadjusted, selection])

  // console.log(refIndex);

  let newRef = "svgCompare" + refIndex
  
  const ref = useRef("svgCompare");

  let svg = d3.select(ref.current);

  let svgElement = svg.select("g");

  function kde_weighted(kernel, thresholds, data, weights) {
    let density = [];

    for (let t of thresholds) {
      let tValues = data.map(d => kernel(t - d));

      if (weights) {
        // console.log("here");
        let total = 0;
        let total_weights = 0;

        for (let i = 0; i < tValues.length; i++) {
          let tValue = tValues[i];
          let w = weights[i];

          total += (tValue * w);
          total_weights += w;
        }

        let weighted_mean = total_weights === 0 ? 0 : total / total_weights;
        density.push([t, weighted_mean]);

      } else {
        let mean = d3.sum(tValues) / tValues.length;
        density.push([t, mean]);
      }
      
    }

    return density
  }

  // The following functions are modified from https://observablehq.com/@d3/kernel-density-estimation
  function kde(kernel, thresholds, data) {
    return thresholds.map(t => [t, d3.mean(data, d => kernel(t - d))]);
  }

  // Modify to multiply by weight
  function epanechnikov(bandwidth, weights) {
    // if (weights) {
      // return
    // } else {
      return x => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;
    // }
  }

  function getLine(thresholds, d, startPoint, endPoint, xScale, yScale, weights) {
    // console.log(weights);
    let density = kde_weighted(epanechnikov(3.5), thresholds, d, weights);

    density = [startPoint].concat(density).concat([endPoint]);

    // console.log(density);

    let line = d3.line()
      .curve(d3.curveBasis)
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]));

    return line(density);
  }

  useEffect(() => {
    if (unadjustedTBins.length === 0 || unadjustedCBins.length === 0) {
      return;
    }

    // function onBrush(e) {
    //   let brushSelection = e.selection;
    //   // console.log(brushSelection[1], xScale.invert(brushSelection[1]));
    // }

    // function brushEnd(e) {
    //   let brushSelection = e.selection;
    //   let brushExtent;

    //   if (brushSelection) {
    //     brushExtent = [xScale.invert(brushSelection[0]), xScale.invert(brushSelection[1])];
    //   } else {
    //     brushExtent = null;
    //   }
      
    //   updateFilter(refIndex, brushExtent);
    // }

    // var brush = d3.brushX()
    //             .extent([[layout.marginLeft, layout.margin], [layout.width-layout.margin, layout.height-layout.margin, layout.margin]])
    //             // .on("brush", (e) => onBrush(e))
    //             .on("end", (e) => brushEnd(e))

    // svgElement.call(brush)

    const xScale = d3.scaleLinear()
      .domain([d3.min(unadjusted), d3.max(unadjusted)])
      .range([layout.marginLeft, layout.width - layout.margin])

    let maxProportion = d3.max([d3.max(unadjustedTBins.map(d => d.length)) / unadjustedSize, d3.max(unadjustedCBins.map(d => d.length)) / unadjustedSize]);

    const yScaleTreatment = d3.scaleLinear()
      .domain([0, maxProportion])
      .range([layout.height / 2, layout.height - layout.margin])

    const yScaleControl = d3.scaleLinear()
      .domain([0, maxProportion])
      .range([layout.height / 2, layout.margin])

    let control = unadjusted.filter((r, i) => treatmentAssignment[i] === 0);
    let treatment = unadjusted.filter((r, i) => treatmentAssignment[i] === 1);

    let allPropensity = propensity.map((p, i) => p[treatmentAssignment[i]]);
    let controlPropensity = allPropensity.filter((r, i) => treatmentAssignment[i] === 0);
    let treatmentPropensity = allPropensity.filter((r, i) => treatmentAssignment[i] === 1);
    // console.log("propensity", propensity, controlPropensity, controlPropensity.map(p => 1/p))

    let controlMean = d3.mean(control);
    let treatmentMean = d3.mean(treatment);
    
    let thresholds = xScale.ticks(bins);

    let startPoint = [d3.min(unadjusted), 0];
    let endPoint = [d3.max(unadjusted), 0];
    
    svgElement.select("#unadjusted")
      .selectAll(".unadjustedCLine")
      .data([control])
      .join("path")
      .attr("class", "unadjustedCLine")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d", d => getLine(thresholds, d, startPoint, endPoint, xScale, yScaleControl));

    svgElement.select("#adjusted")
      .selectAll(".adjustedCLine")
      .data([control])
      .join("path")
      .attr("class", "adjustedCLine")
      .attr("fill", colorMap.control)
      .attr("opacity", ".8")
      .attr("stroke", "none")
      .attr("d", d => getLine(thresholds, d, startPoint, endPoint, xScale, yScaleControl, controlPropensity.map(p => 1/p)));

    svgElement.select("#unadjusted")
      .selectAll(".unadjustedTLine")
      .data([treatment])
      .join("path")
      .attr("class", "unadjustedTLine")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d", d => getLine(thresholds, d, startPoint, endPoint, xScale, yScaleTreatment));

    svgElement.select("#adjusted")
      .selectAll(".adjustedTLine")
      .data([treatment])
      .join("path")
      .attr("class", "adjustedTLine")
      .attr("fill", colorMap.treatment)
      .attr("opacity", ".8")
      .attr("stroke", "none")
      .attr("d", d => getLine(thresholds, d, startPoint, endPoint, xScale, yScaleTreatment, treatmentPropensity.map(p => 1/p)));
    
    svgElement.select("#unadjusted")
      .selectAll(".unadjustedCMeanLine")
      .data([controlMean])
      .join("line")
      .attr("class", "unadjustedCMeanLine")
      .attr("x1", d => xScale(d))
      .attr("x2", d => xScale(d))
      .attr("y1", layout.height / 2)
      .attr("y2", layout.margin)
      .attr("stroke-dasharray", "5 5 2 5")
      .attr("stroke", "black")

    svgElement.select("#unadjusted")
      .selectAll(".unadjustedTMeanLine")
      .data([treatmentMean])
      .join("line")
      .attr("class", "unadjustedTMeanLine")
      .attr("x1", d => xScale(d))
      .attr("x2", d => xScale(d))
      .attr("y1", layout.height / 2)
      .attr("y2", layout.height - layout.margin)
      .attr("stroke-dasharray", "5 5 2 5")
      .attr("stroke", "black")

    svgElement.select("#unadjusted")
      .selectAll(".unadjustedCMean")
      .data([controlMean])
      .join("circle")
      .attr("class", "unadjustedCMean")
      .attr("cx", d => xScale(d))
      .attr("cy", d => yScaleControl(0))
      .attr("r", 3)
      .attr("fill", "white")
      .attr("stroke", "black")

    svgElement.select("#unadjusted")
      .selectAll(".unadjustedTMean")
      .data([treatmentMean])
      .join("circle")
      .attr("class", "unadjustedTMean")
      .attr("cx", d => xScale(d))
      .attr("cy", d => yScaleTreatment(0))
      .attr("r", 3)
      .attr("fill", "white")
      .attr("stroke", "black")

    // let controlBars = svgElement.select("#unadjustedCBars")
    //   .selectAll(".unadjustedCBars")
    //   .data(unadjustedCBins)
    //   .join("rect")
    //   .attr("class", "unadjustedCBars")
    //   .attr("x", (d, i) => xScale(d.x0))
    //   .attr("y", d => yScaleControl(d.length / unadjustedSize))
    //   .attr("width", d => xScale(d.x1) - xScale(d.x0))
    //   .attr("height", d => yScaleControl(0) - yScaleControl(d.length / unadjustedSize))
    //   .attr("fill", "none")
    //   .attr("stroke", "black")

    // let treatmentBars = svgElement.select("#unadjustedTBars")
    //   .selectAll(".unadjustedTBars")
    //   .data(unadjustedTBins)
    //   .join("rect")
    //   .attr("class", "unadjustedTBars")
    //   .attr("x", (d, i) => xScale(d.x0))
    //   .attr("y", d => yScaleTreatment(0))
    //   .attr("width", d => xScale(d.x1) - xScale(d.x0))
    //   .attr("height", d => yScaleTreatment(d.length / unadjustedSize) - yScaleTreatment(0))
    //   .attr("fill", "none")
    //   .attr("stroke", "black")
      // .attr("opacity", "0.35")

    // svgElement.select("#selectionBars")
    //   .selectAll(".selectionBars")
    //   .data(selectionBins)
    //   .join("rect")
    //   .attr("class", "selectionBars")
    //   .attr("x", (d, i) => xScale(d.x0))
    //   .attr("y", d => yScale(d.length / selectionSize))
    //   .attr("width", d => xScale(d.x1) - xScale(d.x0))
    //   .attr("height", d => yScale(0) - yScale(d.length / selectionSize))
    //   .attr("fill", "steelblue")

    svgElement.select('#x-axis')
            .attr('transform', `translate(0, ${layout.height/2})`)
            .call(d3.axisBottom(xScale).tickSize(3).ticks(5))

    svgElement.select('#y-axistreatment')
      .attr('transform', `translate(${layout.marginLeft}, 0)`)
      .call(d3.axisLeft(yScaleTreatment).tickSize(3).ticks(2))

    svgElement.select('#y-axiscontrol')
      .attr('transform', `translate(${layout.marginLeft}, 0)`)
      .call(d3.axisLeft(yScaleControl).tickSize(3).ticks(2))

  }, [unadjustedTBins, unadjustedCBins])

  
  let covStyle = {"display":"flex", "alignItems":"center"};
  let textStyle = {"writingMode":"vertical-rl", "transform":"rotate(-180deg)", "fontFamily":"sans-serif", "fontSize":"11px"};

  return (
    <div style={covStyle}>
      <p style={textStyle}>{refIndex}</p>
      <svg width={layout.width} height={layout.height} ref={ref} id={`svgCompare${refIndex}`}>
        <g>
          <g id="selectionBars" />
          
          <g id="adjusted" />
          <g id="unadjusted" />
          
          <g id="x-axis" />
          <g id="y-axistreatment" />
          <g id="y-axiscontrol" />
        </g>
      </svg>
    </div>
  )
}