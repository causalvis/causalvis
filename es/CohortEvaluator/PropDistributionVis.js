import React, { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
export var PropDistributionVis = function PropDistributionVis(_ref) {
  var _ref$layout = _ref.layout,
    layout = _ref$layout === void 0 ? {
      "height": 500,
      "width": 500,
      "margin": 50,
      "marginLeft": 50
    } : _ref$layout,
    _ref$bins = _ref.bins,
    bins = _ref$bins === void 0 ? {} : _ref$bins,
    _ref$n = _ref.n,
    n = _ref$n === void 0 ? {} : _ref$n,
    _ref$maxPropensity = _ref.maxPropensity,
    maxPropensity = _ref$maxPropensity === void 0 ? 1 : _ref$maxPropensity,
    setSelectRange = _ref.setSelectRange;
  // Track color map
  var _React$useState = React.useState({
      "treatment": "#bf99ba",
      "outcome": "#f28e2c",
      "control": "#a5c8d4"
    }),
    colorMap = _React$useState[0],
    setColorMap = _React$useState[1];

  // Track previous bar heights
  var _React$useState2 = React.useState(null),
    prevCBins = _React$useState2[0],
    setPrevCBins = _React$useState2[1];
  var _React$useState3 = React.useState(null),
    prevTBins = _React$useState3[0],
    setPrevTBins = _React$useState3[1];
  var ref = useRef('svgPropDistribution');
  var transitionDuration = 1000;
  var svg = d3.select(ref.current);
  var svgElement = svg.select("g");
  useEffect(function () {
    var newCBins = [];
    var newTBins = [];
    var xScale = d3.scaleLinear().domain([0, maxPropensity]).range([layout.marginLeft, layout.width - layout.margin]);
    var controlCount = n.CBins;
    var treatmentCount = n.TBins;
    var yMax = d3.max([d3.max(bins.TBins.map(function (d) {
      return d.length;
    })) / treatmentCount, d3.max(bins.CBins.map(function (d) {
      return d.length;
    })) / controlCount]);

    // Some hardcoding to ensure proper scaling on initialization;
    if (yMax === 0) {
      yMax = 1;
    }
    ;
    var yScaleTreatment = d3.scaleLinear().domain([0, yMax]).range([layout.height / 2, layout.height - layout.margin]);
    var yScaleControl = d3.scaleLinear().domain([0, yMax]).range([layout.height / 2, layout.margin]);
    function onBrush(e) {
      // let brushSelection = e.selection;
      // console.log(brushSelection[1], xScale.invert(brushSelection[1]));
    }
    function brushEnd(e) {
      var brushSelection = e.selection;
      var brushExtent;
      if (brushSelection) {
        brushExtent = [xScale.invert(brushSelection[0]), xScale.invert(brushSelection[1])];
        setSelectRange(brushExtent);
      } else {
        brushExtent = null;
        setSelectRange(null);
      }
    }
    var brush = d3.brushX().extent([[layout.marginLeft, layout.margin], [layout.width - layout.margin, layout.height - layout.margin, layout.margin]]).on("end", function (e) {
      return brushEnd(e);
    });
    svgElement.call(brush);
    var controlBars = svgElement.select("#bars").selectAll(".controlBars").data(bins.CBins).join("rect").attr("class", "controlBars").attr("x", function (d, i) {
      return xScale(d.x0);
    }).attr("y", function (d, i) {
      return prevCBins[i] ? prevCBins[i].y : yScaleControl(0);
    }).attr("width", function (d) {
      return xScale(d.x1) - xScale(d.x0) - 1;
    }).attr("height", function (d, i) {
      return prevCBins[i] ? prevCBins[i].height : 0;
    }).attr("fill", colorMap.control).attr("cursor", "pointer").on("click", function (e, d) {
      if (d3.select(this).attr("opacity") === "1") {
        controlBars.attr("opacity", null);
        treatmentBars.attr("opacity", null);
      } else {
        controlBars.attr("opacity", 0.5);
        treatmentBars.attr("opacity", 0.5);
        d3.select(this).attr("opacity", 1);
      }
    });
    controlBars.transition().duration(transitionDuration).ease(d3.easeLinear).attr("y", function (d, i) {
      newCBins[i] = {
        "y": yScaleControl(d.length / controlCount)
      };
      return yScaleControl(d.length / controlCount);
    }).attr("height", function (d, i) {
      newCBins[i].height = yScaleControl(0) - yScaleControl(d.length / controlCount);
      return yScaleControl(0) - yScaleControl(d.length / controlCount);
    });
    var treatmentBars = svgElement.select("#bars").selectAll(".treatmentBars").data(bins.TBins).join("rect").attr("class", "treatmentBars").attr("x", function (d, i) {
      return xScale(d.x0);
    }).attr("y", function (d, i) {
      return yScaleTreatment(0);
    }).attr("width", function (d) {
      return xScale(d.x1) - xScale(d.x0) - 1;
    }).attr("height", function (d, i) {
      return prevTBins[i] ? prevTBins[i].height : 0;
    }).attr("fill", colorMap.treatment).attr("cursor", "pointer").on("click", function (e, d) {
      if (d3.select(this).attr("opacity") === "1") {
        controlBars.attr("opacity", null);
        treatmentBars.attr("opacity", null);
      } else {
        controlBars.attr("opacity", 0.5);
        treatmentBars.attr("opacity", 0.5);
        d3.select(this).attr("opacity", 1);
      }
    });
    treatmentBars.transition().duration(transitionDuration).ease(d3.easeLinear).attr("height", function (d, i) {
      newTBins[i] = {
        "height": yScaleTreatment(d.length / treatmentCount) - yScaleTreatment(0)
      };
      return yScaleTreatment(d.length / treatmentCount) - yScaleTreatment(0);
    });
    var xAxis = svgElement.select('#x-axis').attr('transform', "translate(0, " + (layout.height - layout.margin) + ")").call(d3.axisBottom(xScale).tickSize(3).ticks(5));
    var yAxisTreatment = svgElement.select('#y-axistreatment').attr('transform', "translate(" + layout.marginLeft + ", 0)").call(d3.axisLeft(yScaleTreatment).tickSize(3).ticks(3));
    var yAxisControl = svgElement.select('#y-axiscontrol').attr('transform', "translate(" + layout.marginLeft + ", 0)").call(d3.axisLeft(yScaleControl).tickSize(3).ticks(3));
    svgElement.select("#zero").selectAll(".zeroLine").data([0]).join("line").attr("class", "zeroLine").attr("y1", function (d) {
      return yScaleTreatment(0);
    }).attr("x1", layout.marginLeft).attr("y2", function (d) {
      return yScaleTreatment(0);
    }).attr("x2", layout.width - layout.margin).attr("stroke", "black").attr("stroke-dasharray", "5 5 2 5");
    svgElement.select("#legend").selectAll(".legend").data(["control", "treatment"]).join("rect").attr("class", "legend").attr("x", function (d, i) {
      return layout.width / 2 - 55 + 80 * i;
    }).attr("y", function (d, i) {
      return layout.margin / 2 - 16;
    }).attr("width", 12).attr("height", 12).attr("fill", function (d) {
      return colorMap[d];
    });
    svgElement.select("#legend").selectAll(".legendText").data(["control", "treatment"]).join("text").attr("class", "legendText").attr("x", function (d, i) {
      return layout.width / 2 - 55 + 80 * i + 18;
    }).attr("y", function (d, i) {
      return layout.margin / 2 - 10;
    }).attr("alignment-baseline", "middle").attr("text-anchor", "start").attr("fill", function (d) {
      return colorMap[d];
    }).attr("font-family", "sans-serif").attr("font-size", "12px").text(function (d) {
      return d;
    });
    xAxis.transition().duration(1000).ease(d3.easeLinear).call(d3.axisBottom(xScale).tickSize(3).ticks(5));
    yAxisTreatment.transition().duration(1000).ease(d3.easeLinear).call(d3.axisLeft(yScaleTreatment).tickSize(3).ticks(3));
    yAxisControl.transition().duration(1000).ease(d3.easeLinear).call(d3.axisLeft(yScaleControl).tickSize(3).ticks(3));
    d3.selectAll("#x-axis>.tick>text").each(function (d, i) {
      d3.select(this).style("font-size", "12px");
    });
    d3.selectAll("#y-axistreatment>.tick>text").each(function (d, i) {
      d3.select(this).style("font-size", "12px");
    });
    d3.selectAll("#y-axiscontrol>.tick>text").each(function (d, i) {
      d3.select(this).style("font-size", "12px");
    });
    setPrevCBins([].concat(newCBins));
    setPrevTBins([].concat(newTBins));
  }, [bins]);
  var containerStyle = {
    "display": "flex",
    "flexDirection": "column",
    "alignItems": "center"
  };
  var titleStyle = {
    "marginLeft": layout.marginLeft,
    "fontFamily": "sans-serif",
    "fontSize": "15px"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: containerStyle
  }, /*#__PURE__*/React.createElement("p", {
    style: titleStyle
  }, "Propensity Score Distribution Plot"), /*#__PURE__*/React.createElement("svg", {
    width: layout.width,
    height: layout.height,
    ref: ref,
    id: "svgPropDistribution"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("g", {
    id: "bars"
  }), /*#__PURE__*/React.createElement("g", {
    id: "x-axis"
  }), /*#__PURE__*/React.createElement("g", {
    id: "y-axistreatment"
  }), /*#__PURE__*/React.createElement("g", {
    id: "y-axiscontrol"
  }), /*#__PURE__*/React.createElement("g", {
    id: "legend"
  }), /*#__PURE__*/React.createElement("g", {
    id: "title"
  }), /*#__PURE__*/React.createElement("g", {
    id: "zero"
  }))));
};