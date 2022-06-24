import React, {useRef, useState, useEffect} from 'react'
import * as d3 from 'd3';

import IconButton from '@mui/material/IconButton';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export const CompareHistogramVis = ({layout={"height": 120, "width": 500, "margin": 20, "marginLeft": 20},
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

  const bins = 2;

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
  function getMaxProportion(TBins, CBins, unadjustedCCount, unadjustedTCount, adjustedCCount, adjustedTCount) {
    let currentMax = 0;

    for (let d of TBins) {
      let proportion = d.length / unadjustedTCount;
      let weightedProportion = d3.sum(d, d => d[1]) / adjustedTCount;

      let max = d3.max([proportion, weightedProportion]) 

      if (max > currentMax) {
        currentMax = max;
      }
    }

    for (let d of CBins) {
      let proportion = d.length / unadjustedCCount;
      let weightedProportion = d3.sum(d, d => d[1]) / adjustedCCount;

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

  function handleHide() {
    hideCovariate(attribute);
  }

  useEffect(() => {
    if (unadjustedTreatmentData.length === 0 || unadjustedControlData.length === 0) {
      return;
    }

    let isSelected = selectedAttribute.length > 0;

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
    var selectedBins = histogram(selectedAttribute.map(s => [0, s]));

    // Get mean of unadjusted data
    let unadjustedCMean = d3.mean(unadjustedControlData, d => d[0]);
    let unadjustedTMean = d3.mean(unadjustedTreatmentData, d => d[0]);

    // Get count of unadjusted data
    let unadjustedCCount = unadjustedControlData.length;
    let unadjustedTCount = unadjustedTreatmentData.length;

    let adjustedCMean;
    let adjustedTMean;

    let adjustedCCount;
    let adjustedTCount;

    // If adjusted data set not provided, calculate means and counts using IPW
    if (!adjustedAttribute) {
      adjustedCMean = getWeightedMean(unadjustedControlData);
      adjustedTMean = getWeightedMean(unadjustedTreatmentData);

      adjustedCCount = d3.sum(unadjustedControlData, d => d[1]);
      adjustedTCount = d3.sum(unadjustedTreatmentData, d => d[1]);
    }

    var totalWeight = d3.sum(unadjustedTreatmentData, d => d[1]) + d3.sum(unadjustedControlData, d => d[1]);

    let maxProportion = getMaxProportion(TBins, CBins, unadjustedCCount, unadjustedTCount, adjustedCCount, adjustedTCount);

    const newXScale = d3.scaleLinear()
      .domain([-0.5, 1.5])
      .range([layout.marginLeft, layout.width - layout.margin])

    const newYScaleTreatment = d3.scaleLinear()
      .domain([0, maxProportion])
      .range([layout.height / 2, layout.height - layout.margin])

    const newYScaleControl = d3.scaleLinear()
      .domain([0, maxProportion])
      .range([layout.height / 2, layout.margin])

    setXScale(() => x => newXScale(x));
    setYScaleTreatment(() => y => newYScaleTreatment(y));
    setYScaleControl(() => y => newYScaleControl(y));

    let bandwidth = (layout.width - layout.margin - layout.marginLeft) / 2;

    let unadjustedCBars = svgElement.select("#unadjusted")
      .selectAll(".unadjustedCBars")
      .data(CBins)
      .join("rect")
      .attr("class", "unadjustedCBars")
      .attr("x", (d, i) => newXScale(d.x0) -  bandwidth / 2)
      .attr("y", d => newYScaleControl(d.length / unadjustedCCount))
      .attr("width", d => bandwidth)
      .attr("height", d => newYScaleControl(0) - newYScaleControl(d.length / unadjustedCCount))
      .attr("fill", "none")
      .attr("stroke", "black");

    let unadjustedTBars = svgElement.select("#unadjusted")
      .selectAll(".unadjustedTBars")
      .data(TBins)
      .join("rect")
      .attr("class", "unadjustedTBars")
      .attr("x", (d, i) => newXScale(d.x0) -  bandwidth / 2)
      .attr("y", d => newYScaleTreatment(0))
      .attr("width", bandwidth)
      .attr("height", d => newYScaleTreatment(d.length / unadjustedTCount) - newYScaleTreatment(0))
      .attr("fill", "none")
      .attr("stroke", "black");

    let adjustedCBars = svgElement.select("#adjusted")
      .selectAll(".adjustedCBars")
      .data(CBins)
      .join("rect")
      .attr("class", "adjustedCBars")
      .attr("x", (d, i) => newXScale(d.x0) -  bandwidth / 2)
      .attr("y", d => newYScaleControl(d3.sum(d, v => v[1]) / adjustedCCount))
      .attr("width", bandwidth)
      .attr("height", d => newYScaleControl(0) - newYScaleControl(d3.sum(d, v => v[1]) / adjustedCCount))
      .attr("fill", colorMap.control)
      .attr("stroke", "none");

    let adjustedTBars = svgElement.select("#adjusted")
      .selectAll(".adjustedTBars")
      .data(TBins)
      .join("rect")
      .attr("class", "adjustedTBars")
      .attr("x", (d, i) => newXScale(d.x0) -  bandwidth / 2)
      .attr("y", d => newYScaleTreatment(0))
      .attr("width", bandwidth)
      .attr("height", d => newYScaleTreatment(d3.sum(d, v => v[1]) / adjustedTCount) - newYScaleTreatment(0))
      .attr("fill", colorMap.treatment)
      .attr("stroke", "none");

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
      .attr('stroke-width', 2)
      .attr("stroke-linecap", "round")

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
      .attr("stroke-linecap", "round")

    svgElement.select("#adjustedMean")
      .selectAll(".adjustedCMean")
      .data([adjustedCMean])
      .join("circle")
      .attr("class", "adjustedCMean")
      .attr("cx", d => newXScale(d))
      .attr("cy", d => newYScaleControl(0))
      .attr("r", 3)
      .attr("fill", "black")
      .attr("stroke", "black")

    svgElement.select("#adjustedMean")
      .selectAll(".adjustedTMean")
      .data([adjustedTMean])
      .join("circle")
      .attr("class", "adjustedTMean")
      .attr("cx", d => newXScale(d))
      .attr("cy", d => newYScaleTreatment(0))
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

    svgElement.select('#x-axis')
            .attr('transform', `translate(0, ${layout.height/2})`)
            .call(d3.axisBottom(newXScale).tickSize(3).tickValues([0, 1]).tickFormat(d3.format('.0f')))

    svgElement.select('#y-axistreatment')
      .attr('transform', `translate(${layout.marginLeft}, 0)`)
      .call(d3.axisLeft(newYScaleTreatment).tickSize(3).ticks(2))

    svgElement.select('#y-axiscontrol')
      .attr('transform', `translate(${layout.marginLeft}, 0)`)
      .call(d3.axisLeft(newYScaleControl).tickSize(3).ticks(2))

  }, [unadjustedTreatmentData, unadjustedControlData])

  useEffect(() => {

    var histogram = d3.histogram()
                      .domain([-0.5, 1.5])
                      .thresholds(bins);

    var selectedBins = histogram(selectedAttribute);

    let bandwidth = (layout.width - layout.margin - layout.marginLeft) / 2;

    svgElement.select("#selected")
      .selectAll(".selectedBars")
      .data(selectedBins)
      .join("rect")
      .attr("class", "selectedBars")
      .attr("x", (d, i) => xScale(d.x0) -  bandwidth / 2)
      .attr("y", d => selectedTreatment ? yScaleTreatment(0) : yScaleControl(d.length / unadjustedControlData.length))
      .attr("width", d => bandwidth)
      .attr("height", function (d) {
        if (selectedTreatment) {
          return yScaleTreatment(d.length / unadjustedTreatmentData.length) - yScaleTreatment(0)
        } else {
          return yScaleControl(0) - yScaleControl(d.length / unadjustedControlData.length)
        }
      })
      .attr("fill", "none")
      .attr("stroke", "black");

    let isSelected = selectedAttribute.length > 0;

    if (isSelected) {
      svgElement.select("#unadjusted")
        .selectAll(".unadjustedCBars")
        .attr("opacity", 0.2)

      svgElement.select("#unadjusted")
        .selectAll(".unadjustedTBars")
        .attr("opacity", 0.2)

      svgElement.select("#adjusted")
        .selectAll(".adjustedCBars")
        .attr("opacity", 0.2)

      svgElement.select("#adjusted")
        .selectAll(".adjustedTBars")
        .attr("opacity", 0.2)
    } else {
      svgElement.select("#unadjusted")
        .selectAll(".unadjustedCBars")
        .attr("opacity", 1)

      svgElement.select("#unadjusted")
        .selectAll(".unadjustedTBars")
        .attr("opacity", 1)

      svgElement.select("#adjusted")
        .selectAll(".adjustedCBars")
        .attr("opacity", 1)

      svgElement.select("#adjusted")
        .selectAll(".adjustedTBars")
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