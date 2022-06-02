import React, {useState} from 'react';
import { select } from 'd3-selection';

import { DAGEditor } from './DAGEditor';
import { AttributesManager } from './AttributesManager';
import { DownloadDialog } from './DownloadDialog';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
// import SyncAltIcon from '@mui/icons-material/SyncAlt';
import LinearScaleRoundedIcon from '@mui/icons-material/LinearScaleRounded';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
// import MovingOutlinedIcon from '@mui/icons-material/MovingOutlined';
// import * as d3 from 'd3';

export const DAG = ({dataset = [], attributes = []}) => {
  const [nodelinks, setnodelinks] = React.useState({"nodes": [], "links":[]});
  const [mode, setMode] = React.useState('default');
  const [open, setOpen] = React.useState(false);
  const [colliders, setColliders] = React.useState([]);
  const [mediators, setMediators] = React.useState([]);
  const [added, setAdded] = React.useState([]);
  // const [attr, setAttr] = React.useState(attributes);
  // const [index, setIndex] = React.useState(0);

  const layout = {"height": 500, "width": 1000, "margin": 60};

  function addAttribute(val) {
    // console.log(val);

    let index = added.indexOf(val);

    if (index < 0) {
      // Add new attribute
      const id = (new Date()).getTime() + Math.floor(Math.random() * 98);
      const newnodelinks = {"nodes": [...nodelinks.nodes, {"x": 200,
                                                          "y": 200,
                                                          "id": id,
                                                          "name": val,
                                                          "parents": new Set(),
                                                          "children": new Set()}],
                            "links": [...nodelinks.links]};
      
      setnodelinks(newnodelinks);
      setAdded([...added, val]);
    } else {
      // Remove attribute and any connected links
      added.splice(index, 1);
      setAdded([...added]);

      let newNodes = nodelinks.nodes.filter(n => n.name !== val);
      let newLinks = nodelinks.links.filter(l => l.target.name !== val && l.source.name !== val);

      setnodelinks({"nodes": [...newNodes], "links": [...newLinks]});
    }
    
  }

  // Update node position after dragging
  function updateNodePos(id, newX, newY) {
    let newnodelinks = { ...nodelinks };
    for (let n of nodelinks.nodes) {
      if (n.id === id) {
        n.x = newX;
        n.y = newY;
        break;
      }
    }

    setnodelinks(newnodelinks);
  }

  // Add new links between nodes
  function updateLinks(newLink) {

    // Ensure that there is only one link between any 2 nodes
    for (let l of nodelinks.links) {
      if ((l.source.id === newLink[0].id && l.target.id === newLink[1].id) || (l.target.id === newLink[0].id && l.source.id === newLink[1].id)) {
        return;
      }
    }

    // Update parent and child relationships
    for (let n of nodelinks.nodes) {
      if (n.id === newLink[0].id) {
        n.children.add(newLink[1].id)
      } else if (n.id === newLink[1].id) {
        n.parents.add(newLink[0].id)
      }
    }

    const newnodelinks = {"nodes": [...nodelinks.nodes], "links": [...nodelinks.links, {"source": newLink[0], "target": newLink[1]}]};
    // console.log(newnodelinks);
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
    // console.log(newnodelinks);
    setnodelinks(newnodelinks)
  }

  // Switch between layout and path editor
  function toggleMode(e, val) {
    setMode(val);
  }

  // Open and close download dialog
  const handleClickOpen = () => {
    let newColliders = getColliders('age', 're78');
    let colliderNames = []

    for (let c of newColliders) {
      colliderNames.push(nodelinks.nodes.filter(n => n.id === c)[0].name)
    }

    setColliders(colliderNames);
    setMediators(Array.from(getMediators('age', 're78')).map(m => m.name));
    // console.log(getMediators('age', 're78'))
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Download DAG as PNG image
  function downloadSVG() {
    // console.log('saving...');
    let svgElement = select("#svgDAG")
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
  function getDescendents(node) {
    // console.log(node, node["children"])
    let result = Array.from(node.children);
    for (let c of node.children) {
      let nodeC = nodelinks.nodes.filter(n => n.id === c)[0];
      result = result.concat(getDescendents(nodeC));
    }

    return result;
  }

  // Gets the collider attributes between treatment and outcome
  function getColliders(treatment, outcome) {
    // Return if no nodes or links
    if (nodelinks.nodes.length === 0 || nodelinks.links.length === 0) {
      return [];
    }

    // console.log("getting colliders...");
    let t = nodelinks.nodes.filter(n => n.name === treatment)[0];
    let o = nodelinks.nodes.filter(n => n.name === outcome)[0];

    let treatmentChildren = new Set(getDescendents(t));
    let outcomeChildren = new Set(getDescendents(o));

    let colliders = new Set([...treatmentChildren].filter(x => outcomeChildren.has(x)))

    return colliders;
  }

  // Gets descendents of a node that is on a path to the outcome
  function hasOutcome(node, outcomeID) {
    // console.log(node, node.children);
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

    // console.log("getting mediators...");
    let t = nodelinks.nodes.filter(n => n.name === treatment)[0];
    let oID = nodelinks.nodes.filter(n => n.name === outcome)[0].id;

    let paths = hasOutcome(t, oID);

    let mediators = new Set()

    for (let p of paths) {
      let med = new Set(p.filter(n => n.id !== t.id && n.id !== oID))
      mediators = new Set([...mediators, ...med])
    }

    // console.log(mediators);

    return mediators;
  }

  let bodyStyle = {"display": "flex"};
  let connectIcon = {"transform": "rotate(-45deg)"};
  let buttonStyle = {"margin-bottom": "0px"};
  let menuStyle = {"display": "flex",
                  "width": "100%",
                  "align-items": "center",
                  "margin-bottom": "20px"};
  let downloadStyle = {"margin-left": "auto", "margin-right": "none"}

  return (
    <div style={bodyStyle}>
      <AttributesManager attributes={attributes} added={added} addAttribute={addAttribute} />
      <DownloadDialog
        open={open}
        nodelinks={nodelinks}
        colliders={colliders}
        mediators={mediators}
        handleClose={handleClose} />
      <div>
        <div style={menuStyle}>
          <ToggleButtonGroup
            style={buttonStyle}
            value={mode}
            exclusive
            onChange={(e, val) => toggleMode(e, val)}
            aria-label="text alignment">
            <ToggleButton value="default" alt="move">
              <a title="move">
                <NearMeOutlinedIcon />
              </a>
            </ToggleButton>
            <ToggleButton value="path" alt="connect">
              <a title="edit links">
                <LinearScaleRoundedIcon style={connectIcon} />
              </a>
            </ToggleButton>
          </ToggleButtonGroup>
          <div style={downloadStyle}>
            <IconButton id="downloadSVG" onClick={() => downloadSVG()}>
              <a title="save image">
                <AddPhotoAlternateOutlinedIcon />
              </a>
            </IconButton>
            <IconButton onClick={() => handleClickOpen()}>
              <a title="download JSON">
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
            updateNodePos={updateNodePos}
            updateLinks={updateLinks}
            deleteLinks={deleteLinks}
          />
        </Paper>
      </div>
    </div>
  )
}