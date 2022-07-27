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
  var component = d3.select(ref.current);
  var svgElement = component.select("svg");

  function partition(data) {
    var root = d3.hierarchy(data).sum(function (d) {
      return d.children ? 0 : 1;
    });
    return d3.partition().size([layout.height, (root.height + 1) * layout.width / 3])(root);
  }

  var root = partition(data);
  var focus = root;
  var selected = focus.data.name;
  var colorScale = d3.scaleOrdinal(d3.quantize(d3.interpolateViridis, data.children.length + 1));
  var rect = svgElement.select("#rect").selectAll("rect").data(root.descendants()).join("rect").attr("transform", function (d) {
    return "translate(" + d.y0 + "," + d.x0 + ")";
  }).attr("width", function (d) {
    return d.y1 - d.y0 - 1;
  }).attr("height", function (d) {
    return rectHeight(d);
  }).attr("fill-opacity", 0.48).attr("fill", function (d) {
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
  }).attr("font-family", "sans-serif").attr("font-size", "10px");
  var selectedTitle = component.select("#selectedTitle").attr("font-family", "sans-serif").attr("font-size", "11px").selectAll("text").data([selected]).join("text").text(function (d) {
    return getTitle(d);
  });

  function getTitle(s) {
    if (s !== "All Versions") {
      return "Showing " + s + ". ";
    } else {
      return "Showing All Versions. ";
    }
  }

  function clicked(event, p) {
    // let hidden = document.getElementById("_hidden");
    // if (hidden) {
    //   hidden.value = p.data.name;
    //   var event = document.createEvent('HTMLEvents');
    //   event.initEvent('input', false, true);
    //   hidden.dispatchEvent(event);
    // }
    focus = focus === p ? p = p.parent : p;
    selected = focus.data.name;
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
    selectedTitle.text(getTitle(selected));
  }

  function rectHeight(d) {
    return d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2);
  }

  function labelVisible(d) {
    return d.y1 <= layout.width && d.y0 >= 0 && d.x1 - d.x0 > 16;
  }

  function handleDownload() {
    console.log('here', focus);
  }

  var titleStyle = {
    "fontFamily": "sans-serif",
    "fontSize": "13px",
    "display": "flex",
    "alignItems": "center"
  };
  var downloadStyle = {
    "color": "steelblue",
    "cursor": "pointer"
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref
  }, /*#__PURE__*/React.createElement("div", {
    style: titleStyle
  }, /*#__PURE__*/React.createElement("p", {
    id: "selectedTitle"
  }), /*#__PURE__*/React.createElement("p", null, "\xA0"), /*#__PURE__*/React.createElement("span", {
    style: downloadStyle,
    onClick: function onClick() {
      return handleDownload();
    }
  }, /*#__PURE__*/React.createElement("u", null, "Download."))), /*#__PURE__*/React.createElement("svg", {
    width: layout.width,
    height: layout.height,
    id: "svgVersionTree"
  }, /*#__PURE__*/React.createElement("g", {
    id: "rect"
  }), /*#__PURE__*/React.createElement("g", {
    id: "text"
  }), /*#__PURE__*/React.createElement("g", {
    id: "tspan"
  })));
};