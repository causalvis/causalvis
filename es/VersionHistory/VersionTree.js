import React, { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3'; // This visualization is modified from https://observablehq.com/@d3/zoomable-icicle

export var VersionTree = function VersionTree(_ref) {
  var _ref$layout = _ref.layout,
      layout = _ref$layout === void 0 ? {
    "height": 120,
    "width": 1200,
    "margin": 30,
    "marginLeft": 10,
    "marginBottom": 30
  } : _ref$layout,
      _ref$data = _ref.data,
      data = _ref$data === void 0 ? {
    "children": [],
    "name": "All Versions"
  } : _ref$data;
  var ref = useRef('svgVersionTree');
  var svgElement = d3.select(ref.current);

  function partition(data) {
    var root = d3.hierarchy(data).sum(function (d) {
      return d.children ? 0 : 1;
    });
    return d3.partition().size([layout.height, (root.height + 1) * layout.width / 3])(root);
  }

  var root = partition(data);
  var focus = root;
  var colorScale = d3.scaleOrdinal(d3.quantize(d3.interpolateViridis, data.children.length + 1));
  var rect = svgElement.select("#rect").selectAll("rect").data(root.descendants()).join("rect").attr("transform", function (d) {
    return "translate(" + d.y0 + "," + d.x0 + ")";
  }).attr("width", function (d) {
    return d.y1 - d.y0 - 1;
  }).attr("height", function (d) {
    return rectHeight(d);
  }).attr("fill-opacity", 0.6).attr("fill", function (d) {
    if (!d.depth) return "#ccc";

    while (d.depth > 1) {
      d = d.parent;
    }

    return colorScale(d.data.name);
  }).style("cursor", "pointer").on("click", clicked); // const rect = cell.append("rect")
  //     .attr("width", d => d.y1 - d.y0 - 1)
  //     .attr("height", d => rectHeight(d))
  //     .attr("fill-opacity", 0.6)
  //     .attr("fill", d => {
  //       if (!d.depth) return "#ccc";
  //       while (d.depth > 1) d = d.parent;
  //       return colorScale(d.data.name);
  //     })
  //     .style("cursor", "pointer")
  //     .on("click", clicked);

  var text = svgElement.select("#text").selectAll("text").data(root.descendants()).join("text").attr("transform", function (d) {
    return "translate(" + d.y0 + "," + d.x0 + ")";
  }).style("user-select", "none").attr("pointer-events", "none").attr("x", 5).attr("y", 12).attr("fill-opacity", function (d) {
    return +labelVisible(d);
  }).text(function (d) {
    return d.data.name;
  }).attr("font-family", "sans-serif").attr("font-size", "10px");
  var tspan = svgElement.select("#tspan").selectAll("tspan").data(root.descendants()).join("tspan").attr("transform", function (d) {
    return "translate(" + d.y0 + "," + d.x0 + ")";
  }).text(function (d) {
    return d.data.name;
  }).attr("font-family", "sans-serif").attr("font-size", "10px"); // svgElement.selectAll(".title")
  //     .data(root.descendants())
  //     .join("title")
  //     .attr("transform", d => `translate(${d.y0},${d.x0})`)
  //     .attr("class", "title")
  //     .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}`);

  function clicked(event, p) {
    var hidden = document.getElementById("_hidden");

    if (hidden) {
      hidden.value = p.data.name;
      var event = document.createEvent('HTMLEvents');
      event.initEvent('input', false, true);
      hidden.dispatchEvent(event);
    }

    focus = focus === p ? p = p.parent : p;
    root.each(function (d) {
      return d.target = {
        x0: (d.x0 - p.x0) / (p.x1 - p.x0) * layout.height,
        x1: (d.x1 - p.x0) / (p.x1 - p.x0) * layout.height,
        y0: d.y0 - p.y0,
        y1: d.y1 - p.y0
      };
    });
    var tr = rect.transition().duration(750).attr("transform", function (d) {
      return "translate(" + d.target.y0 + "," + d.target.x0 + ")";
    });
    var tt = text.transition().duration(750).attr("transform", function (d) {
      return "translate(" + d.target.y0 + "," + d.target.x0 + ")";
    });
    var ts = tspan.transition().duration(750).attr("transform", function (d) {
      return "translate(" + d.target.y0 + "," + d.target.x0 + ")";
    });
    rect.transition(tr).attr("height", function (d) {
      return rectHeight(d.target);
    });
    text.transition(tt).attr("fill-opacity", function (d) {
      return +labelVisible(d.target);
    });
    tspan.transition(ts).attr("fill-opacity", function (d) {
      return labelVisible(d.target) * 0.7;
    });
  }

  function rectHeight(d) {
    return d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2);
  }

  function labelVisible(d) {
    return d.y1 <= layout.width && d.y0 >= 0 && d.x1 - d.x0 > 16;
  }

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("svg", {
    width: layout.width,
    height: layout.height,
    ref: ref,
    id: "svgVersionTree"
  }, /*#__PURE__*/React.createElement("g", {
    id: "rect"
  }), /*#__PURE__*/React.createElement("g", {
    id: "text"
  }), /*#__PURE__*/React.createElement("g", {
    id: "tspan"
  })));
};