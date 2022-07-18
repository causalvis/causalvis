function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import React, { useRef, useState, useEffect } from 'react';
import regression from 'regression';
import * as d3 from 'd3';
export var TreatmentEffectVisViolin = function TreatmentEffectVisViolin(_ref) {
  var _ref$allData = _ref.allData,
      allData = _ref$allData === void 0 ? {} : _ref$allData,
      _ref$index = _ref.index,
      index = _ref$index === void 0 ? 0 : _ref$index,
      _ref$treatment = _ref.treatment,
      treatment = _ref$treatment === void 0 ? "treatment" : _ref$treatment,
      _ref$outcome = _ref.outcome,
      outcome = _ref$outcome === void 0 ? "outcome" : _ref$outcome,
      _ref$effect = _ref.effect,
      effect = _ref$effect === void 0 ? "effect" : _ref$effect,
      isBinary = _ref.isBinary;
  var ref = useRef('svgTreatmentEffect');
  var svg = d3.select("#svgTreatmentEffect" + index);
  var svgElement = svg.select("g"); // Track color map

  var _React$useState = React.useState({
    1: "#4e79a7",
    0: "#f28e2b"
  }),
      colorMap = _React$useState[0],
      setColorMap = _React$useState[1];

  var _React$useState2 = React.useState([]),
      cohortData = _React$useState2[0],
      setCohortData = _React$useState2[1];

  var _React$useState3 = React.useState(""),
      stratifyBy = _React$useState3[0],
      setStratifyBy = _React$useState3[1]; // const [isBinary, setIsBinary] = React.useState(false);


  var _React$useState4 = React.useState(""),
      plotTitle = _React$useState4[0],
      setPlotTitle = _React$useState4[1];

  var _React$useState5 = React.useState({
    "height": 500,
    "width": 600,
    "margin": 50,
    "marginLeft": 50
  }),
      layout = _React$useState5[0],
      setLayout = _React$useState5[1];

  var _React$useState6 = React.useState([[0, 0], [0, 0]]),
      treatmentReg = _React$useState6[0],
      setTreatmentReg = _React$useState6[1];

  var _React$useState7 = React.useState([[0, 0], [0, 0]]),
      controlReg = _React$useState7[0],
      setControlReg = _React$useState7[1];

  var _React$useState8 = React.useState([]),
      treatmentBins = _React$useState8[0],
      setTreatmentBins = _React$useState8[1];

  var _React$useState9 = React.useState([]),
      controlBins = _React$useState9[0],
      setControlBins = _React$useState9[1];

  var _React$useState10 = React.useState([]),
      stratifiedBins = _React$useState10[0],
      setStratifiedBins = _React$useState10[1];

  var bins = 20;
  useEffect(function () {
    var cohortData = allData["data"];
    var stratifyBy = allData["stratifyBy"]; // let isBinary = (new Set(cohortData.map(d => d[stratifyBy]))).size <= 2;

    setCohortData(cohortData);
    setStratifyBy(stratifyBy); // setIsBinary(isBinary);

    setPlotTitle(allData["title"]);
    setLayout(allData["layout"]);
    var treatmentData = cohortData.filter(function (d) {
      return d[treatment] === 1;
    });
    var controlData = cohortData.filter(function (d) {
      return d[treatment] === 0;
    });

    if (isBinary) {
      // If the variable is binary, perform binning for violin plot
      var histogram = d3.histogram().value(function (d) {
        return d[effect];
      }).domain(d3.extent(cohortData, function (d) {
        return d[effect];
      })).thresholds(bins);
      var stratify0 = cohortData.filter(function (d) {
        return d[stratifyBy] === 0;
      });
      var stratify1 = cohortData.filter(function (d) {
        return d[stratifyBy] === 1;
      });
      setStratifiedBins([histogram(stratify0), histogram(stratify1)]);
      var treatmentStratify0 = treatmentData.filter(function (d) {
        return d[stratifyBy] === 0;
      });
      var treatmentStratify1 = treatmentData.filter(function (d) {
        return d[stratifyBy] === 1;
      });
      var controlStratify0 = controlData.filter(function (d) {
        return d[stratifyBy] === 0;
      });
      var controlStratify1 = controlData.filter(function (d) {
        return d[stratifyBy] === 1;
      });
      var newTreatmentBins = [histogram(treatmentStratify0), histogram(treatmentStratify1)];
      var newControlBins = [histogram(controlStratify0), histogram(controlStratify1)]; // console.log(newTreatmentBins, newControlBins)

      setTreatmentBins(newTreatmentBins);
      setControlBins(newControlBins);
    } else {
      // If variable is continous, calculate the regression line for treatment and control groups separately
      var treatmentLine = regression.linear(treatmentData.map(function (d) {
        return [d[stratifyBy], d[effect]];
      }));
      var controlLine = regression.linear(controlData.map(function (d) {
        return [d[stratifyBy], d[effect]];
      }));
      var extent = d3.extent(cohortData, function (d) {
        return d[stratifyBy];
      });
      var treatmentStart = treatmentLine.predict(extent[0]);
      var treatmentEnd = treatmentLine.predict(extent[1]);
      var controlStart = controlLine.predict(extent[0]);
      var controlEnd = controlLine.predict(extent[1]);
      setTreatmentReg([treatmentStart, treatmentEnd]);
      setControlReg([controlStart, controlEnd]);
    }
  }, [allData]);
  useEffect(function () {
    var jitter = 15;

    if (isBinary) {
      // If variable is binary, visualize violin plots of distribution
      var xScale = d3.scaleBand().domain([0, 1]).range([layout.marginLeft, layout.width - layout.margin]);
      var yScale = d3.scaleLinear().domain(d3.extent(cohortData, function (d) {
        return d[effect];
      })).range([layout.height - layout.marginBottom, layout.margin]);
      var computedBandwidth = xScale.bandwidth();
      var customBandwidth = layout.width / 8;
      var binScales = []; // Define scales separately to normalize the violin plots by size of the subgroup

      var _loop2 = function _loop2() {
        var b = _step.value;
        var totalLength = b.reduce(function (count, current) {
          return count + current.length;
        }, 0);
        var maxNum = d3.max(b.map(function (d) {
          return d.length / totalLength;
        }));
        var newScale = d3.scaleLinear().range([0, computedBandwidth]).domain([-maxNum, maxNum]);
        binScales.push({
          "scale": newScale,
          "len": totalLength
        });
      };

      for (var _iterator = _createForOfIteratorHelperLoose(stratifiedBins), _step; !(_step = _iterator()).done;) {
        _loop2();
      }

      var _loop = function _loop(i) {
        var binData = stratifiedBins[i];
        var binScale = binScales[i].scale;
        var binSize = binScales[i].len;
        svgElement.select("#violin").selectAll(".area" + i).data([binData]).join("path").attr("class", "area" + i).attr("transform", "translate(" + xScale(i) + ", 0)").datum(function (d) {
          return d;
        }).style("stroke", "none").style("fill", colorMap[1]).attr("d", d3.area().x0(function (d) {
          return binScale(-d.length / binSize);
        }).x1(function (d) {
          return binScale(d.length / binSize);
        }).y(function (d) {
          return yScale(d.x0);
        }).curve(d3.curveCatmullRom));
      };

      for (var i = 0; i < stratifiedBins.length; i++) {
        _loop(i);
      } // 	let controlScales = [];
      // for (let cb of controlBins) {
      // 	let totalLength = cb.reduce((count, current) => count + current.length, 0);
      // 	let maxNum = d3.max(cb.map(d => d.length / totalLength));
      // 	let newScale = d3.scaleLinear()
      // 				  				.range([0, computedBandwidth / 2])
      // 				    			.domain([-maxNum, maxNum])
      // controlScales.push({"scale": newScale, "len":totalLength});
      // }
      // 	for (let i = 0; i < controlBins.length; i++) {
      // 		let binData = controlBins[i];
      // 		let binScale = controlScales[i].scale;
      // 		let binSize = controlScales[i].len;
      // 		svgElement.select("#violin")
      // 			.selectAll(`.controlArea${i}`)
      //    .data([binData])
      //    .join("path")
      //    .attr("class", `controlArea${i}`)
      //    .attr("transform", `translate(${xScale(i) + computedBandwidth / 2}, 0)`)
      //    .datum(function(d){ return(d)})
      //    .style("stroke", "none")
      //       .style("fill", colorMap[0])
      //       .attr("d", d3.area()
      //           .x0(function(d){ return(binScale(-d.length / binSize)) } )
      //           .x1(function(d){ return(binScale(d.length / binSize)) } )
      //           .y(function(d){ return(yScale(d.x0)) } )
      //           .curve(d3.curveCatmullRom)
      //       )
      // 	}


      var xAxis = svgElement.select('#x-axis').attr('transform', "translate(0, " + (layout.height - layout.marginBottom) + ")").call(d3.axisBottom(xScale).tickSize(3).ticks(5));
    } else {
      // If variable is not binary, visualize each data instance and outcome with regression line
      var xScale = d3.scaleLinear().domain(d3.extent(cohortData, function (d) {
        return d[stratifyBy];
      })).range([layout.marginLeft, layout.width - layout.margin]);
      var yScale = d3.scaleLinear().domain(d3.extent(cohortData, function (d) {
        return d[effect];
      })).range([layout.height - layout.marginBottom, layout.margin]);
      var effects = svgElement.select("#effects").selectAll(".effectCircles").data(cohortData).join("circle").attr("class", "effectCircles").attr("cx", function (d) {
        return xScale(d[stratifyBy]) + (Math.random() - 0.5) * jitter;
      }).attr("cy", function (d) {
        return yScale(d[effect]);
      }).attr("r", 3).attr("fill", "steelblue") // .attr("stroke", d => colorMap[d[treatment]])
      .attr("cursor", "pointer"); // let regressionLines = svgElement.select("#regression")
      //   .selectAll(".regressionLine")
      //   .data([treatmentReg, controlReg])
      //   .join("line")
      //   .attr("class", "regressionLine")
      //   .attr("x1", d => xScale(d[0][0]))
      //   .attr("y1", d => yScale(d[0][1]))
      //   .attr("x2", d => xScale(d[1][0]))
      //   .attr("y2", d => yScale(d[1][1]))
      //   .attr("stroke", "black")

      var _xAxis = svgElement.select('#x-axis').attr('transform', "translate(0, " + (layout.height - layout.marginBottom) + ")").call(d3.axisBottom(xScale).tickSize(3).ticks(5));
    }

    svgElement.select('#x-axis').selectAll("#axis-title").data([stratifyBy]).join("text").attr("id", "axis-title").attr("x", layout.width / 2).attr("y", 30).attr("text-anchor", "middle").attr("fill", "black").attr("font-size", "15px").text(function (d) {
      return d;
    });
    svgElement.select('#y-axis').selectAll("#axis-title").data(["effect"]).join("text").attr("id", "axis-title").attr("text-anchor", "middle").attr("transform", "translate(" + (layout.marginLeft - 5) + ", " + layout.height / 2 + ") rotate(-90)").attr("fill", "black").attr("font-size", "15px").text(function (d) {
      return d;
    });
    d3.selectAll("#x-axis>.tick>text").each(function (d, i) {
      d3.select(this).style("font-size", "12px");
    });
    var yAxis = svgElement.select('#y-axis').attr('transform', "translate(" + layout.marginLeft + ", 0)").call(d3.axisLeft(yScale).tickSize(3).ticks(5));
    d3.selectAll("#y-axis>.tick>text").each(function (d, i) {
      d3.select(this).style("font-size", "12px");
    });
  }, [cohortData, stratifyBy, isBinary, layout, treatmentBins, controlBins]);
  var subplotStyle = {
    "display": "flex",
    "flexDirection": "column",
    "alignItems": "center"
  };
  var subplotTitle = {
    "fontFamily": "sans-serif",
    "marginTop": "15px",
    "marginBottom": "0px",
    "fontSize": "15px"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: subplotStyle
  }, /*#__PURE__*/React.createElement("svg", {
    width: layout.width,
    height: layout.height,
    id: "svgTreatmentEffect" + index
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("g", {
    id: "x-axis"
  }), /*#__PURE__*/React.createElement("g", {
    id: "y-axis"
  }), /*#__PURE__*/React.createElement("g", {
    id: "effects"
  }), /*#__PURE__*/React.createElement("g", {
    id: "regression"
  }), /*#__PURE__*/React.createElement("g", {
    id: "violin"
  }), /*#__PURE__*/React.createElement("g", {
    id: "title"
  }))));
};