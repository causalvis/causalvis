"use strict";

exports.__esModule = true;
exports.DAGEditor = void 0;

var _react = _interopRequireWildcard(require("react"));

var d3 = _interopRequireWildcard(require("d3"));

var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));

var _Menu = _interopRequireDefault(require("@mui/material/Menu"));

var _MenuItem = _interopRequireDefault(require("@mui/material/MenuItem"));

var _FullscreenExitOutlined = _interopRequireDefault(require("@mui/icons-material/FullscreenExitOutlined"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/* Interactive editor for the directed acyclic graph (DAG)

Props:
  - layout: Object, dimensions of svg
  - nodelinks: Object, {nodes: [...], links: [...]}
  - mode: String, "default" or "path"
  - treatment: String, treatment variable
  - outcome: String, outcome variable
  - mediators: Array, variable names of type String given treatment and outcome
  - colliders: Array, variable names of type String given treatment and outcome
  - confounds: Array, variable names of type String given treatment and outcome
  - search: Array, variables names of type String
  - updateNodePos: Function, updates position of nodes in nodelink
  - deleteAttribute: Function, deletes attribute/variable from nodelink
  - changeTreatment: Function, updates treatment variable
  - changeOutcome: Function, updates outcome variable
  - updateLinks: Function, updates/adds links in nodelink
  - deleteLinks: Function, deletes links in nodelink
*/
var DAGEditor = function DAGEditor(_ref) {
  var _ref$layout = _ref.layout,
      layout = _ref$layout === void 0 ? {
    "height": 500,
    "width": 1000,
    "margin": 60
  } : _ref$layout,
      _ref$nodelinks = _ref.nodelinks,
      nodelinks = _ref$nodelinks === void 0 ? {} : _ref$nodelinks,
      _ref$mode = _ref.mode,
      mode = _ref$mode === void 0 ? "default" : _ref$mode,
      _ref$treatment = _ref.treatment,
      treatment = _ref$treatment === void 0 ? "" : _ref$treatment,
      _ref$outcome = _ref.outcome,
      outcome = _ref$outcome === void 0 ? "" : _ref$outcome,
      _ref$mediators = _ref.mediators,
      mediators = _ref$mediators === void 0 ? [] : _ref$mediators,
      _ref$colliders = _ref.colliders,
      colliders = _ref$colliders === void 0 ? [] : _ref$colliders,
      _ref$confounds = _ref.confounds,
      confounds = _ref$confounds === void 0 ? [] : _ref$confounds,
      _ref$prognostics = _ref.prognostics,
      prognostics = _ref$prognostics === void 0 ? [] : _ref$prognostics,
      search = _ref.search,
      updateNodePos = _ref.updateNodePos,
      deleteAttribute = _ref.deleteAttribute,
      changeTreatment = _ref.changeTreatment,
      changeOutcome = _ref.changeOutcome,
      updateLinks = _ref.updateLinks,
      deleteLinks = _ref.deleteLinks,
      _svg = _ref._svg;

  // Controls node options menu
  var _React$useState = _react["default"].useState(false),
      open = _React$useState[0],
      setOpen = _React$useState[1];

  var _React$useState2 = _react["default"].useState(null),
      anchorPos = _React$useState2[0],
      setAnchorPos = _React$useState2[1];

  var _React$useState3 = _react["default"].useState(null),
      contextItem = _React$useState3[0],
      setContextItem = _React$useState3[1]; // Track selected nodes


  var _React$useState4 = _react["default"].useState([]),
      selected = _React$useState4[0],
      setSelected = _React$useState4[1]; // Track color scheme of nodes


  var _React$useState5 = _react["default"].useState({
    "treatment": "#4e79a7",
    "outcome": "#f28e2c",
    "confounds": "#e15759",
    "colliders": "#76b7b2",
    "mediators": "#59a14f",
    "prognostics": "#b07AA1"
  }),
      colorMap = _React$useState5[0],
      setColorMap = _React$useState5[1];

  function handleClose() {
    setAnchorPos(null);
    setContextItem(null);
    setOpen(false);
  }

  function handleContextMenu(e, d) {
    e.preventDefault();
    setAnchorPos({
      "left": e.clientX + 2,
      "top": e.clientY - 6
    });
    setOpen(!open);
    setContextItem(d.name);
  }

  function handleTreatment() {
    if (treatment === contextItem) {
      changeTreatment("");
      handleClose();
    } else if (outcome === contextItem) {
      changeTreatment(contextItem);
      changeOutcome("");
      handleClose();
    } else {
      changeTreatment(contextItem);
      handleClose();
    }
  }

  function handleOutcome() {
    if (outcome === contextItem) {
      changeOutcome("");
      handleClose();
    } else if (treatment === contextItem) {
      changeOutcome(contextItem);
      changeTreatment("");
      handleClose();
    } else {
      changeOutcome(contextItem);
      handleClose();
    }
  } // Delete single Node


  function handleDelete() {
    if (selected.length === 0) {
      deleteAttribute(contextItem);
      handleClose();
    }
  } // Add node to selections


  function handleSelected(nodeName) {
    var selectedIndex = selected.indexOf(nodeName);

    if (selectedIndex < 0) {
      setSelected([].concat(selected, [nodeName]));
    } else {
      selected.splice(selectedIndex, 1);
      setSelected([].concat(selected));
    }
  } // Return true if node name or node tags matches search


  function isSearched(n) {
    if (!search) {
      return false;
    } else if (search === n.name) {
      return true;
    } else if (search.startsWith("tag:") && n.tags && n.tags.indexOf(search.slice(4)) >= 0) {
      return true;
    } else {
      return false;
    }
  } // Highlight node that matches search


  (0, _react.useEffect)(function () {
    if (!search) {
      node.attr("stroke-width", "1px");
    } else {
      node.filter(function (n) {
        return isSearched(n);
      }).attr("stroke-width", "3px");
    }
  }, [search]);
  (0, _react.useEffect)(function () {
    var _loop = function _loop() {
      var m = _step.value;
      node.filter(function (d) {
        return d.name === m;
      }).attr("stroke", colorMap.mediators);
      text.filter(function (d) {
        return d.name === m;
      }).attr("fill", colorMap.mediators);
    };

    for (var _iterator = _createForOfIteratorHelperLoose(mediators), _step; !(_step = _iterator()).done;) {
      _loop();
    }

    var _loop2 = function _loop2() {
      var co = _step2.value;
      node.filter(function (d) {
        return d.name === co;
      }).attr("stroke", colorMap.colliders);
      text.filter(function (d) {
        return d.name === co;
      }).attr("fill", colorMap.colliders);
    };

    for (var _iterator2 = _createForOfIteratorHelperLoose(colliders), _step2; !(_step2 = _iterator2()).done;) {
      _loop2();
    }

    var _loop3 = function _loop3() {
      var con = _step3.value;
      node.filter(function (d) {
        return d.name === con;
      }).attr("stroke", colorMap.confounds);
      text.filter(function (d) {
        return d.name === con;
      }).attr("fill", colorMap.confounds);
    };

    for (var _iterator3 = _createForOfIteratorHelperLoose(confounds), _step3; !(_step3 = _iterator3()).done;) {
      _loop3();
    }
  }, [mediators, colliders, confounds]);
  var ref = (0, _react.useRef)('svgDAG');
  var currentPath = [];
  var svg = d3.select(ref.current);
  var svgElement = svg.select("g");

  function zoomed(_ref2) {
    var transform = _ref2.transform;
    svgElement.attr("transform", transform);
  }

  var zoom = d3.zoom().extent([[0, 0], [layout.width, layout.height]]).scaleExtent([0.1, 8]).on("zoom", zoomed);
  svg.call(zoom); // Reset zoom on click

  function resetZoom() {
    svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
  }

  function getAngle(height, width, theta) {
    var angle;

    if (height < 0 && width < 0) {
      angle = Math.PI * 2 - theta;
    } else if (height < 0 && width > 0) {
      angle = Math.PI + theta;
    } else if (height > 0 && width > 0) {
      angle = Math.PI - theta;
    } else if (height === 0 && width < 0) {
      angle = 0;
    } else if (height === 0 && width > 0) {
      angle = Math.PI;
    } else if (height > 0 && width === 0) {
      angle = Math.PI / 2;
    } else if (height < 0 && width === 0) {
      angle = Math.PI / 2 * 3;
    } else {
      angle = theta;
    }

    return angle;
  }

  var arrowleft = svgElement.select("#links").selectAll(".arrowleft").data(nodelinks.links).join("line").attr("class", "arrowleft").attr("x1", function (d) {
    return (d.target.x - d.source.x) / 2 + d.source.x;
  }).attr("y1", function (d) {
    return (d.target.y - d.source.y) / 2 + d.source.y;
  }).attr("x2", function (d) {
    var height = d.target.y - d.source.y;
    var width = d.target.x - d.source.x;
    var theta = Math.atan(Math.abs(height / width));
    var angle = getAngle(height, width, theta);
    return (d.target.x - d.source.x) / 2 + d.source.x + 10 * Math.cos(angle + Math.PI / 5);
  }).attr("y2", function (d) {
    var height = d.target.y - d.source.y;
    var width = d.target.x - d.source.x;
    var theta = Math.atan(Math.abs(height / width));
    var angle = getAngle(height, width, theta);
    return (d.target.y - d.source.y) / 2 + d.source.y - 10 * Math.sin(angle + Math.PI / 5);
  }).attr("stroke", "black").attr("stroke-width", 1);
  var arrowright = svgElement.select("#links").selectAll(".arrowright").data(nodelinks.links).join("line").attr("class", "arrowright").attr("x1", function (d) {
    return (d.target.x - d.source.x) / 2 + d.source.x;
  }).attr("y1", function (d) {
    return (d.target.y - d.source.y) / 2 + d.source.y;
  }).attr("x2", function (d) {
    var height = d.target.y - d.source.y;
    var width = d.target.x - d.source.x;
    var theta = Math.atan(Math.abs(height / width));
    var angle = getAngle(height, width, theta);
    return (d.target.x - d.source.x) / 2 + d.source.x + 10 * Math.cos(angle - Math.PI / 5);
  }).attr("y2", function (d) {
    var height = d.target.y - d.source.y;
    var width = d.target.x - d.source.x;
    var theta = Math.atan(Math.abs(height / width));
    var angle = getAngle(height, width, theta);
    return (d.target.y - d.source.y) / 2 + d.source.y - 10 * Math.sin(angle - Math.PI / 5);
  }).attr("stroke", "black").attr("stroke-width", 1);

  function onDrag(el, e, d) {
    // Change position of node
    d3.select(el).attr("cx", e.x).attr("cy", e.y); // Change position of text

    text.filter(function (l) {
      return l.id === d.id;
    }).attr("x", e.x).attr("y", e.y); // Update endpoints of links

    link.filter(function (l) {
      return l.source.id === d.id;
    }).attr("x1", e.x).attr("y1", e.y);
    link.filter(function (l) {
      return l.target.id === d.id;
    }).attr("x2", e.x).attr("y2", e.y); // Update endpoints of direction arrows

    arrowleft.filter(function (l) {
      return l.target.id === d.id;
    }).attr("x1", function (d) {
      return (e.x - d.source.x) / 2 + d.source.x;
    }).attr("y1", function (d) {
      return (e.y - d.source.y) / 2 + d.source.y;
    }).attr("x2", function (d) {
      var height = e.y - d.source.y;
      var width = e.x - d.source.x;
      var theta = Math.atan(Math.abs(height / width));
      var angle = getAngle(height, width, theta);
      return (e.x - d.source.x) / 2 + d.source.x + 10 * Math.cos(angle + Math.PI / 5);
    }).attr("y2", function (d) {
      var height = e.y - d.source.y;
      var width = e.x - d.source.x;
      var theta = Math.atan(Math.abs(height / width));
      var angle = getAngle(height, width, theta);
      return (e.y - d.source.y) / 2 + d.source.y - 10 * Math.sin(angle + Math.PI / 5);
    });
    arrowleft.filter(function (l) {
      return l.source.id === d.id;
    }).attr("x1", function (d) {
      return (d.target.x - e.x) / 2 + e.x;
    }).attr("y1", function (d) {
      return (d.target.y - e.y) / 2 + e.y;
    }).attr("x2", function (d) {
      var height = d.target.y - e.y;
      var width = d.target.x - e.x;
      var theta = Math.atan(Math.abs(height / width));
      var angle = getAngle(height, width, theta);
      return (d.target.x - e.x) / 2 + e.x + 10 * Math.cos(angle + Math.PI / 5);
    }).attr("y2", function (d) {
      var height = d.target.y - e.y;
      var width = d.target.x - e.x;
      var theta = Math.atan(Math.abs(height / width));
      var angle = getAngle(height, width, theta);
      return (d.target.y - e.y) / 2 + e.y - 10 * Math.sin(angle + Math.PI / 5);
    }).attr("stroke", "black").attr("stroke-width", 1);
    arrowright.filter(function (l) {
      return l.target.id === d.id;
    }).attr("x1", function (d) {
      return (e.x - d.source.x) / 2 + d.source.x;
    }).attr("y1", function (d) {
      return (e.y - d.source.y) / 2 + d.source.y;
    }).attr("x2", function (d) {
      var height = e.y - d.source.y;
      var width = e.x - d.source.x;
      var theta = Math.atan(Math.abs(height / width));
      var angle = getAngle(height, width, theta);
      return (e.x - d.source.x) / 2 + d.source.x + 10 * Math.cos(angle - Math.PI / 5);
    }).attr("y2", function (d) {
      var height = e.y - d.source.y;
      var width = e.x - d.source.x;
      var theta = Math.atan(Math.abs(height / width));
      var angle = getAngle(height, width, theta);
      return (e.y - d.source.y) / 2 + d.source.y - 10 * Math.sin(angle - Math.PI / 5);
    });
    arrowright.filter(function (l) {
      return l.source.id === d.id;
    }).attr("x1", function (d) {
      return (d.target.x - e.x) / 2 + e.x;
    }).attr("y1", function (d) {
      return (d.target.y - e.y) / 2 + e.y;
    }).attr("x2", function (d) {
      var height = d.target.y - e.y;
      var width = d.target.x - e.x;
      var theta = Math.atan(Math.abs(height / width));
      var angle = getAngle(height, width, theta);
      return (d.target.x - e.x) / 2 + e.x + 10 * Math.cos(angle - Math.PI / 5);
    }).attr("y2", function (d) {
      var height = d.target.y - e.y;
      var width = d.target.x - e.x;
      var theta = Math.atan(Math.abs(height / width));
      var angle = getAngle(height, width, theta);
      return (d.target.y - e.y) / 2 + e.y - 10 * Math.sin(angle - Math.PI / 5);
    }).attr("stroke", "black").attr("stroke-width", 1);
  } // Determine node color


  function nodeColor(d) {
    if (d.name === treatment) {
      return colorMap.treatment;
    } else if (d.name === outcome) {
      return colorMap.outcome;
    } else if (mediators.indexOf(d.name) >= 0) {
      return colorMap.mediators;
    } else if (colliders.indexOf(d.name) >= 0) {
      return colorMap.colliders;
    } else if (confounds.indexOf(d.name) >= 0) {
      return colorMap.confounds;
    } else if (prognostics.indexOf(d.name) >= 0) {
      return colorMap.prognostics;
    }

    return "black";
  }

  var text = svgElement.select("#nodeNames").selectAll(".nodeName").data(nodelinks.nodes).join("text").attr("class", "nodeName").text(function (d) {
    return d.name;
  }).attr("x", function (d) {
    return d.x;
  }).attr("y", function (d) {
    return d.y;
  }).attr("fill", function (d) {
    return nodeColor(d);
  }).attr("text-anchor", "middle").attr("alignment-baseline", "middle").attr("font-family", "sans-serif").attr("font-size", "12px"); // Each line represents a link between attributes

  var link = svgElement.select("#links").selectAll(".link").data(nodelinks.links).join("line").attr("class", "link").attr("x1", function (d) {
    return d.source.x;
  }).attr("y1", function (d) {
    return d.source.y;
  }).attr("x2", function (d) {
    return d.target.x;
  }).attr("y2", function (d) {
    return d.target.y;
  }).attr("stroke", "black").attr("stroke-width", 1).on("mouseover", function () {
    if (mode === "path") {
      d3.select(this).attr("stroke-width", 3);
    }
  }).on("mouseout", function () {
    if (mode === "path") {
      d3.select(this).attr("stroke", "black").attr("stroke-width", 1);
    }
  }).on("click", function (e, d) {
    if (mode === "path") {
      deleteLinks(d);
    }
  });

  function getStrokeWidth(d) {
    if (selected.indexOf(d.name) >= 0) {
      return 3;
    } else if (isSearched(d)) {
      return 3;
    } else {
      return 1;
    }
  } // Each ellipse represents an attribute


  var node = svgElement.select("#nodes").selectAll(".node").data(nodelinks.nodes).join("ellipse").attr("class", "node").attr("rx", 50).attr("ry", 20).attr("cx", function (d) {
    return d.x;
  }).attr("cy", function (d) {
    return d.y;
  }).attr("fill", "white").attr("stroke", function (d) {
    return nodeColor(d);
  }).attr("stroke-width", function (d) {
    return getStrokeWidth(d);
  }).attr("stroke-dasharray", function (d) {
    return d["$custom"] ? "5 5 2 5" : "none";
  }).attr("cursor", "pointer").call(d3.drag().on("start", function (e, d) {}).on("drag", function (e, d) {
    if (mode === "default") {
      // Adjust the position of a node
      onDrag(this, e, d);
    }
  }).on("end", function (e, d) {
    // Update the new position of the node
    if (mode === "default") {
      updateNodePos(d.id, e.x, e.y);
    }
  })).on("click", function (e, d) {
    e.stopPropagation();

    if (mode === "path") {
      // Remove node if previously selected
      if (currentPath.length === 1 && d.id === currentPath[0].id) {
        d3.select(this).attr("stroke-width", 1);
        currentPath = [];
        return;
      }

      currentPath.push(d);
      d3.select(this).attr("stroke-width", 3);

      if (currentPath.length === 2) {
        updateLinks(currentPath);
        currentPath = [];
      }
    }
  }).on("mouseover", function (e, d) {
    if (mode === "path") {
      d3.select(this).attr("stroke-width", 3);
    }
  }).on("mouseout", function (e, d) {
    if (mode === "path" && currentPath.map(function (cp) {
      return cp.name;
    }).indexOf(d.name) < 0 && d.name !== search) {
      d3.select(this).attr("stroke-width", 1);
    } else if (mode === "default" && !isSearched(d)) {
      d3.select(this).attr("stroke-width", 1);
    }
  });
  var covariateTypes = ["treatment", "outcome", "confounds", "colliders", "mediators", "prognostics"];
  var legend = svg.select("#legend").selectAll(".legendRect").data(covariateTypes).join("rect").attr("class", "legendRect").attr("x", layout.width - layout.margin * 2).attr("y", function (d, i) {
    return layout.height - layout.margin * 2 + 18 * i;
  }).attr("width", 15).attr("height", 15).attr("fill", function (d) {
    return colorMap[d];
  });
  var legendText = svg.select("#legend").selectAll(".legendText").data(covariateTypes).join("text").attr("class", "legendText").attr("x", layout.width - layout.margin * 2 + 18).attr("y", function (d, i) {
    return layout.height - layout.margin * 2 + 18 * i + 9;
  }).attr("alignment-baseline", "middle").attr("text-anchor", "start").attr("fill", function (d) {
    return colorMap[d];
  }).attr("font-family", "sans-serif").attr("font-size", "12px").text(function (d) {
    return d;
  });
  var menuStyle = {};
  var aStyle = {
    "height": "24px"
  };
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_Menu["default"], {
    id: "basic-menu",
    anchorReference: "anchorPosition",
    anchorPosition: anchorPos,
    style: menuStyle,
    open: open,
    onClose: handleClose,
    MenuListProps: {
      'aria-labelledby': 'basic-button'
    }
  }, /*#__PURE__*/_react["default"].createElement(_MenuItem["default"], {
    onClick: handleTreatment,
    selected: contextItem === treatment
  }, "Set as Treatment"), /*#__PURE__*/_react["default"].createElement(_MenuItem["default"], {
    onClick: handleOutcome,
    selected: contextItem === outcome
  }, "Set as Outcome"), /*#__PURE__*/_react["default"].createElement(_MenuItem["default"], {
    onClick: handleDelete
  }, "Delete from Graph")), /*#__PURE__*/_react["default"].createElement(_IconButton["default"], {
    id: "fitScreen",
    onClick: function onClick() {
      return resetZoom();
    }
  }, /*#__PURE__*/_react["default"].createElement("a", {
    style: aStyle,
    title: "reset zoom"
  }, /*#__PURE__*/_react["default"].createElement(_FullscreenExitOutlined["default"], null))), /*#__PURE__*/_react["default"].createElement("svg", {
    width: layout.width,
    height: layout.height,
    ref: ref,
    id: _svg
  }, /*#__PURE__*/_react["default"].createElement("g", null, /*#__PURE__*/_react["default"].createElement("g", {
    id: "links"
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "nodes"
  }), /*#__PURE__*/_react["default"].createElement("g", {
    id: "nodeNames"
  })), /*#__PURE__*/_react["default"].createElement("g", {
    id: "legend"
  })));
};

exports.DAGEditor = DAGEditor;