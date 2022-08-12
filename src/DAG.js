import React, {useState, useEffect} from 'react';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey, blue, orange } from '@mui/material/colors';

import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';

import { AttributesManager } from './CausalStructure/AttributesManager';
import { DAGEditor } from './CausalStructure/DAGEditor';
import { DownloadDialog } from './CausalStructure/DownloadDialog';
import { TagDialog } from './CausalStructure/TagDialog'
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
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import ControlPointDuplicateOutlinedIcon from '@mui/icons-material/ControlPointDuplicateOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import LinearScaleRoundedIcon from '@mui/icons-material/LinearScaleRounded';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import SearchIcon from '@mui/icons-material/Search';

import { saveAs } from 'file-saver';

export const DAG = ({attributes = [], graph, _svg="svgDAG", _dag, _colliders, _mediators, _confounds, _prognostics}) => {

  // Tracks nodes and links in DAG
  const [nodelinks, setnodelinks] = React.useState({"nodes": [], "links":[]});

  // Tracks current editor mode
  const [mode, setMode] = React.useState('default');

  // Controls whether download dialog is open
  const [open, setOpen] = React.useState(false);

  // Controls whether add node dialog is open
  const [addNode, setAddNode] = React.useState(false);

  // Controls whether add tag dialog is open
  const [addTag, setAddTag] = React.useState(false);
  const [tagNode, setTagNode] = React.useState();
  const [tagColors, setTagColors] = React.useState({});

  // Tracks search item
  const [search, setSearch] = React.useState("");

  // Tracks colliders, mediators, confounds, and prognostic factors in DAG
  const [colliders, setColliders] = React.useState([]);
  const [mediators, setMediators] = React.useState([]);
  const [confounds, setConfounds] = React.useState([]);
  const [prognostics, setPrognostics] = React.useState([]);

  // Track attributes
  const [allAttributes, setAllAttributes] = React.useState({});
  // Tracks attributes added to DAG
  const [added, setAdded] = React.useState([]);

  // Tracks treatment and outcome attributes
  const [treatment, setTreatment] = React.useState("");
  const [outcome, setOutcome] = React.useState("");

  // Tracks all descendants for a node
  const [allDescendants, setAllDescendants] = React.useState({});

  // All IDs used
  const [ID, setID] = React.useState(new Set());

  const layout = {"height": 500, "width": 1000, "margin": 60};

  function generateID() {
    return (new Date()).getTime() + Math.floor(Math.random() * 98);
  }

  function loadGraph(graph) {

    var xScale = scaleLinear()
          .domain(extent(graph.nodes, d => d.x))
          .range([layout.margin, layout.width - layout.margin])

    var yScale = scaleLinear()
          .domain(extent(graph.nodes, d => d.y))
          .range([layout.margin, layout.height - layout.margin])

    let newnodelinks = JSON.parse(JSON.stringify(graph));

    let nodes = newnodelinks.nodes;
    let links = newnodelinks.links;

    let newID = new Set();
    let newAllAttributes = {};

    for (let n of nodes) {
      if (!n.id) {
        let id = generateID();

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

      newAllAttributes[n.name] = {"$custom": false, "tags": []};
    }

    setID(newID);
    setAllAttributes(newAllAttributes);
    setAdded(Object.keys(newAllAttributes));

    for (let l of links) {
      let s = l.source.name ? l.source.name : l.source;
      let t = l.target.name ? l.target.name : l.target;

      let sourceNode = nodes.filter(n => n.name === s)[0];
      let targetNode = nodes.filter(n => n.name === t)[0];

      sourceNode.children.add(targetNode.id);
      targetNode.parents.add(sourceNode.id);

      l.source = {...nodes.filter(n => n.name === s)[0]};
      l.target = {...nodes.filter(n => n.name === t)[0]};

      delete l.source.children;
      delete l.source.parents;

      delete l.target.children;
      delete l.target.parents;
    }

    return newnodelinks
  }

  useEffect(() => {
    if (graph) {
      let newnodelinks = loadGraph(graph);
      setnodelinks(newnodelinks);

      let hidden = document.getElementById(_dag);
      let nodelink_string = JSON.stringify(newnodelinks);

      if (hidden) {
        hidden.value = nodelink_string;
        var event = document.createEvent('HTMLEvents');
        event.initEvent('input', false, true);
        hidden.dispatchEvent(event);
      }
    }
  }, [graph]);

  // If attributes are provided without an accompanying graph set attributes only
  useEffect(() => {
    if (attributes && attributes.length > 0 && !graph) {
      let newAllAttributes = {}
      for (let a of attributes) {
        newAllAttributes[a] = {"$custom": false, "tags": []}
      }

      setAllAttributes(newAllAttributes);
    }
  }, [attributes]);

  function updateJupyter(jdag, jcolliders, jmediators, jconfounds, jprognostics) {
    let hidden = document.getElementById(_dag);
    let nodelinks_string = JSON.stringify(jdag);

    let jupyter_colliders = document.getElementById(_colliders);
    let jupyter_mediators = document.getElementById(_mediators);
    let jupyter_confounds = document.getElementById(_confounds);
    let jupyter_prognostics = document.getElementById(_prognostics);

    if (hidden) {
      hidden.value = nodelinks_string;
      var event = document.createEvent('HTMLEvents');
      event.initEvent('input', false, true);
      hidden.dispatchEvent(event);
    }

    if (jupyter_colliders) {
      jupyter_colliders.value = JSON.stringify(jcolliders);
      var event = document.createEvent('HTMLEvents');
      event.initEvent('input', false, true);
      jupyter_colliders.dispatchEvent(event);
    }

    if (jupyter_mediators) {
      jupyter_mediators.value = JSON.stringify(jmediators);
      var event = document.createEvent('HTMLEvents');
      event.initEvent('input', false, true);
      jupyter_mediators.dispatchEvent(event);
    }

    if (jupyter_confounds) {
      jupyter_confounds.value = JSON.stringify(jconfounds);
      var event = document.createEvent('HTMLEvents');
      event.initEvent('input', false, true);
      jupyter_confounds.dispatchEvent(event);
    }

    if (jupyter_prognostics) {
      jupyter_prognostics.value = JSON.stringify(jprognostics);
      var event = document.createEvent('HTMLEvents');
      event.initEvent('input', false, true);
      jupyter_prognostics.dispatchEvent(event);
    }
  }

  // When treatment and outcome variables are changed
  // Or when the graph is updated
  // Recalculate mediators, colliders, and confounds
  useEffect(() => {

    // Check that both treatment and outcome have been indicated
    if (treatment.length > 0 && outcome.length > 0) {
      let newColliders = Array.from(getColliders(treatment, outcome));
      let colliderNames = [];

      for (let c of newColliders) {
        colliderNames.push(nodelinks.nodes.filter(n => n.id === c)[0].name);
      }

      let newMediators = Array.from(getMediators(treatment, outcome));
      let newConfounds = getConfounds(treatment, outcome);
      let newPrognostics = getPrognostics(treatment, outcome, newMediators.map(m => m.id), newConfounds.map(c => c.id));

      setColliders(colliderNames);
      setMediators(newMediators.map(m => m.name));
      setConfounds(newConfounds.map(c => c.name));
      setPrognostics(newPrognostics.map(p => p.name));

      updateJupyter(nodelinks, colliderNames, newMediators, newConfounds, newPrognostics);
      
    } else {
      // If either treatment or outcome is missing,
      // Set all variable types to empty
      setColliders([]);
      setMediators([]);
      setConfounds([]);
      setPrognostics([]);

      updateJupyter(nodelinks, [], [], [], []);

    }
  }, [treatment, outcome, nodelinks]);

  // Add new attribute to the DAG
  function addAttribute(val, custom=false, x=layout.width/2, y=layout.height/2) {

    let index = added.indexOf(val);

    if (index < 0) {
      const id = generateID();
      const newnodelinks = {"nodes": [...nodelinks.nodes, {"x": x,
                                                          "y": y,
                                                          "id": id,
                                                          "name": val,
                                                          "parents": new Set(),
                                                          "children": new Set(),
                                                          "$custom": allAttributes[val] ? allAttributes[val]["$custom"] : custom,
                                                          "tags": allAttributes[val] ? allAttributes[val]["tags"] : []}],
                            "links": [...nodelinks.links]};
      
      setnodelinks(newnodelinks);
      setAdded([...added, val]);
    }
  }

  function addCustom(val) {
    let newAllAttributes = JSON.parse(JSON.stringify(allAttributes));
    newAllAttributes[val] = {"$custom": true, "tags": []};
    setAllAttributes(newAllAttributes);
    
    addAttribute(val, true);
  }

  // Delete an attribute from the DAG
  function deleteAttribute(val) {
    let index = added.indexOf(val);

    added.splice(index, 1);
    setAdded([...added]);

    let newNodes = nodelinks.nodes.filter(n => n.name !== val);
    let newLinks = nodelinks.links.filter(l => l.target.name !== val && l.source.name !== val);

    setnodelinks({"nodes": [...newNodes], "links": [...newLinks]});

    // If deleted attribute is treatment, set treatment to null
    if (val === treatment) {
      setTreatment("");
    }

    // If deleted attribute is outcome, set outcome to null
    if (val === outcome) {
      setOutcome("");
    }
  }

  // Set an attribute as the treatment of interest
  function changeTreatment(attribute) {
    setTreatment(attribute);
  }

  // Set an attribute as the outcome of interest
  function changeOutcome(attribute) {
    setOutcome(attribute);
  }

  // Set search item
  function changeSearch(e, val) {
    setSearch(val);
  }

  // Update tags for an attribute
  function updateTag(color, tagName) {
    // If attribute already has a tag, do not add the tag again
    if (allAttributes[tagNode]["tags"] && allAttributes[tagNode]["tags"].indexOf(tagName) >= 0) {
      return;
    }

    // Update nodelink diagram
    let newnodelinks = { ...nodelinks };
    let taggingNode = newnodelinks.nodes.filter(n => n.name === tagNode)[0];
    if (!taggingNode.tags) {
      taggingNode.tags = [tagName];
    } else {
      taggingNode.tags.push(tagName);
    }

    setnodelinks(newnodelinks);

    // Update attributes
    let newAllAttributes = JSON.parse(JSON.stringify(allAttributes));
    newAllAttributes[tagNode]["tags"].push(tagName);
    setAllAttributes(newAllAttributes);

    // Update dictionary of tag colors
    tagColors[tagName] = color;
    setTagColors({...tagColors});
  }

  // Delete tags for an attribute
  function deleteTag(tagName) {
    // Update nodelink diagram
    let newnodelinks = { ...nodelinks };
    let taggingNode = newnodelinks.nodes.filter(n => n.name === tagNode)[0];

    let tagIndex = taggingNode.tags.indexOf(tagName);
    taggingNode.tags.splice(tagIndex, 1);

    setnodelinks(newnodelinks);

    // Update attributes
    let newAllAttributes = JSON.parse(JSON.stringify(allAttributes));
    tagIndex = newAllAttributes[tagNode]["tags"].indexOf(tagName);
    newAllAttributes[tagNode]["tags"].splice(tagIndex, 1);
    setAllAttributes(newAllAttributes);
  }

  // Update node position after dragging
  function updateNodePos(id, newX, newY) {
    let newnodelinks = { ...nodelinks };
    for (let n of newnodelinks.nodes) {
      if (n.id === id) {
        n.x = newX;
        n.y = newY;
        break;
      }
    }

    for (let l of newnodelinks.links) {
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
  }

  // Returns true of acyclic
  function checkAcyclic(source, target) {
    let targetDesc = new Set(getDescendents(target));

    if (targetDesc.has(source.id)) {
      alert("This link cannot be added. The DAG must be acyclic.");
      return false
    } else {
      return true
    }
  }

  // Add new links between nodes
  function updateLinks(newLink) {

    // Ensure that there is only one link between any 2 nodes
    for (let l of nodelinks.links) {
      if ((l.source.id === newLink[0].id && l.target.id === newLink[1].id) || (l.target.id === newLink[0].id && l.source.id === newLink[1].id)) {
        return;
      }
    }

    if (!checkAcyclic(newLink[0], newLink[1])) {
      return;
    }

    // Update parent and child relationships
    for (let n of nodelinks.nodes) {
      if (n.id === newLink[0].id) {
        n.children.add(newLink[1].id)
      } else if (n.id === newLink[1].id) {
        n.parents.add(newLink[0].id)
      }
    }

    let newLinkCopy = JSON.parse(JSON.stringify(newLink));

    delete newLinkCopy[0].parents;
    delete newLinkCopy[0].children;

    delete newLinkCopy[1].parents;
    delete newLinkCopy[1].children;

    const newnodelinks = {"nodes": [...nodelinks.nodes], "links": [...nodelinks.links, {"source": newLinkCopy[0], "target": newLinkCopy[1]}]};
    setnodelinks(newnodelinks);
  }

  // Delete links between nodes
  function deleteLinks(link) {

    const newlinks = nodelinks.links.filter(l => !(l.source.id === link.source.id && l.target.id === link.target.id))

    // Update parent and child relationships
    for (let n of nodelinks.nodes) {
      if (n.id === link.source.id) {
        n.children.delete(link.target.id)
      } else if (n.id === link.target.id) {
        n.parents.delete(link.source.id)
      }
    }

    const newnodelinks = {"nodes": [...nodelinks.nodes], "links": [...newlinks]};
    setnodelinks(newnodelinks)
  }

  // Switch between layout and path editor
  function toggleMode(e, val) {
    setMode(val);
  }

  // Open and close download dialog
  const handleClickOpen = () => {
    let newColliders = getColliders(treatment, outcome);
    let colliderNames = []

    for (let c of newColliders) {
      colliderNames.push(nodelinks.nodes.filter(n => n.id === c)[0].name)
    }

    let newMediators = Array.from(getMediators(treatment, outcome));
    let newConfounds = getConfounds(treatment, outcome);
    let newPrognostics = getPrognostics(treatment, outcome, newMediators.map(m => m.id), newConfounds.map(c => c.id));

    setColliders(colliderNames);
    setMediators(newMediators.map(m => m.name));
    setConfounds(newConfounds.map(c => c.name));
    setPrognostics(newPrognostics.map(p => p.name));

    setOpen(true);
  };

  // Close download dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Open and close node add dialog
  const handleNodeOpen = () => {
    setAddNode(true);
  };

  // Close add node dialog
  const handleNodeClose = () => {
    setAddNode(false);
  };

  // Open and close tag add dialog
  const handleTagOpen = () => {
    setAddTag(true);
  };

  // Close add tag dialog
  const handleTagClose = () => {
    setAddTag(false);
  };

  const handleAddTag = (value) => {
    setTagNode(value);
    handleTagOpen();
  }

  // Download DAG as PNG image
  function downloadSVG() {
    let svgElement = select(`#${_svg}`);
    var svgString = getSVGString(svgElement.node());
    svgString2Image( svgString, 2*layout.width, 2*layout.height, 'png', save ); // passes Blob and filesize String to the callback

    function save( dataBlob, filesize ){
      saveAs( dataBlob, 'DAG.png' ); // FileSaver.js function
    }
  }

  // Below are the functions that handle actual exporting:
  // getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
  // The functions are modified from http://bl.ocks.org/rokotyan/0556f8facbaf344507cdc45dc3622177
  function getSVGString( svgNode ) {
    svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');

    var serializer = new XMLSerializer();
    var svgString = serializer.serializeToString(svgNode);
    svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
    svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

    return svgString;
  }


  function svgString2Image( svgString, width, height, format, callback ) {
    var format = format ? format : 'png';

    var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL

    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    var image = new Image();
    image.onload = function() {
      context.clearRect ( 0, 0, width, height );
      context.drawImage(image, 0, 0, width, height);

      canvas.toBlob( function(blob) {
        var filesize = Math.round( blob.length/1024 ) + ' KB';
        if ( callback ) callback( blob, filesize );
      });

      
    };

    image.src = imgsrc;
  }

  // Gets all descendents of a particular node
  // The same descendent may be included twice if there are multiple causal pathways
  // For unique descendents, apply Set() to the result
  function getDescendents(node, stopID = null) {
    if (node.id === stopID) {
      return [];
    }

    let result = Array.from(node.children);
    for (let c of node.children) {
      let nodeC = nodelinks.nodes.filter(n => n.id === c)[0];
      result = result.concat(getDescendents(nodeC, stopID));
    }

    return result;
  }

  // Gets prognostic factors, i.e. covariates that influence the outcome but not the treatment
  function getPrognostics(treatment, outcome, mediators=[], confounds=[]) {
    // Return if no nodes or links
    if (nodelinks.nodes.length === 0 || nodelinks.links.length === 0) {
      return [];
    }

    // Return if no treatment and outcome variables indicated
    if (treatment === "" || outcome === "") {
      return [];
    }

    let treatmentID = nodelinks.nodes.filter(n => n.name === treatment)[0].id;
    let outcomeID = nodelinks.nodes.filter(n => n.name === outcome)[0].id;

    let allPrognostic = [];

    for (let n of nodelinks.nodes) {

      let isMediator = mediators.indexOf(n.id) >= 0;
      let isConfound = confounds.indexOf(n.id) >= 0;

      let childrenHasOutcome = n.children.has(outcomeID);
      let childrenHasTreatment = n.children.has(treatmentID);

      if (childrenHasOutcome && !childrenHasTreatment && !isMediator && !isConfound) {
        allPrognostic.push(n);
      }
    }

    return allPrognostic;
  }

  // Gets the collider attributes between treatment and outcome
  function getColliders(treatment, outcome) {
    // Return if no nodes or links
    if (nodelinks.nodes.length === 0 || nodelinks.links.length === 0) {
      return [];
    }

    // Return if no treatment and outcome variables indicated
    if (treatment === "" || outcome === "") {
      return [];
    }

    let t = nodelinks.nodes.filter(n => n.name === treatment)[0];
    let o = nodelinks.nodes.filter(n => n.name === outcome)[0];

    let treatmentChildren = getDescendents(t, o.id);
    let outcomeChildren = new Set(getDescendents(o));

    let colliders = new Set([...treatmentChildren].filter(x => outcomeChildren.has(x)))

    return colliders;
  }

  // Gets descendents of a node that is on a path to the outcome
  function hasOutcome(node, outcomeID) {
    if (node.id === outcomeID) {
      return [node];
    }

    if (node.id !== outcomeID && node.children.size === 0) {
      return [];
    }

    let result = [];

    for (let c of node.children) {
      let nodeC = nodelinks.nodes.filter(n => n.id === c)[0];
      let nodeResult = hasOutcome(nodeC, outcomeID);
      if (nodeResult.length > 0) {
        result = result.concat(nodeResult);
      }
    }

    return result.map(r => [node].concat(r));
  }

  // Gets mediator attributes from treatment to outcome
  function getMediators(treatment, outcome) {
    // Return if no nodes or links
    if (nodelinks.nodes.length === 0 || nodelinks.links.length === 0) {
      return [];
    }

    // Return if no treatment and outcome variables indicated
    if (treatment === "" || outcome === "") {
      return [];
    }

    let t = nodelinks.nodes.filter(n => n.name === treatment)[0];
    let oID = nodelinks.nodes.filter(n => n.name === outcome)[0].id;

    let paths = hasOutcome(t, oID);

    let mediators = []

    for (let p of paths) {
      let med = p.filter(n => n.id !== t.id && n.id !== oID);
      mediators = mediators.concat(med);
    }

    return new Set(mediators);
  }

  // Get confounds that affect both treatments and outcomes
  function getConfounds(treatment, outcome) {
    // Return if no nodes or links
    if (nodelinks.nodes.length === 0 || nodelinks.links.length === 0) {
      return [];
    }

    // Return if no treatment and outcome variables indicated
    if (treatment === "" || outcome === "") {
      return [];
    }

    let confounds = [];
    let treatmentID = nodelinks.nodes.filter(n => n.name === treatment)[0].id;

    for (let n of nodelinks.nodes) {
      let nDescendents = new Set(getDescendents(n, treatmentID));
      let nodeDescendents = new Set(nodelinks.nodes.filter(nd => nDescendents.has(nd.id)).map(nd => nd.name));

      if (nodeDescendents.has(treatment) && nodeDescendents.has(outcome)) {
        confounds.push(n);
      }
    }

    return confounds;
  }

  const theme = createTheme({
    palette: {
      grey: {
        light: grey[300],
        main: grey[500],
        dark: grey[700],
        contrastText: '#fff',
      },
    },
  });

  let bodyStyle = {"display": "flex"};
  let connectIcon = {"transform": "rotate(-45deg)"};
  let buttonStyle = {"marginBottom": "0px",
                     "height":"48px",
                     "& .MuiButtonBase-root":{"height":"48px"},};
  let menuStyle = {"display": "flex",
                  "width": "100%",
                  "alignItems": "center",
                  "marginBottom": "20px"};
  let downloadStyle = {"marginLeft": "auto", "marginRight": "none"};
  let aStyle = {"height":"24px"};
  let divider = {"borderRight": "1px solid gray"};
  let searchStyle = {"height": "48px",
                    "borderRadius": "24px",
                    "marginLeft": "10px",
                    "& .MuiOutlinedInput-input": { height: "12px" },
                    "& .MuiOutlinedInput-root": { "padding": "11px" },
                    "& .MuiInputLabel-formControl": { "top": "-1px"}};
  let customButtonStyle = {"height":"48px",
                           "padding":"5px 11px",
                           "marginLeft": "10px",
                           "& .MuiButton-startIcon":{"margin":"0px"},
                           "& .MuiSvgIcon-root": {"width":"24px", "height": "24px"}};

  return (
    <div style={bodyStyle}>
      <AttributesManager
        attributes={Object.keys(allAttributes)}
        added={added}
        treatment={treatment}
        outcome={outcome}
        addAttribute={addAttribute}
        deleteAttribute={deleteAttribute}
        changeTreatment={changeTreatment}
        changeOutcome={changeOutcome}
        handleAddTag={handleAddTag}
        handleNodeOpen={handleNodeOpen} />
      <DownloadDialog
        open={open}
        nodelinks={nodelinks}
        treatment={treatment}
        outcome={outcome}
        confounds={confounds}
        colliders={colliders}
        mediators={mediators}
        prognostics={prognostics}
        handleClose={handleClose} />
      <NodeDialog
        open={addNode}
        handleNodeClose={handleNodeClose}
        addAttribute={addAttribute}
        addCustom={addCustom} />
      <TagDialog
        tagNode={tagNode}
        tagColors={tagColors}
        attrTags={allAttributes[tagNode] ? allAttributes[tagNode]["tags"] : []}
        open={addTag}
        handleTagClose={handleTagClose}
        updateTag={updateTag}
        deleteTag={deleteTag} />
      <div>
        <div style={menuStyle}>
          <ToggleButtonGroup
            style={buttonStyle}
            value={mode}
            exclusive
            onChange={(e, val) => toggleMode(e, val)}
            aria-label="text alignment">
            <ToggleButton value="default" alt="select">
              <a style={aStyle} title="select">
                <NearMeOutlinedIcon />
              </a>
            </ToggleButton>
            <ToggleButton value="path" alt="edit links">
              <a style={aStyle} title="edit links">
                <LinearScaleRoundedIcon style={connectIcon} />
              </a>
            </ToggleButton>
            {/*<ToggleButton value="node" alt="custom node" onClick={() => handleNodeOpen()}>
              <a title="custom node">
                <ControlPointDuplicateOutlinedIcon />
              </a>
            </ToggleButton>*/}
          </ToggleButtonGroup>

          {/*<ThemeProvider theme={theme}>
            <ButtonGroup variant="text" aria-label="text button group">
              <Button
                variant="outlined"
                startIcon={<ControlPointDuplicateOutlinedIcon />}
                onClick={() => handleNodeOpen()}
                color={"grey"}
                sx={customButtonStyle}>
              </Button>
            </ButtonGroup>
          </ThemeProvider>*/}

          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={added.concat(Object.keys(tagColors).map(c => "tag:" + c))}
            sx={{ width: 300 }}
            onChange={(e, val) => changeSearch(e, val)}
            renderInput={(params) =>
              <TextField
                {...params}
                sx={searchStyle}
                label="Search"
              />}
          />

          <div style={downloadStyle}>
            <IconButton id="downloadSVG" onClick={() => downloadSVG()}>
              <a style={aStyle} title="save image">
                <AddPhotoAlternateOutlinedIcon />
              </a>
            </IconButton>
            <IconButton onClick={() => handleClickOpen()}>
              <a style={aStyle} title="download JSON">
                <FileDownloadOutlinedIcon />
              </a>
            </IconButton>
        </div>
        </div>
        <Paper elevation={0} variant="outlined">
          <DAGEditor
            layout={layout}
            nodelinks={nodelinks}
            mode={mode}
            treatment={treatment}
            outcome={outcome}
            mediators={mediators}
            colliders={colliders}
            confounds={confounds}
            prognostics={prognostics}
            search={search}
            updateNodePos={updateNodePos}
            deleteAttribute={deleteAttribute}
            changeTreatment={changeTreatment}
            changeOutcome={changeOutcome}
            updateLinks={updateLinks}
            deleteLinks={deleteLinks}
            _svg={_svg}
          />
        </Paper>
      </div>
    </div>
  )
}