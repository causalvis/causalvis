import React, { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
export var SMDVis = function SMDVis(_ref) {
  var _ref$layout = _ref.layout,
      layout = _ref$layout === void 0 ? {
    "height": 500,
    "width": 600,
    "margin": 50,
    "marginLeft": 150
  } : _ref$layout,
      _ref$SMDDataset = _ref.SMDDataset,
      SMDDataset = _ref$SMDDataset === void 0 ? [] : _ref$SMDDataset,
      _ref$SMDExtent = _ref.SMDExtent,
      SMDExtent = _ref$SMDExtent === void 0 ? [] : _ref$SMDExtent;
  var ref = useRef('svgSMD');
  var transitionDuration = 750;
  var svg = d3.select(ref.current);
  var svgElement = svg.select("g");
  useEffect(function () {
    var xScale = d3.scaleLinear().domain(SMDExtent).range([layout.marginLeft, layout.width - layout.margin]);
    var yScale = d3.scaleBand().domain(SMDDataset.map(function (d) {
      return d.covariate;
    })).range([layout.margin, layout.height - layout.margin]); // Create a tooltip

    var tooltip = d3.select("#tooltip").style("position", "absolute").style("visibility", "hidden").style("font-size", "11px").style("font-family", "sans-serif").style("padding", "3px").style("background", "white");
    var adjustedCircles = svgElement.select("#adjusted").selectAll(".adjustedSMD").data(SMDDataset).join("circle").attr("class", "adjustedSMD").attr("cy", function (d) {
      return yScale(d.covariate) + yScale.bandwidth() / 2;
    }).attr("r", 3).attr("fill", "black").attr("stroke", "black").attr("cx", function (d) {
      return xScale(d.adjusted) ? xScale(d.adjusted) : layout.marginLeft;
    }).attr("cursor", "pointer").on("mouseover", function (e, d) {
      tooltip.style("visibility", "visible").style("left", e.pageX - 10 + "px").style("top", e.pageY - 25 + "px").text("" + Math.round(d.adjusted * 100) / 100);
    }).on("mouseout", function () {
      tooltip.style("visibility", "hidden");
    });
    var unadjustedCircles = svgElement.select("#unadjusted").selectAll(".unadjustedSMD").data(SMDDataset).join("circle").attr("class", "unadjustedSMD").attr("cy", function (d) {
      return yScale(d.covariate) + yScale.bandwidth() / 2;
    }).attr("r", 3).attr("fill", "white").attr("stroke", "black").attr("cx", function (d) {
      return xScale(d.unadjusted) ? xScale(d.unadjusted) : layout.marginLeft;
    }).attr("cursor", "pointer").on("mouseover", function (e, d) {
      tooltip.style("visibility", "visible").style("left", e.pageX - 10 + "px").style("top", e.pageY - 25 + "px").text("" + Math.round(d.unadjusted * 100) / 100);
    }).on("mouseout", function () {
      tooltip.style("visibility", "hidden");
    });
    var diffLine = svgElement.select("#diff").selectAll(".diffLine").data(SMDDataset).join("line").attr("class", "diffLine").attr("y1", function (d) {
      return yScale(d.covariate) + yScale.bandwidth() / 2;
    }).attr("y2", function (d) {
      return yScale(d.covariate) + yScale.bandwidth() / 2;
    }).attr("stroke", "black").attr("stroke-dasharray", "2") // .transition()
    // .duration(transitionDuration)
    // .ease(d3.easeLinear)
    .attr("x1", function (d) {
      return d3.min([xScale(d.unadjusted), xScale(d.adjusted)]);
    }).attr("x2", function (d) {
      return d3.max([xScale(d.unadjusted), xScale(d.adjusted)]);
    });
    var thresholdText = svgElement.select("#threshold").selectAll(".thresholdText").data([0.1]).join("text").attr("class", "thresholdText").attr("x", function (d) {
      return xScale(d) + 5;
    }).attr("y", layout.margin - 20).text(function (d) {
      return d;
    }).attr("font-family", "sans-serif").attr("font-size", 10).attr("alignment-baseline", "hanging");
    var thresholdLine = svgElement.select("#threshold").selectAll(".thresholdLine").data([0.1]).join("line").attr("class", "thresholdLine").attr("x1", function (d) {
      return xScale(d);
    }).attr("y1", layout.margin - 20).attr("x2", function (d) {
      return xScale(d);
    }).attr("y2", layout.height - layout.margin + 20).attr("stroke", "black").attr("stroke-dasharray", "2"); // thresholdLine.transition()
    //   .duration(1000)
    //   .ease(d3.easeLinear)
    //   .attr("x1", d => xScale(d))
    //   .attr("x2", d => xScale(d))
    // thresholdText.transition()
    //   .duration(1000)
    //   .ease(d3.easeLinear)
    //   .attr("x", d => xScale(d) + 5)

    var xAxis = svgElement.select('#x-axis').attr('transform', "translate(0, " + (layout.height - layout.margin) + ")").call(d3.axisBottom(xScale).tickSize(3).ticks(5));
    var yAxis = svgElement.select('#y-axis').attr('transform', "translate(" + layout.marginLeft + ", 0)").call(d3.axisLeft(yScale).tickSize(3).ticks(5)); // adjustedCircles.transition()
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

    svgElement.select("#legend").selectAll(".legend").data(["adjusted", "unadjusted"]).join("circle").attr("class", "legend").attr("cx", function (d, i) {
      return (layout.width - layout.marginLeft - layout.margin) / 2 + layout.marginLeft - 48 + 80 * i;
    }).attr("cy", function (d, i) {
      return layout.margin / 2 - 10;
    }).attr("r", 3).attr("fill", function (d) {
      return d === "adjusted" ? "black" : "white";
    }).attr("stroke", "black");
    svgElement.select("#legend").selectAll(".legendText").data(['adjusted', 'unadjusted']).join("text").attr("class", "legendText").attr("x", function (d, i) {
      return (layout.width - layout.marginLeft - layout.margin) / 2 + layout.marginLeft - 48 + 80 * i + 10;
    }).attr("y", function (d, i) {
      return layout.margin / 2 - 10;
    }).text(function (d) {
      return d;
    }).attr("alignment-baseline", "middle").attr("font-family", "sans-serif").attr("font-size", 12);
    xAxis.transition().duration(transitionDuration).ease(d3.easeLinear).call(d3.axisBottom(xScale).tickSize(3).ticks(5)); // Add plot title
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

    d3.selectAll("#x-axis>.tick>text").each(function (d, i) {
      d3.select(this).style("font-size", "12px");
    });
  }, [SMDDataset]);
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
  }, "Standardized Mean Difference"), /*#__PURE__*/React.createElement("svg", {
    width: layout.width,
    height: layout.height,
    ref: ref,
    id: "svgSMD"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("g", {
    id: "diff"
  }), /*#__PURE__*/React.createElement("g", {
    id: "threshold"
  }), /*#__PURE__*/React.createElement("g", {
    id: "unadjusted"
  }), /*#__PURE__*/React.createElement("g", {
    id: "adjusted"
  }), /*#__PURE__*/React.createElement("g", {
    id: "x-axis"
  }), /*#__PURE__*/React.createElement("g", {
    id: "y-axis"
  }), /*#__PURE__*/React.createElement("g", {
    id: "legend"
  }), /*#__PURE__*/React.createElement("g", {
    id: "title"
  }))), /*#__PURE__*/React.createElement("div", {
    id: "tooltip"
  }));
};