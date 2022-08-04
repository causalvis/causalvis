import React, { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
export var LegendVis = function LegendVis(_ref) {
  var _ref$layout = _ref.layout,
      layout = _ref$layout === void 0 ? {
    "height": 20,
    "width": 600,
    "margin": 20,
    "marginLeft": 20
  } : _ref$layout;
  var ref = useRef('svgLegendVis');
  var svgElement = d3.select(ref.current); // Track color map

  var _React$useState = React.useState({
    "treatment": "#4e79a7",
    "control": "#f28e2b"
  }),
      colorMap = _React$useState[0],
      setColorMap = _React$useState[1];

  var legend = svgElement.select("#legend").selectAll(".legendCircle").data(["treatment", "control"]).join("circle").attr("class", "legendCircle").attr("cx", function (d, i) {
    return layout.width / 2 - 80 + 115 * i;
  }).attr("cy", function (d) {
    return layout.height / 2;
  }).attr("r", 5).attr("fill", function (d) {
    return colorMap[d];
  });
  var legendText = svgElement.select("#legend").selectAll(".legendText").data(["treatment", "control"]).join("text").attr("class", "legendText").attr("x", function (d, i) {
    return layout.width / 2 - 80 + 115 * i + 10;
  }).attr("y", function (d) {
    return layout.height / 2;
  }).attr("fill", function (d) {
    return colorMap[d];
  }).text(function (d) {
    return d;
  }).attr("alignment-baseline", "middle").attr("text-anchor", "start").attr("font-family", "sans-serif").attr("font-size", 12);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("svg", {
    width: layout.width,
    height: layout.height,
    ref: ref,
    id: "svgLegendVis"
  }, /*#__PURE__*/React.createElement("g", {
    id: "legend"
  })));
};