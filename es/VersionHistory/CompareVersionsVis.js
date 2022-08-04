import React, { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
export var CompareVersionsVis = function CompareVersionsVis(_ref) {
  var _ref$layout = _ref.layout,
      layout = _ref$layout === void 0 ? {
    "height": 120,
    "width": 1200,
    "margin": 35,
    "marginLeft": 50,
    "marginBottom": 30
  } : _ref$layout,
      _ref$data = _ref.data,
      data = _ref$data === void 0 ? [] : _ref$data,
      _ref$stratifyBy = _ref.stratifyBy,
      stratifyBy = _ref$stratifyBy === void 0 ? "" : _ref$stratifyBy,
      colorScale = _ref.colorScale;

  var _React$useState = React.useState(data),
      ATE = _React$useState[0],
      setATE = _React$useState[1];

  var _React$useState2 = React.useState(stratifyBy),
      subGroup = _React$useState2[0],
      setSubGroup = _React$useState2[1];

  useEffect(function () {
    setATE(data);
  }, [data]);
  useEffect(function () {
    setSubGroup(stratifyBy);
  }, [stratifyBy]);
  var ref = useRef('svgCompareVersionsVis');
  var svg = d3.select(ref.current);
  var svgElement = svg.select("g");
  useEffect(function () {
    var ATEExtent = d3.extent(ATE, function (d) {
      return d.ATE;
    });
    console.log(ATEExtent);
    var xScale = d3.scaleLinear().domain(d3.extent(ATE, function (d) {
      return d.ATE;
    })).range([layout.marginLeft, layout.width - layout.margin]);
    var yScale;

    if (stratifyBy != "") {
      yScale = d3.scaleOrdinal().domain(d3.extent(ATE, function (d) {
        return d.group;
      })).range([layout.margin + 10, layout.height - layout.margin - 10]);
    }

    if (ATEExtent[0] < 0 && ATEExtent[1] > 0) {
      svgElement.select("#ate").selectAll(".zeroLine").data([0]).join("line").attr("class", "zeroLine").attr("x1", function (d) {
        return xScale(0);
      }).attr("y1", layout.margin).attr("x2", function (d) {
        return xScale(0);
      }).attr("y2", layout.height - layout.margin).attr("stroke", "black").attr("stroke-dasharray", "5 5 2 5");
    }

    var atePoints = svgElement.select("#ate").selectAll(".atePoints").data(ATE).join("circle").attr("class", "atePoints").attr("cx", function (d) {
      return xScale(d.ATE);
    }).attr("cy", function (d) {
      return stratifyBy ? yScale(d.group) : layout.height / 2;
    }).attr("r", 5).attr("fill", function (d) {
      return colorScale(d.DAG);
    }).attr("opacity", "0.48");
    svgElement.select("#x-axis").attr("transform", "translate(0, " + (layout.height - layout.margin + 10) + ")").call(d3.axisBottom(xScale).tickSize(3).ticks(5));
    svgElement.selectAll("#x-axis").selectAll(".axisText").data(["ATE"]).join("text").attr("class", "axisText").attr("transform", "translate(" + (layout.width - layout.margin) + ", " + 25 + ")").attr("font-family", "sans-serif").attr("fill", "black").text(function (d) {
      return d;
    });

    if (yScale) {
      svgElement.select('#y-axis').attr('opacity', 1).attr('transform', "translate(" + (layout.marginLeft - 10) + ", 0)").call(d3.axisLeft(yScale)).call(function (g) {
        return g.select(".domain").remove();
      });
    } else {
      svgElement.select('#y-axis').attr('opacity', 0);
    }
  }, [ATE, subGroup]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("svg", {
    width: layout.width,
    height: layout.height,
    ref: ref,
    id: "svgCompareVersionsVis"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("g", {
    id: "ate"
  }), /*#__PURE__*/React.createElement("g", {
    id: "x-axis"
  }), /*#__PURE__*/React.createElement("g", {
    id: "y-axis"
  }))));
};