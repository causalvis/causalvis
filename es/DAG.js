function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey, blue, orange } from '@mui/material/colors';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import { AttributesManager } from './CausalStructure/AttributesManager';
import { DAGEditor } from './CausalStructure/DAGEditor';
import { DownloadDialog } from './CausalStructure/DownloadDialog';
import { TagDialog } from './CausalStructure/TagDialog';
import { NodeDialog } from './CausalStructure/NodeDialog';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'; // import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import ControlPointDuplicateOutlinedIcon from '@mui/icons-material/ControlPointDuplicateOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'; // import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined';
// import FitScreenOutlinedIcon from '@mui/icons-material/FitScreenOutlined';
// import SyncAltIcon from '@mui/icons-material/SyncAlt';

import LinearScaleRoundedIcon from '@mui/icons-material/LinearScaleRounded';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import SearchIcon from '@mui/icons-material/Search'; // import MovingOutlinedIcon from '@mui/icons-material/MovingOutlined';

import { saveAs } from 'file-saver';
export var DAG = function DAG(_ref) {
  var _ref$attributes = _ref.attributes,
      attributes = _ref$attributes === void 0 ? [] : _ref$attributes,
      graph = _ref.graph;

  // Tracks nodes and links in DAG
  var _React$useState = React.useState({
    "nodes": [],
    "links": []
  }),
      nodelinks = _React$useState[0],
      setnodelinks = _React$useState[1]; // Tracks current editor mode


  var _React$useState2 = React.useState('default'),
      mode = _React$useState2[0],
      setMode = _React$useState2[1]; // Controls whether download dialog is open


  var _React$useState3 = React.useState(false),
      open = _React$useState3[0],
      setOpen = _React$useState3[1]; // Controls whether add node dialog is open


  var _React$useState4 = React.useState(false),
      addNode = _React$useState4[0],
      setAddNode = _React$useState4[1]; // Controls whether add tag dialog is open


  var _React$useState5 = React.useState(false),
      addTag = _React$useState5[0],
      setAddTag = _React$useState5[1];

  var _React$useState6 = React.useState(),
      tagNode = _React$useState6[0],
      setTagNode = _React$useState6[1];

  var _React$useState7 = React.useState({}),
      tagColors = _React$useState7[0],
      setTagColors = _React$useState7[1]; // Tracks search item


  var _React$useState8 = React.useState(""),
      search = _React$useState8[0],
      setSearch = _React$useState8[1]; // Tracks colliders, mediators and confounds in DAG


  var _React$useState9 = React.useState([]),
      colliders = _React$useState9[0],
      setColliders = _React$useState9[1];

  var _React$useState10 = React.useState([]),
      mediators = _React$useState10[0],
      setMediators = _React$useState10[1];

  var _React$useState11 = React.useState([]),
      confounds = _React$useState11[0],
      setConfounds = _React$useState11[1]; // Track attributes


  var _React$useState12 = React.useState({}),
      allAttributes = _React$useState12[0],
      setAllAttributes = _React$useState12[1]; // Tracks attributes added to DAG


  var _React$useState13 = React.useState([]),
      added = _React$useState13[0],
      setAdded = _React$useState13[1]; // Tracks treatment and outcome attributes


  var _React$useState14 = React.useState(""),
      treatment = _React$useState14[0],
      setTreatment = _React$useState14[1];

  var _React$useState15 = React.useState(""),
      outcome = _React$useState15[0],
      setOutcome = _React$useState15[1]; // const [attr, setAttr] = React.useState(attributes);
  // const [index, setIndex] = React.useState(0);
  // Tracks all descendants for a node


  var _React$useState16 = React.useState({}),
      allDescendants = _React$useState16[0],
      setAllDescendants = _React$useState16[1]; // All IDs used


  var _React$useState17 = React.useState(new Set()),
      ID = _React$useState17[0],
      setID = _React$useState17[1];

  var layout = {
    "height": 500,
    "width": 1000,
    "margin": 60
  };

  function generateID() {
    return new Date().getTime() + Math.floor(Math.random() * 98);
  }

  function loadGraph(graph) {
    var xScale = scaleLinear().domain(extent(graph.nodes, function (d) {
      return d.x;
    })).range([layout.margin, layout.width - layout.margin]);
    var yScale = scaleLinear().domain(extent(graph.nodes, function (d) {
      return d.y;
    })).range([layout.margin, layout.height - layout.margin]);
    var newnodelinks = JSON.parse(JSON.stringify(graph));
    var nodes = newnodelinks.nodes;
    var links = newnodelinks.links;
    var newID = new Set();
    var newAllAttributes = {};

    for (var _iterator = _createForOfIteratorHelperLoose(nodes), _step; !(_step = _iterator()).done;) {
      var n = _step.value;

      if (!n.id) {
        var id = generateID();

        while (newID.has(id)) {
          id = generateID();
        }

        n.id = id;
      }

      newID.add(n.id);
      n.x = xScale(n.x);
      n.y = yScale(n.y);
      n.children = new Set();
      n.parents = new Set();
      newAllAttributes[n.name] = {
        "$custom": false,
        "tags": []
      };
    }

    setID(newID);
    setAllAttributes(newAllAttributes);
    setAdded(Object.keys(newAllAttributes));

    var _loop = function _loop() {
      var l = _step2.value;
      var s = l.source.name ? l.source.name : l.source;
      var t = l.target.name ? l.target.name : l.target;
      var sourceNode = nodes.filter(function (n) {
        return n.name === s;
      })[0];
      var targetNode = nodes.filter(function (n) {
        return n.name === t;
      })[0];
      sourceNode.children.add(targetNode.id);
      targetNode.parents.add(sourceNode.id);
      l.source = _extends({}, nodes.filter(function (n) {
        return n.name === s;
      })[0]);
      l.target = _extends({}, nodes.filter(function (n) {
        return n.name === t;
      })[0]);
      delete l.source.children;
      delete l.source.parents;
      delete l.target.children;
      delete l.target.parents;
    };

    for (var _iterator2 = _createForOfIteratorHelperLoose(links), _step2; !(_step2 = _iterator2()).done;) {
      _loop();
    } // console.log(newnodelinks);


    setnodelinks(newnodelinks);
  }

  useEffect(function () {
    if (graph) {
      loadGraph(graph);
    }
  }, [graph]); // If attributes are provided without an accompanying graph set attributes only

  useEffect(function () {
    if (attributes && attributes.length > 0 && !graph) {
      var newAllAttributes = {};

      for (var _iterator3 = _createForOfIteratorHelperLoose(attributes), _step3; !(_step3 = _iterator3()).done;) {
        var a = _step3.value;
        newAllAttributes[a] = {
          "$custom": false,
          "tags": []
        };
      }

      setAllAttributes(newAllAttributes);
    }
  }, [attributes]); // When treatment and outcome variables are changed
  // Or when the graph is updated
  // Recalculate mediators, colliders, and confounds

  useEffect(function () {
    // Check that both treatment and outcome have been indicated
    if (treatment.length > 0 && outcome.length > 0) {
      var newColliders = getColliders(treatment, outcome);
      var colliderNames = [];

      var _loop2 = function _loop2() {
        var c = _step4.value;
        colliderNames.push(nodelinks.nodes.filter(function (n) {
          return n.id === c;
        })[0].name);
      };

      for (var _iterator4 = _createForOfIteratorHelperLoose(newColliders), _step4; !(_step4 = _iterator4()).done;) {
        _loop2();
      }

      setColliders(colliderNames);
      setMediators(Array.from(getMediators(treatment, outcome)).map(function (m) {
        return m.name;
      }));
      setConfounds(getConfounds(treatment, outcome).map(function (m) {
        return m.name;
      }));
    } else {
      // If either treatment or outcome is missing,
      // Set all variable types to empty
      setColliders([]);
      setMediators([]);
      setConfounds([]);
    }
  }, [treatment, outcome, nodelinks]); // Add new attribute to the DAG

  function addAttribute(val, custom, x, y) {
    if (custom === void 0) {
      custom = false;
    }

    if (x === void 0) {
      x = layout.width / 2;
    }

    if (y === void 0) {
      y = layout.height / 2;
    }

    // console.log(val);
    var index = added.indexOf(val); // console.log(allAttributes[val]);

    if (index < 0) {
      var id = generateID();
      var newnodelinks = {
        "nodes": [].concat(nodelinks.nodes, [{
          "x": x,
          "y": y,
          "id": id,
          "name": val,
          "parents": new Set(),
          "children": new Set(),
          "$custom": allAttributes[val] ? allAttributes[val]["$custom"] : custom,
          "tags": allAttributes[val] ? allAttributes[val]["tags"] : []
        }]),
        "links": [].concat(nodelinks.links)
      };
      setnodelinks(newnodelinks);
      setAdded([].concat(added, [val]));
    }
  }

  function addCustom(val) {
    var newAllAttributes = JSON.parse(JSON.stringify(allAttributes));
    newAllAttributes[val] = {
      "$custom": true,
      "tags": []
    };
    setAllAttributes(newAllAttributes);
    addAttribute(val, true);
  } // Delete an attribute from the DAG


  function deleteAttribute(val) {
    var index = added.indexOf(val);
    added.splice(index, 1);
    setAdded([].concat(added));
    var newNodes = nodelinks.nodes.filter(function (n) {
      return n.name !== val;
    });
    var newLinks = nodelinks.links.filter(function (l) {
      return l.target.name !== val && l.source.name !== val;
    });
    setnodelinks({
      "nodes": [].concat(newNodes),
      "links": [].concat(newLinks)
    }); // If deleted attribute is treatment, set treatment to null

    if (val === treatment) {
      setTreatment("");
    } // If deleted attribute is outcome, set outcome to null


    if (val === outcome) {
      setOutcome("");
    }
  } // Set an attribute as the treatment of interest


  function changeTreatment(attribute) {
    setTreatment(attribute);
  } // Set an attribute as the outcome of interest


  function changeOutcome(attribute) {
    setOutcome(attribute);
  } // Set search item


  function changeSearch(e, val) {
    setSearch(val);
  } // Update tags for an attribute


  function updateTag(color, tagName) {
    // console.log(color, tagName, tagNode);
    // If attribute already has a tag, do not add the tag again
    if (allAttributes[tagNode]["tags"] && allAttributes[tagNode]["tags"].indexOf(tagName) >= 0) {
      return;
    } // Update nodelink diagram


    var newnodelinks = _extends({}, nodelinks);

    var taggingNode = newnodelinks.nodes.filter(function (n) {
      return n.name === tagNode;
    })[0];

    if (!taggingNode.tags) {
      taggingNode.tags = [tagName];
    } else {
      taggingNode.tags.push(tagName);
    }

    setnodelinks(newnodelinks); // Update attributes

    var newAllAttributes = JSON.parse(JSON.stringify(allAttributes));
    newAllAttributes[tagNode]["tags"].push(tagName);
    setAllAttributes(newAllAttributes); // Update dictionary of tag colors

    tagColors[tagName] = color;
    setTagColors(_extends({}, tagColors));
  } // Delete tags for an attribute


  function deleteTag(tagName) {
    // Update nodelink diagram
    var newnodelinks = _extends({}, nodelinks);

    var taggingNode = newnodelinks.nodes.filter(function (n) {
      return n.name === tagNode;
    })[0];
    var tagIndex = taggingNode.tags.indexOf(tagName);
    taggingNode.tags.splice(tagIndex, 1);
    setnodelinks(newnodelinks); // Update attributes

    var newAllAttributes = JSON.parse(JSON.stringify(allAttributes));
    tagIndex = newAllAttributes[tagNode]["tags"].indexOf(tagName);
    newAllAttributes[tagNode]["tags"].splice(tagIndex, 1);
    setAllAttributes(newAllAttributes);
  } // Update node position after dragging


  function updateNodePos(id, newX, newY) {
    var newnodelinks = _extends({}, nodelinks);

    for (var _iterator5 = _createForOfIteratorHelperLoose(newnodelinks.nodes), _step5; !(_step5 = _iterator5()).done;) {
      var n = _step5.value;

      if (n.id === id) {
        n.x = newX;
        n.y = newY;
        break;
      }
    }

    for (var _iterator6 = _createForOfIteratorHelperLoose(newnodelinks.links), _step6; !(_step6 = _iterator6()).done;) {
      var l = _step6.value;

      if (l.source.id === id) {
        l.source.x = newX;
        l.source.y = newY;
      }

      if (l.target.id === id) {
        l.target.x = newX;
        l.target.y = newY;
      }
    }

    setnodelinks(newnodelinks);
  } // Returns true of acyclic


  function checkAcyclic(source, target) {
    var targetDesc = new Set(getDescendents(target));

    if (targetDesc.has(source.id)) {
      alert("This link cannot be added. The DAG must be acyclic.");
      return false;
    } else {
      return true;
    }
  } // Add new links between nodes


  function updateLinks(newLink) {
    // Ensure that there is only one link between any 2 nodes
    for (var _iterator7 = _createForOfIteratorHelperLoose(nodelinks.links), _step7; !(_step7 = _iterator7()).done;) {
      var l = _step7.value;

      if (l.source.id === newLink[0].id && l.target.id === newLink[1].id || l.target.id === newLink[0].id && l.source.id === newLink[1].id) {
        return;
      }
    }

    if (!checkAcyclic(newLink[0], newLink[1])) {
      return;
    } // Update parent and child relationships


    for (var _iterator8 = _createForOfIteratorHelperLoose(nodelinks.nodes), _step8; !(_step8 = _iterator8()).done;) {
      var n = _step8.value;

      if (n.id === newLink[0].id) {
        n.children.add(newLink[1].id);
      } else if (n.id === newLink[1].id) {
        n.parents.add(newLink[0].id);
      }
    }

    var newLinkCopy = JSON.parse(JSON.stringify(newLink));
    delete newLinkCopy[0].parents;
    delete newLinkCopy[0].children;
    delete newLinkCopy[1].parents;
    delete newLinkCopy[1].children;
    var newnodelinks = {
      "nodes": [].concat(nodelinks.nodes),
      "links": [].concat(nodelinks.links, [{
        "source": newLinkCopy[0],
        "target": newLinkCopy[1]
      }])
    }; // console.log(newnodelinks);

    setnodelinks(newnodelinks);
  } // Delete links between nodes


  function deleteLinks(link) {
    var newlinks = nodelinks.links.filter(function (l) {
      return !(l.source.id === link.source.id && l.target.id === link.target.id);
    }); // Update parent and child relationships

    for (var _iterator9 = _createForOfIteratorHelperLoose(nodelinks.nodes), _step9; !(_step9 = _iterator9()).done;) {
      var n = _step9.value;

      if (n.id === link.source.id) {
        n.children["delete"](link.target.id);
      } else if (n.id === link.target.id) {
        n.parents["delete"](link.source.id);
      }
    }

    var newnodelinks = {
      "nodes": [].concat(nodelinks.nodes),
      "links": [].concat(newlinks)
    }; // console.log(newnodelinks);

    setnodelinks(newnodelinks);
  } // Switch between layout and path editor


  function toggleMode(e, val) {
    setMode(val);
  } // Open and close download dialog


  var handleClickOpen = function handleClickOpen() {
    var newColliders = getColliders(treatment, outcome);
    var colliderNames = [];

    var _loop3 = function _loop3() {
      var c = _step10.value;
      colliderNames.push(nodelinks.nodes.filter(function (n) {
        return n.id === c;
      })[0].name);
    };

    for (var _iterator10 = _createForOfIteratorHelperLoose(newColliders), _step10; !(_step10 = _iterator10()).done;) {
      _loop3();
    }

    setColliders(colliderNames);
    setMediators(Array.from(getMediators(treatment, outcome)).map(function (m) {
      return m.name;
    }));
    setConfounds(getConfounds(treatment, outcome).map(function (m) {
      return m.name;
    })); // console.log(getMediators('age', 're78'))

    setOpen(true);
  }; // Close download dialog


  var handleClose = function handleClose() {
    setOpen(false);
  }; // Open and close node add dialog


  var handleNodeOpen = function handleNodeOpen() {
    setAddNode(true);
  }; // Close add node dialog


  var handleNodeClose = function handleNodeClose() {
    setAddNode(false);
  }; // Open and close tag add dialog


  var handleTagOpen = function handleTagOpen() {
    setAddTag(true);
  }; // Close add tag dialog


  var handleTagClose = function handleTagClose() {
    setAddTag(false);
  };

  var handleAddTag = function handleAddTag(value) {
    // console.log(value);
    setTagNode(value);
    handleTagOpen();
  }; // Download DAG as PNG image


  function downloadSVG() {
    // console.log('saving...');
    var svgElement = select("#svgDAG");
    var svgString = getSVGString(svgElement.node());
    svgString2Image(svgString, 2 * layout.width, 2 * layout.height, 'png', save); // passes Blob and filesize String to the callback

    function save(dataBlob, filesize) {
      saveAs(dataBlob, 'DAG.png'); // FileSaver.js function
    }
  } // Below are the functions that handle actual exporting:
  // getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
  // The functions are modified from http://bl.ocks.org/rokotyan/0556f8facbaf344507cdc45dc3622177


  function getSVGString(svgNode) {
    svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
    var serializer = new XMLSerializer();
    var svgString = serializer.serializeToString(svgNode);
    svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace

    svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

    return svgString;
  }

  function svgString2Image(svgString, width, height, format, callback) {
    var format = format ? format : 'png';
    var imgsrc = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString))); // Convert SVG string to data URL

    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    var image = new Image();

    image.onload = function () {
      context.clearRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);
      canvas.toBlob(function (blob) {
        var filesize = Math.round(blob.length / 1024) + ' KB';
        if (callback) callback(blob, filesize);
      });
    };

    image.src = imgsrc;
  } // Gets all descendents of a particular node
  // The same descendent may be included twice if there are multiple causal pathways
  // For unique descendents, apply Set() to the result


  function getDescendents(node) {
    // console.log(node);
    var result = Array.from(node.children);

    var _loop4 = function _loop4() {
      var c = _step11.value;
      var nodeC = nodelinks.nodes.filter(function (n) {
        return n.id === c;
      })[0];
      result = result.concat(getDescendents(nodeC));
    };

    for (var _iterator11 = _createForOfIteratorHelperLoose(node.children), _step11; !(_step11 = _iterator11()).done;) {
      _loop4();
    }

    return result;
  } // Gets the collider attributes between treatment and outcome


  function getColliders(treatment, outcome) {
    // Return if no nodes or links
    if (nodelinks.nodes.length === 0 || nodelinks.links.length === 0) {
      return [];
    } // Return if no treatment and outcome variables indicated


    if (treatment === "" || outcome === "") {
      return [];
    } // console.log("getting colliders...");


    var t = nodelinks.nodes.filter(function (n) {
      return n.name === treatment;
    })[0];
    var o = nodelinks.nodes.filter(function (n) {
      return n.name === outcome;
    })[0];
    var treatmentChildren = new Set(getDescendents(t));
    var outcomeChildren = new Set(getDescendents(o));
    var colliders = new Set([].concat(treatmentChildren).filter(function (x) {
      return outcomeChildren.has(x);
    }));
    return colliders;
  } // Gets descendents of a node that is on a path to the outcome


  function hasOutcome(node, outcomeID) {
    // console.log(node, node.children);
    if (node.id === outcomeID) {
      return [node];
    }

    if (node.id !== outcomeID && node.children.size === 0) {
      return [];
    }

    var result = [];

    var _loop5 = function _loop5() {
      var c = _step12.value;
      var nodeC = nodelinks.nodes.filter(function (n) {
        return n.id === c;
      })[0];
      var nodeResult = hasOutcome(nodeC, outcomeID);

      if (nodeResult.length > 0) {
        result = result.concat(nodeResult);
      }
    };

    for (var _iterator12 = _createForOfIteratorHelperLoose(node.children), _step12; !(_step12 = _iterator12()).done;) {
      _loop5();
    }

    return result.map(function (r) {
      return [node].concat(r);
    });
  } // Gets mediator attributes from treatment to outcome


  function getMediators(treatment, outcome) {
    // Return if no nodes or links
    if (nodelinks.nodes.length === 0 || nodelinks.links.length === 0) {
      return [];
    } // Return if no treatment and outcome variables indicated


    if (treatment === "" || outcome === "") {
      return [];
    } // console.log("getting mediators...");


    var t = nodelinks.nodes.filter(function (n) {
      return n.name === treatment;
    })[0];
    var oID = nodelinks.nodes.filter(function (n) {
      return n.name === outcome;
    })[0].id;
    var paths = hasOutcome(t, oID); // console.log(paths)

    if (paths.length === 0) {
      alert("There are no causal pathways from treatment to outcome.");
      return [];
    }

    var mediators = new Set();

    for (var _iterator13 = _createForOfIteratorHelperLoose(paths), _step13; !(_step13 = _iterator13()).done;) {
      var p = _step13.value;
      var med = new Set(p.filter(function (n) {
        return n.id !== t.id && n.id !== oID;
      }));
      mediators = new Set([].concat(mediators, med));
    } // console.log(mediators);


    return mediators;
  } // Get confounds that affect both treatments and outcomes


  function getConfounds(treatment, outcome) {
    // Return if no nodes or links
    if (nodelinks.nodes.length === 0 || nodelinks.links.length === 0) {
      // console.log('c1')
      return [];
    } // Return if no treatment and outcome variables indicated


    if (treatment === "" || outcome === "") {
      // console.log('c2')
      return [];
    }

    var confounds = [];

    var _loop6 = function _loop6() {
      var n = _step14.value;
      var nDescendents = new Set(getDescendents(n));
      var nodeDescendents = new Set(nodelinks.nodes.filter(function (nd) {
        return nDescendents.has(nd.id);
      }).map(function (nd) {
        return nd.name;
      }));

      if (nodeDescendents.has(treatment) && nodeDescendents.has(outcome)) {
        confounds.push(n);
      }
    };

    for (var _iterator14 = _createForOfIteratorHelperLoose(nodelinks.nodes), _step14; !(_step14 = _iterator14()).done;) {
      _loop6();
    } // console.log('c3', confounds);


    return confounds;
  }

  var theme = createTheme({
    palette: {
      grey: {
        light: grey[300],
        main: grey[500],
        dark: grey[700],
        contrastText: '#fff'
      }
    }
  });
  var bodyStyle = {
    "display": "flex"
  };
  var connectIcon = {
    "transform": "rotate(-45deg)"
  };
  var buttonStyle = {
    "marginBottom": "0px",
    "height": "48px",
    "& .MuiButtonBase-root": {
      "height": "48px"
    }
  };
  var menuStyle = {
    "display": "flex",
    "width": "100%",
    "alignItems": "center",
    "marginBottom": "20px"
  };
  var downloadStyle = {
    "marginLeft": "auto",
    "marginRight": "none"
  };
  var aStyle = {
    "height": "24px"
  };
  var divider = {
    "borderRight": "1px solid gray"
  };
  var searchStyle = {
    "height": "48px",
    "borderRadius": "24px",
    "marginLeft": "10px",
    "& .MuiOutlinedInput-input": {
      height: "12px"
    },
    "& .MuiOutlinedInput-root": {
      "padding": "11px"
    },
    "& .MuiInputLabel-formControl": {
      "top": "-1px"
    }
  };
  var customButtonStyle = {
    "height": "48px",
    "padding": "5px 11px",
    "marginLeft": "10px",
    "& .MuiButton-startIcon": {
      "margin": "0px"
    },
    "& .MuiSvgIcon-root": {
      "width": "24px",
      "height": "24px"
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: bodyStyle
  }, /*#__PURE__*/React.createElement(AttributesManager, {
    attributes: Object.keys(allAttributes),
    added: added,
    treatment: treatment,
    outcome: outcome,
    addAttribute: addAttribute,
    deleteAttribute: deleteAttribute,
    changeTreatment: changeTreatment,
    changeOutcome: changeOutcome,
    handleAddTag: handleAddTag,
    handleNodeOpen: handleNodeOpen
  }), /*#__PURE__*/React.createElement(DownloadDialog, {
    open: open,
    nodelinks: nodelinks,
    treatment: treatment,
    outcome: outcome,
    confounds: confounds,
    colliders: colliders,
    mediators: mediators,
    handleClose: handleClose
  }), /*#__PURE__*/React.createElement(NodeDialog, {
    open: addNode,
    handleNodeClose: handleNodeClose,
    addAttribute: addAttribute,
    addCustom: addCustom
  }), /*#__PURE__*/React.createElement(TagDialog, {
    tagNode: tagNode,
    tagColors: tagColors,
    attrTags: allAttributes[tagNode] ? allAttributes[tagNode]["tags"] : [],
    open: addTag,
    handleTagClose: handleTagClose,
    updateTag: updateTag,
    deleteTag: deleteTag
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: menuStyle
  }, /*#__PURE__*/React.createElement(ToggleButtonGroup, {
    style: buttonStyle,
    value: mode,
    exclusive: true,
    onChange: function onChange(e, val) {
      return toggleMode(e, val);
    },
    "aria-label": "text alignment"
  }, /*#__PURE__*/React.createElement(ToggleButton, {
    value: "default",
    alt: "select"
  }, /*#__PURE__*/React.createElement("a", {
    style: aStyle,
    title: "select"
  }, /*#__PURE__*/React.createElement(NearMeOutlinedIcon, null))), /*#__PURE__*/React.createElement(ToggleButton, {
    value: "path",
    alt: "edit links"
  }, /*#__PURE__*/React.createElement("a", {
    style: aStyle,
    title: "edit links"
  }, /*#__PURE__*/React.createElement(LinearScaleRoundedIcon, {
    style: connectIcon
  })))), /*#__PURE__*/React.createElement(Autocomplete, {
    disablePortal: true,
    id: "combo-box-demo",
    options: added.concat(Object.keys(tagColors).map(function (c) {
      return "tag:" + c;
    })),
    sx: {
      width: 300
    },
    onChange: function onChange(e, val) {
      return changeSearch(e, val);
    },
    renderInput: function renderInput(params) {
      return /*#__PURE__*/React.createElement(TextField, _extends({}, params, {
        sx: searchStyle,
        label: "Search"
      }));
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: downloadStyle
  }, /*#__PURE__*/React.createElement(IconButton, {
    id: "downloadSVG",
    onClick: function onClick() {
      return downloadSVG();
    }
  }, /*#__PURE__*/React.createElement("a", {
    style: aStyle,
    title: "save image"
  }, /*#__PURE__*/React.createElement(AddPhotoAlternateOutlinedIcon, null))), /*#__PURE__*/React.createElement(IconButton, {
    onClick: function onClick() {
      return handleClickOpen();
    }
  }, /*#__PURE__*/React.createElement("a", {
    style: aStyle,
    title: "download JSON"
  }, /*#__PURE__*/React.createElement(FileDownloadOutlinedIcon, null))))), /*#__PURE__*/React.createElement(Paper, {
    elevation: 0,
    variant: "outlined"
  }, /*#__PURE__*/React.createElement(DAGEditor, {
    layout: layout,
    nodelinks: nodelinks,
    mode: mode,
    treatment: treatment,
    outcome: outcome,
    mediators: mediators,
    colliders: colliders,
    confounds: confounds,
    search: search,
    updateNodePos: updateNodePos,
    deleteAttribute: deleteAttribute,
    changeTreatment: changeTreatment,
    changeOutcome: changeOutcome,
    updateLinks: updateLinks,
    deleteLinks: deleteLinks
  }))));
};