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

    var tooltip = d3.select("#tooltip").attr("opacity", 0);
    var tooltip_text = tooltip.select("#tooltip_text").attr("text-anchor", "middle").attr("alignment-baseline", "hanging").attr("x", "11").attr("y", "1").style("font-size", "11px").style("font-family", "sans-serif");
    var tooltip_rect = tooltip.select("#tooltip_rect").attr("fill", "white").attr("width", "22").attr("height", "12").attr("x", "0").attr("y", "0");
    var adjustedCircles = svgElement.select("#adjusted").selectAll(".adjustedSMD").data(SMDDataset).join("circle").attr("class", "adjustedSMD").attr("cy", function (d) {
      return yScale(d.covariate) + yScale.bandwidth() / 2;
    }).attr("r", 3).attr("fill", "black").attr("stroke", "black").attr("cx", function (d) {
      return xScale(d.adjusted) ? xScale(d.adjusted) : layout.marginLeft;
    }).attr("cursor", "pointer").on("mouseover", function (e, d) {
      var adj = d.adjusted;
      var cov = d.covariate;
      tooltip.attr("opacity", 1).attr("transform", "translate(" + (xScale(adj) ? xScale(adj) - 11 : layout.marginLeft - 11) + ", " + (yScale(cov) + yScale.bandwidth() / 2 - 15) + ")"); // .attr("x", d => xScale(adj) ? xScale(adj) : layout.marginLeft)
      // .attr("y", d => yScale(cov) + yScale.bandwidth() / 2 - 10)

      tooltip_text.text("" + Math.round(adj * 100) / 100);
    }).on("mouseout", function () {
      tooltip.attr("opacity", 0);
    });
    var unadjustedCircles = svgElement.select("#unadjusted").selectAll(".unadjustedSMD").data(SMDDataset).join("circle").attr("class", "unadjustedSMD").attr("cy", function (d) {
      return yScale(d.covariate) + yScale.bandwidth() / 2;
    }).attr("r", 3).attr("fill", "white").attr("stroke", "black").attr("cx", function (d) {
      return xScale(d.unadjusted) ? xScale(d.unadjusted) : layout.marginLeft;
    }).attr("cursor", "pointer").on("mouseover", function (e, d) {
      var unadj = d.unadjusted;
      var cov = d.covariate;
      tooltip.attr("opacity", 1).attr("transform", "translate(" + (xScale(unadj) ? xScale(unadj) - 11 : layout.marginLeft - 11) + ", " + (yScale(cov) + yScale.bandwidth() / 2 - 15) + ")"); // .attr("x", d => xScale(unadj) ? xScale(unadj) : layout.marginLeft)
      // .attr("y", d => yScale(cov) + yScale.bandwidth() / 2 - 10)

      tooltip_text.text("" + Math.round(unadj * 100) / 100);
    }).on("mouseout", function () {
      tooltip.attr("opacity", 0);
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
    }).attr("y2", layout.height - layout.margin).attr("stroke", "black").attr("stroke-dasharray", "5 5 2 5"); // thresholdLine.transition()
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
  }), /*#__PURE__*/React.createElement("g", {
    id: "tooltip"
  }, /*#__PURE__*/React.createElement("rect", {
    id: "tooltip_rect"
  }), /*#__PURE__*/React.createElement("text", {
    id: "tooltip_text"
  })))));
};