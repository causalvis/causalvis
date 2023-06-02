"use strict";

exports.__esModule = true;
exports.VersionTree = void 0;

var _react = _interopRequireWildcard(require("react"));

var d3 = _interopRequireWildcard(require("d3"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// This visualization is modified from https://observablehq.com/@d3/zoomable-icicle
var VersionTree = function VersionTree(_ref) {
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
  } : _ref$data,
      colorScale = _ref.colorScale,
      _dag = _ref._dag,
      _cohort = _ref._cohort;
  var ref = (0, _react.useRef)('svgVersionTree');
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

    return colorScale(JSON.stringify(d.data.DAG));
  }).style("cursor", "pointer").on("click", clicked);
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

  function setVariables(node) {
    var DAGInput = document.getElementById(_dag);
    var CohortInput = document.getElementById(_cohort);

    if (node.data.DAG && DAGInput) {
      DAGInput.value = JSON.stringify(node.data.DAG);
      var event = document.createEvent('HTMLEvents');
      event.initEvent('input', false, true);
      DAGInput.dispatchEvent(event);

      if (CohortInput) {
        CohortInput.value = "";
        var event = document.createEvent('HTMLEvents');
        event.initEvent('input', false, true);
        CohortInput.dispatchEvent(event);
      }
    }

    if (node.data.Cohort && CohortInput) {
      CohortInput.value = JSON.stringify(node.data.Cohort);
      var event = document.createEvent('HTMLEvents');
      event.initEvent('input', false, true);
      CohortInput.dispatchEvent(event);

      if (DAGInput) {
        DAGInput.value = "";
        var event = document.createEvent('HTMLEvents');
        event.initEvent('input', false, true);
        DAGInput.dispatchEvent(event);
      }
    }
  }

  function clicked(event, p) {
    focus = focus === p ? p = p.parent : p;
    selected = focus.data.name;
    setVariables(focus);
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
  return /*#__PURE__*/_react["default"].createElement("div", {
    ref: ref
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: titleStyle
  }, /*#__PURE__*/_react["default"].createElement("p", {
    id: "selectedTitle"
  })), /*#__PURE__*/_react["default"].createElement("svg", {
    width: layout.width,
    height: layout.height,
    id: "svgVersionTree"
  }, /*#__PURE__*/_react["default"].createElement("g", {
    id: "rect"
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "text"
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "tspan"
  })));
};

exports.VersionTree = VersionTree;