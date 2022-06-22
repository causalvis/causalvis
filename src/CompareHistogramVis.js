import React, {useRef, useState, useEffect} from 'react'
import * as d3 from 'd3';

export const CompareHistogramVis = ({layout = {"height": 120, "width": 500, "margin": 20, "marginLeft": 20}, unadjustedAttribute = [], adjustedAttribute, unadjustedTreatment = [], unadjustedPropensity = [], selection = [], attribute = "", updateFilter, selectedAttribute = []}) => {

  const [unadjustedTreatmentData, setUnadjustedTreatmentData] = React.useState([]);
  const [unadjustedControlData, setUnadjustedControlData] = React.useState([]);

  const [selectedBins, setSelectedBins] = React.useState([]);

  const bins = 2;

  // Track color map
  const [colorMap, setColorMap] = React.useState({"treatment": "#4e79a7",
                                                  "outcome": "#f28e2c",
                                                  "control": "#90b0d1"});

  useEffect(() => {

    if (!adjustedAttribute) {
      let treatment = unadjustedAttribute.filter((r, i) => unadjustedTreatment[i] === 1);
      let control = unadjustedAttribute.filter((r, i) => unadjustedTreatment[i] === 0);

      let allPropensity = unadjustedPropensity.map((p, i) => p[unadjustedTreatment[i]]);
      let controlPropensity = allPropensity.filter((r, i) => unadjustedTreatment[i] === 0);
      let treatmentPropensity = allPropensity.filter((r, i) => unadjustedTreatment[i] === 1);

      let controlIPW = controlPropensity.map(p => 1/p);
      let treatmentIPW = treatmentPropensity.map(p => 1/p);

      // Zip attribute values with weight for each data instance
      treatment = treatment.map((t, i) => [t, treatmentIPW[i]]);
      control = control.map((c, i) => [c, controlIPW[i]]);

      setUnadjustedTreatmentData([...treatment]);
      setUnadjustedControlData([...control]);
    }

  }, [unadjustedAttribute])

  let newRef = "svgCompare" + attribute
  
  const ref = useRef("svgCompare");

  let svg = d3.select(ref.current);

  let svgElement = svg.select("g");

  // Get max values for yScale
  function getMaxProportion(TBins, CBins, total, totalWeight) {
    let currentMax = 0;

    for (let d of TBins) {
      let proportion = d.length / total;
      let weightedProportion = d3.sum(d, d => d[1]) / totalWeight;

      let max = d3.max([proportion, weightedProportion]) 

      if (max > currentMax) {
        currentMax = max;
      }
    }

    for (let d of CBins) {
      let proportion = d.length / total;
      let weightedProportion = d3.sum(d, d => d[1]) / totalWeight;

      let max = d3.max([proportion, weightedProportion]) 

      if (max > currentMax) {
        currentMax = max;
      }
    }

    return currentMax;
  }

  // Get weighted mean given data
  function getWeightedMean(xw) {
    let total = 0;
    let totalWeight = 0;

    for (let v of xw) {
      total += v[0] * v[1];
      totalWeight += v[1];
    }

    return total/totalWeight;
  }

  useEffect(() => {
    if (unadjustedTreatmentData.length === 0 || unadjustedControlData.length === 0) {
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

    // Histogram domain has been adjusted to create a pseudo-bandScale()
    // This allows plotting of both categorical histogram + numerical means on the same plot
    var histogram = d3.histogram()
                      .value(d => d[0])
                      .domain([-0.5, 1.5])
                      .thresholds(bins);
    var TBins = histogram(unadjustedTreatmentData);
    var CBins = histogram(unadjustedControlData);

    // Get mean of unadjusted data
    let unadjustedCMean = d3.mean(unadjustedControlData, d => d[0]);
    let unadjustedTMean = d3.mean(unadjustedTreatmentData, d => d[0]);

    let adjustedCMean;
    let adjustedTMean;

    // If adjusted data set not provided, calculate means using IPW and get weighted KDE
    if (!adjustedAttribute) {
      adjustedCMean = getWeightedMean(unadjustedControlData);
      adjustedTMean = getWeightedMean(unadjustedTreatmentData);
    }

    var totalWeight = d3.sum(unadjustedTreatmentData, d => d[1]) + d3.sum(unadjustedControlData, d => d[1]);

    let maxProportion = getMaxProportion(TBins, CBins, unadjustedAttribute.length, totalWeight);

    const xScale = d3.scaleLinear()
      .domain([-0.5, 1.5])
      .range([layout.marginLeft, layout.width - layout.margin])

    const yScaleTreatment = d3.scaleLinear()
      .domain([0, maxProportion])
      .range([layout.height / 2, layout.height - layout.margin])

    const yScaleControl = d3.scaleLinear()
      .domain([0, maxProportion])
      .range([layout.height / 2, layout.margin])

    let bandwidth = (layout.width - layout.margin - layout.marginLeft) / 2

    let unadjustedCBars = svgElement.select("#unadjusted")
      .selectAll(".unadjustedCBars")
      .data(CBins)
      .join("rect")
      .attr("class", "unadjustedCBars")
      .attr("x", (d, i) => xScale(d.x0) -  bandwidth / 2)
      .attr("y", d => yScaleControl(d.length / unadjustedAttribute.length))
      .attr("width", d => bandwidth)
      .attr("height", d => yScaleControl(0) - yScaleControl(d.length / unadjustedAttribute.length))
      .attr("fill", "none")
      .attr("stroke", "black")

    let unadjustedTBars = svgElement.select("#unadjusted")
      .selectAll(".unadjustedTBars")
      .data(TBins)
      .join("rect")
      .attr("class", "unadjustedTBars")
      .attr("x", (d, i) => xScale(d.x0) -  bandwidth / 2)
      .attr("y", d => yScaleTreatment(0))
      .attr("width", bandwidth)
      .attr("height", d => yScaleTreatment(d.length / unadjustedAttribute.length) - yScaleTreatment(0))
      .attr("fill", "none")
      .attr("stroke", "black")

    let adjustedCBars = svgElement.select("#adjusted")
      .selectAll(".udjustedCBars")
      .data(CBins)
      .join("rect")
      .attr("class", "adjustedCBars")
      .attr("x", (d, i) => xScale(d.x0) -  bandwidth / 2)
      .attr("y", d => yScaleControl(d3.sum(d, v => v[1]) / totalWeight))
      .attr("width", bandwidth)
      .attr("height", d => yScaleControl(0) - yScaleControl(d3.sum(d, v => v[1]) / totalWeight))
      .attr("fill", colorMap.control)
      .attr("opacity", ".8")
      .attr("stroke", "none")

    let adjustedTBars = svgElement.select("#adjusted")
      .selectAll(".adjustedTBars")
      .data(TBins)
      .join("rect")
      .attr("class", "adjustedTBars")
      .attr("x", (d, i) => xScale(d.x0) -  bandwidth / 2)
      .attr("y", d => yScaleTreatment(0))
      .attr("width", bandwidth)
      .attr("height", d => yScaleTreatment(d3.sum(d, v => v[1]) / totalWeight) - yScaleTreatment(0))
      .attr("fill", colorMap.treatment)
      .attr("opacity", ".8")
      .attr("stroke", "none")

    // // svgElement.select("#selectionBars")
    // //   .selectAll(".selectionBars")
    // //   .data(selectionBins)
    // //   .join("rect")
    // //   .attr("class", "selectionBars")
    // //   .attr("x", (d, i) => xScale(d.x0))
    // //   .attr("y", d => yScale(d.length / selectionSize))
    // //   .attr("width", d => xScale(d.x1) - xScale(d.x0))
    // //   .attr("height", d => yScale(0) - yScale(d.length / selectionSize))
    // //   .attr("fill", "steelblue")

    // svgElement.select("#selected")
    //   .selectAll(".selectedBars")
    //   .data(selectedBins)
    //   .join("rect")
    //   .attr("class", "selectedBars")
    //   .attr("x", (d, i) => xScale(d.x0))
    //   .attr("y", d => yScaleControl(d.length / unadjustedAttribute.length))
    //   .attr("width", d => xScale(d.x1) - xScale(d.x0))
    //   .attr("height", d => yScaleControl(0) - yScaleControl(d.length / unadjustedAttribute.length))
    //   .attr("fill", "none")
    //   .attr("stroke", "black")

    /*
     *
    Indicate adjusted means
     *
     */
    svgElement.select("#adjustedMean")
      .selectAll(".adjustedCMeanLine")
      .data([adjustedCMean])
      .join("line")
      .attr("class", "adjustedCMeanLine")
      .attr("x1", d => xScale(d))
      .attr("x2", d => xScale(d))
      .attr("y1", layout.height / 2)
      .attr("y2", layout.margin)
      .attr("stroke-dasharray", "5 5 2 5")
      .attr("stroke", "black")

    svgElement.select("#adjustedMean")
      .selectAll(".adjustedTMeanLine")
      .data([adjustedTMean])
      .join("line")
      .attr("class", "adjustedTMeanLine")
      .attr("x1", d => xScale(d))
      .attr("x2", d => xScale(d))
      .attr("y1", layout.height / 2)
      .attr("y2", layout.height - layout.margin)
      .attr("stroke-dasharray", "5 5 2 5")
      .attr("stroke", "black")

    svgElement.select("#adjustedMean")
      .selectAll(".adjustedCMean")
      .data([adjustedCMean])
      .join("circle")
      .attr("class", "adjustedCMean")
      .attr("cx", d => xScale(d))
      .attr("cy", d => yScaleControl(0))
      .attr("r", 3)
      .attr("fill", "black")
      .attr("stroke", "black")

    svgElement.select("#adjustedMean")
      .selectAll(".adjustedTMean")
      .data([adjustedTMean])
      .join("circle")
      .attr("class", "adjustedTMean")
      .attr("cx", d => xScale(d))
      .attr("cy", d => yScaleTreatment(0))
      .attr("r", 3)
      .attr("fill", "black")
      .attr("stroke", "black")
    
    /*
     *
    Indicate unadjusted means
     *
     */
    svgElement.select("#unadjustedMean")
      .selectAll(".unadjustedCMeanLine")
      .data([unadjustedCMean])
      .join("line")
      .attr("class", "unadjustedCMeanLine")
      .attr("x1", d => xScale(d))
      .attr("x2", d => xScale(d))
      .attr("y1", layout.height / 2)
      .attr("y2", layout.margin)
      .attr("stroke-dasharray", "5 5 2 5")
      .attr("stroke", "black")
      .attr("opacity", 0.75)
      .attr("stroke-width", 0.5)

    svgElement.select("#unadjustedMean")
      .selectAll(".unadjustedTMeanLine")
      .data([unadjustedTMean])
      .join("line")
      .attr("class", "unadjustedTMeanLine")
      .attr("x1", d => xScale(d))
      .attr("x2", d => xScale(d))
      .attr("y1", layout.height / 2)
      .attr("y2", layout.height - layout.margin)
      .attr("stroke-dasharray", "5 5 2 5")
      .attr("stroke", "black")
      .attr("opacity", 0.75)
      .attr("stroke-width", 0.5)

    svgElement.select('#x-axis')
            .attr('transform', `translate(0, ${layout.height/2})`)
            .call(d3.axisBottom(xScale).tickSize(3).tickValues([0, 1]))

    svgElement.select('#y-axistreatment')
      .attr('transform', `translate(${layout.marginLeft}, 0)`)
      .call(d3.axisLeft(yScaleTreatment).tickSize(3).ticks(2))

    svgElement.select('#y-axiscontrol')
      .attr('transform', `translate(${layout.marginLeft}, 0)`)
      .call(d3.axisLeft(yScaleControl).tickSize(3).ticks(2))

  }, [unadjustedTreatmentData, unadjustedControlData, selectedBins])

  useEffect(() => {

    var histogram = d3.histogram().domain([d3.min(unadjustedAttribute), d3.max(unadjustedAttribute)]).thresholds(bins);
    var newSelectedBins = histogram(selectedAttribute);

    setSelectedBins(newSelectedBins);
    
  }, [selectedAttribute])

  
  let covStyle = {"display":"flex", "alignItems":"center"};
  let textStyle = {"writingMode":"vertical-rl", "transform":"rotate(-180deg)", "fontFamily":"sans-serif", "fontSize":"11px"};

  return (
    <div style={covStyle}>
      <p style={textStyle}>{attribute}</p>
      <svg width={layout.width} height={layout.height} ref={ref} id={`svgCompare${attribute}`}>
        <g>
          <g id="selectionBars" />
          
          <g id="adjusted" />
          <g id="unadjusted" />
          <g id="unadjustedMean" />
          <g id="adjustedMean" />
          <g id="selected" />
          
          <g id="x-axis" />
          <g id="y-axistreatment" />
          <g id="y-axiscontrol" />
        </g>
      </svg>
    </div>
  )
}