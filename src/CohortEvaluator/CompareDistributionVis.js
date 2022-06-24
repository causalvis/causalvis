import React, {useRef, useState, useEffect} from 'react'
import * as d3 from 'd3';

import IconButton from '@mui/material/IconButton';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export const CompareDistributionVis = ({layout={"height": 120, "width": 500, "margin": 20, "marginLeft": 20},
                                        unadjustedAttribute=[],
                                        adjustedAttribute,
                                        unadjustedTreatment=[],
                                        unadjustedPropensity=[],
                                        attribute="",
                                        updateFilter,
                                        selectedAttribute=[],
                                        selectedTreatment=false,
                                        hideCovariate}) => {

  const [unadjustedTreatmentData, setUnadjustedTreatmentData] = React.useState([]);
  const [unadjustedControlData, setUnadjustedControlData] = React.useState([]);

  const [xScale, setXScale] = React.useState(() => x => x);
  const [yScaleTreatment, setYScaleTreatment] = React.useState(() => y => y);
  const [yScaleControl, setYScaleControl] = React.useState(() => y => y);

  const [iconShow, setIconShow] = React.useState(false);

  // const [selectedBins, setSelectedBins] = React.useState([]);

  const bins = 30;

  // Track color map
  const [colorMap, setColorMap] = React.useState({"treatment": "#6c8496",
                                                  "outcome": "#f28e2c",
                                                  "control": "#a1c5c0"});

  // Show icon on hover
  function show(el) {
    setIconShow(true);
  }

  // Hide icon
  function hide(el) {
    setIconShow(false);
  }

  useEffect(() => {

    let treatment = unadjustedAttribute.filter((r, i) => unadjustedTreatment[i] === 1);
    let control = unadjustedAttribute.filter((r, i) => unadjustedTreatment[i] === 0);

    setUnadjustedTreatmentData([...treatment]);
    setUnadjustedControlData([...control]);

  }, [unadjustedAttribute])

  let newRef = "svgCompare" + attribute
  
  const ref = useRef("svgCompare");

  let svg = d3.select(ref.current);

  let svgElement = svg.select("g");

  // The following function is modified from https://observablehq.com/@d3/kernel-density-estimation
  function kdeWeighted(kernel, thresholds, data, weights) {
    let density = [];

    if (weights) {
      for (let t of thresholds) {
        let tValues = data.map(d => kernel(t - d));

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
      }
      
    } else {
      density = thresholds.map(t => [t, d3.mean(data, d => kernel(t - d))]);
    }

    return density
  }

  // The following function used as-is from https://observablehq.com/@d3/kernel-density-estimation
  function epanechnikov(bandwidth) {
    return x => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;
  }

  function getIQR(array) {
    array.sort((a, b)  => a - b);

    var q1 = array[Math.floor((array.length / 4))];
    var q3 = array[Math.ceil((array.length * (3 / 4)))];

    return q3 - q1;
  }

  // The following function from https://stackoverflow.com/questions/7343890/standard-deviation-javascript
  function getStandardDeviation (array) {
    const n = array.length
    const mean = array.reduce((a, b) => a + b) / n
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
  }

  // Return svg path given data
  function getLine(thresholds, d, startPoint, endPoint, xScale, yScale, weights) {
    let std = getStandardDeviation(d);
    // let IQRDivided = getIQR(d) / 1.34;
    // let b = 0.9 * d3.min([std, IQRDivided]) * d.length ** (-1/5);
    // let b = std * 1.06 * d.length ** (-1/5)
    // console.log(std, b);

    let b = (thresholds[1] - thresholds[0]) * 3.5
    let density = kdeWeighted(epanechnikov(b), thresholds, d, weights);

    density = [startPoint].concat(density).concat([endPoint]);

    let line = d3.line()
      .curve(d3.curveBasis)
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]));

    return line(density);
  }

  // Get weighted mean of data
  function getWeightedMean(x, w) {
    let total = 0;
    let totalWeight = 0;

    for (let i = 0; i < x.length; i++) {
      let xValue = x[i];
      let wValue = w[i];

      total += xValue * wValue;
      totalWeight += wValue;
    }

    return total/totalWeight;
  }

  function handleHide() {
    hideCovariate(attribute);
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

    // Unfortunately, binning seems to be the most effective way of estimating the max values of the yScale
    var histogram = d3.histogram().domain([d3.min(unadjustedAttribute), d3.max(unadjustedAttribute)]).thresholds(bins);
    var TBins = histogram(unadjustedTreatmentData);
    var CBins = histogram(unadjustedControlData);

    let maxProportion = d3.max([d3.max(TBins.map(d => d.length)) / unadjustedTreatmentData.length, d3.max(CBins.map(d => d.length)) / unadjustedControlData.length]);
    // let maxProportion = 1;

    const newXScale = d3.scaleLinear()
      .domain([d3.min(unadjustedAttribute), d3.max(unadjustedAttribute)])
      .range([layout.marginLeft, layout.width - layout.margin]);

    const newYScaleTreatment = d3.scaleLinear()
      .domain([0, maxProportion])
      .range([layout.height / 2, layout.height - layout.margin]);

    const newYScaleControl = d3.scaleLinear()
      .domain([0, maxProportion])
      .range([layout.height / 2, layout.margin]);

    setXScale(() => x => newXScale(x));
    setYScaleTreatment(() => y => newYScaleTreatment(y));
    setYScaleControl(() => y => newYScaleControl(y));

    let thresholds = newXScale.ticks(bins/2);

    let startPoint = [d3.min(unadjustedAttribute), 0];
    let endPoint = [d3.max(unadjustedAttribute), 0];

    // Get KDE of unadjusted data
    let unadjustedCLine = getLine(thresholds, unadjustedControlData, startPoint, endPoint, newXScale, newYScaleControl);
    let unadjustedTLine = getLine(thresholds, unadjustedTreatmentData, startPoint, endPoint, newXScale, newYScaleTreatment);

    // Get mean of unadjusted data
    let unadjustedCMean = d3.mean(unadjustedControlData);
    let unadjustedTMean = d3.mean(unadjustedTreatmentData);

    let adjustedCLine;
    let adjustedTLine;

    let adjustedCMean;
    let adjustedTMean;

    // If adjusted data set not provided, calculate adjustment using IPW and get weighted KDE
    if (!adjustedAttribute) {
      let allPropensity = unadjustedPropensity.map((p, i) => p[unadjustedTreatment[i]]);
      let controlPropensity = allPropensity.filter((r, i) => unadjustedTreatment[i] === 0);
      let treatmentPropensity = allPropensity.filter((r, i) => unadjustedTreatment[i] === 1);

      let controlIPW = controlPropensity.map(p => 1/p);
      let treatmentIPW = treatmentPropensity.map(p => 1/p);

      adjustedCLine = getLine(thresholds, unadjustedControlData, startPoint, endPoint, newXScale, newYScaleControl, controlIPW);
      adjustedTLine = getLine(thresholds, unadjustedTreatmentData, startPoint, endPoint, newXScale, newYScaleTreatment, treatmentIPW);

      adjustedCMean = getWeightedMean(unadjustedControlData, controlIPW);
      adjustedTMean = getWeightedMean(unadjustedTreatmentData, treatmentIPW);
    }

    svgElement.select("#unadjusted")
      .selectAll(".unadjustedCLine")
      .data([unadjustedCLine])
      .join("path")
      .attr("class", "unadjustedCLine")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d", d => d);

    svgElement.select("#adjusted")
      .selectAll(".adjustedCLine")
      .data([adjustedCLine])
      .join("path")
      .attr("class", "adjustedCLine")
      .attr("fill", colorMap.control)
      .attr("stroke", "none")
      .attr("d", d => d);

    svgElement.select("#unadjusted")
      .selectAll(".unadjustedTLine")
      .data([unadjustedTLine])
      .join("path")
      .attr("class", "unadjustedTLine")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d", d => d);

    svgElement.select("#adjusted")
      .selectAll(".adjustedTLine")
      .data([adjustedTLine])
      .join("path")
      .attr("class", "adjustedTLine")
      .attr("fill", colorMap.treatment)
      .attr("stroke", "none")
      .attr("d", d => d);

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
      .attr("x1", d => newXScale(d))
      .attr("x2", d => newXScale(d))
      .attr("y1", layout.height / 2)
      .attr("y2", layout.margin - 10)
      .attr("stroke-dasharray", "5 5 2 5")
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("stroke-linecap", "round");

    svgElement.select("#adjustedMean")
      .selectAll(".adjustedTMeanLine")
      .data([adjustedTMean])
      .join("line")
      .attr("class", "adjustedTMeanLine")
      .attr("x1", d => newXScale(d))
      .attr("x2", d => newXScale(d))
      .attr("y1", layout.height / 2)
      .attr("y2", layout.height - layout.margin + 10)
      .attr("stroke-dasharray", "5 5 2 5")
      .attr("stroke", "black")
      .attr('stroke-width', 2)
      .attr("stroke-linecap", "round");

    svgElement.select("#adjustedMean")
      .selectAll(".adjustedCMean")
      .data([adjustedCMean])
      .join("circle")
      .attr("class", "adjustedCMean")
      .attr("cx", d => newXScale(d))
      .attr("cy", d => newYScaleControl(0))
      .attr("r", 3)
      .attr("fill", "black")
      .attr("stroke", "black");

    svgElement.select("#adjustedMean")
      .selectAll(".adjustedTMean")
      .data([adjustedTMean])
      .join("circle")
      .attr("class", "adjustedTMean")
      .attr("cx", d => newXScale(d))
      .attr("cy", d => newYScaleTreatment(0))
      .attr("r", 3)
      .attr("fill", "black")
      .attr("stroke", "black");
    
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
      .attr("x1", d => newXScale(d))
      .attr("x2", d => newXScale(d))
      .attr("y1", layout.height / 2)
      .attr("y2", layout.margin - 10)
      .attr("stroke-dasharray", "5 5 2 5")
      .attr("stroke", "black")
      .attr("opacity", 0.75)
      .attr("stroke-width", 1)

    svgElement.select("#unadjustedMean")
      .selectAll(".unadjustedTMeanLine")
      .data([unadjustedTMean])
      .join("line")
      .attr("class", "unadjustedTMeanLine")
      .attr("x1", d => newXScale(d))
      .attr("x2", d => newXScale(d))
      .attr("y1", layout.height / 2)
      .attr("y2", layout.height - layout.margin + 10)
      .attr("stroke-dasharray", "5 5 2 5")
      .attr("stroke", "black")
      .attr("opacity", 0.75)
      .attr("stroke-width", 1)

    // let bandwidth = (layout.width - layout.margin * 2) / bins

    // let unadjustedCBars = svgElement.select("#unadjusted")
    //   .selectAll(".unadjustedCBars")
    //   .data(CBins)
    //   .join("rect")
    //   .attr("class", "unadjustedCBars")
    //   .attr("x", (d, i) => newXScale(d.x0))
    //   .attr("y", d => newYScaleControl(d.length / unadjustedControlData.length))
    //   .attr("width", d => newXScale(d.x1) - newXScale(d.x0))
    //   .attr("height", d => newYScaleControl(0) - newYScaleControl(d.length / unadjustedControlData.length))
    //   .attr("fill", "none")
    //   .attr("stroke", "black");

    // let unadjustedTBars = svgElement.select("#unadjusted")
    //   .selectAll(".unadjustedTBars")
    //   .data(TBins)
    //   .join("rect")
    //   .attr("class", "unadjustedTBars")
    //   .attr("x", (d, i) => newXScale(d.x0))
    //   .attr("y", d => newYScaleTreatment(0))
    //   .attr("width", d => newXScale(d.x1) - newXScale(d.x0))
    //   .attr("height", d => newYScaleTreatment(d.length / unadjustedTreatmentData.length) - newYScaleTreatment(0))
    //   .attr("fill", "none")
    //   .attr("stroke", "black");

    // svgElement.select("#unadjustedMean")
    //   .selectAll(".unadjustedCMean")
    //   .data([unadjustedCMean])
    //   .join("circle")
    //   .attr("class", "unadjustedCMean")
    //   .attr("cx", d => xScale(d))
    //   .attr("cy", d => yScaleControl(0))
    //   .attr("r", 3)
    //   .attr("fill", "white")
    //   .attr("stroke", "black")

    // svgElement.select("#unadjustedMean")
    //   .selectAll(".unadjustedTMean")
    //   .data([unadjustedTMean])
    //   .join("circle")
    //   .attr("class", "unadjustedTMean")
    //   .attr("cx", d => xScale(d))
    //   .attr("cy", d => yScaleTreatment(0))
    //   .attr("r", 3)
    //   .attr("fill", "white")
    //   .attr("stroke", "black")

    svgElement.select('#x-axis')
            .attr('transform', `translate(0, ${layout.height/2})`)
            .call(d3.axisBottom(newXScale).tickSize(3).ticks(5))

    svgElement.select('#y-axistreatment')
      .attr('transform', `translate(${layout.marginLeft}, 0)`)
      .call(d3.axisLeft(newYScaleTreatment).tickSize(3).ticks(2))

    svgElement.select('#y-axiscontrol')
      .attr('transform', `translate(${layout.marginLeft}, 0)`)
      .call(d3.axisLeft(newYScaleControl).tickSize(3).ticks(2))

  }, [unadjustedTreatmentData, unadjustedControlData])

  useEffect(() => {

    var histogram = d3.histogram()
                      .domain([d3.min(unadjustedAttribute), d3.max(unadjustedAttribute)])
                      .thresholds(bins);
    var selectedBins = histogram(selectedAttribute);

    let unadjustedCCount = unadjustedControlData.length === 0 ? 1 : unadjustedControlData.length;
    let unadjustedTCount = unadjustedTreatmentData.length === 0 ? 1 : unadjustedTreatmentData.length;

    /*
     *
    Indicate selected items
     *
     */
    svgElement.select("#selected")
      .selectAll(".selectedBars")
      .data(selectedBins)
      .join("rect")
      .attr("class", "selectedBars")
      .attr("x", (d, i) => xScale(d.x0))
      .attr("y", d => selectedTreatment ? yScaleTreatment(0) : yScaleControl(d.length / unadjustedCCount))
      .attr("width", d => xScale(d.x1) - xScale(d.x0))
      .attr("height", d => selectedTreatment ? yScaleTreatment(d.length / unadjustedTCount) - yScaleTreatment(0) : yScaleControl(0) - yScaleControl(d.length / unadjustedCCount))
      .attr("fill", "none")
      .attr("stroke", "black")

    let isSelected = selectedAttribute.length > 0;

    if (isSelected) {
      svgElement.select("#unadjusted")
        .selectAll(".unadjustedCLine")
        .attr("opacity", 0.2)

      svgElement.select("#unadjusted")
        .selectAll(".unadjustedTLine")
        .attr("opacity", 0.2)

      svgElement.select("#adjusted")
        .selectAll(".adjustedCLine")
        .attr("opacity", 0.2)

      svgElement.select("#adjusted")
        .selectAll(".adjustedTLine")
        .attr("opacity", 0.2)
    } else {
      svgElement.select("#unadjusted")
        .selectAll(".unadjustedCLine")
        .attr("opacity", 1)

      svgElement.select("#unadjusted")
        .selectAll(".unadjustedTLine")
        .attr("opacity", 1)

      svgElement.select("#adjusted")
        .selectAll(".adjustedCLine")
        .attr("opacity", 1)

      svgElement.select("#adjusted")
        .selectAll(".adjustedTLine")
        .attr("opacity", 1)
    }
    
  }, [selectedAttribute])

  let iconStyle = {"opacity": iconShow ? 1 : 0, "cursor":"pointer"};
  let covStyle = {"display":"flex", "alignItems":"center"};
  let textStyle = {"writingMode":"vertical-rl", "transform":"rotate(-180deg)", "fontFamily":"sans-serif", "fontSize":"11px"};

  return (
    <div style={covStyle} onMouseOver={(e) => show(e.target)} onMouseOut={(e) => hide(e.target)}>
      <IconButton style={iconStyle} onClick={() => handleHide()} aria-label="delete">
        <VisibilityOffIcon />
      </IconButton>
      <p style={textStyle}>{attribute}</p>
      <svg width={layout.width} height={layout.height} ref={ref} id={`svgCompare${attribute}`}>
        <g>
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