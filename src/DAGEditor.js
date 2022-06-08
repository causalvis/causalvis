import React, {useRef, useState, useEffect} from 'react'
import * as d3 from 'd3';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined';

export const DAGEditor = ({layout = {"height": 500, "width": 1000, "margin": 60}, nodelinks = [], mode = "default", treatment="", outcome="", updateNodePos, deleteAttribute, changeTreatment, changeOutcome, updateLinks, deleteLinks}) => {

  // const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [anchorPos, setAnchorPos] = React.useState(null);
  const [contextItem, setContextItem] = React.useState(null);
  // const [translate, setTranslate] = React.useState([0, 0]);
  // const [scale, setScale] = React.useState(1);
  const [transform, setTransform] = React.useState({});

  function handleClose() {
    setAnchorPos(null);
    setContextItem(null);
    setOpen(false);
  }

  function handleContextMenu(e, d) {
    e.preventDefault();
    setOpen(!open);
    setAnchorPos({"left": e.clientX + 2, "top": e.clientY - 6})
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
      // alert("Attribute is already set as outcome");
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
      // alert("Attribute is already set as treatment");
    } else {
      changeOutcome(contextItem);
      handleClose();
    }
  }

  function handleDelete() {
    deleteAttribute(contextItem);
    handleClose();
  }

  const ref = useRef('svgDAG');

  let currentPath = [];

  // nodelinks.links.forEach(d => {
  //   const linkSource = d.source;
  //   const linkTarget = d.target;
  //   d.source = nodelinks.nodes[linkSource];
  //   d.target = nodelinks.nodes[linkTarget];
  // });

  let svg = d3.select(ref.current)

  let svgElement = svg.select("g");

  function zoomed({transform}) {
    svgElement.attr("transform", transform);
  }

  const zoom = d3.zoom()
      .extent([[0, 0], [layout.width, layout.height]])
      .scaleExtent([0.1, 8])
      .on("zoom", zoomed);

  svg.call(zoom);

  // Reset zoom on click
  function resetZoom() {
    svg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity);
  }

  function getAngle(height, width, theta) {
    let angle;

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

  var arrowleft = svgElement
    .select("#links")
    .selectAll(".arrowleft")
    .data(nodelinks.links)
    .join("line")
      .attr("class", "arrowleft")
      .attr("x1", d => (d.target.x - d.source.x) / 2 + d.source.x)
      .attr("y1", d => (d.target.y - d.source.y) / 2 + d.source.y)
      .attr("x2", d => {
        let height = d.target.y - d.source.y;
        let width = d.target.x - d.source.x;

        let theta = Math.atan(Math.abs(height/width));
        let angle = getAngle(height, width, theta);

        return (d.target.x - d.source.x) / 2 + d.source.x + 10 * Math.cos(angle + Math.PI/5)
      })
      .attr("y2", d => {
        let height = (d.target.y - d.source.y)
        let width = (d.target.x - d.source.x)
        let theta = Math.atan(Math.abs(height/width));
        let angle = getAngle(height, width, theta);

        return (d.target.y - d.source.y) / 2 + d.source.y - 10 * Math.sin(angle + Math.PI/5)
      })
      .attr("stroke", "black")
      .attr("stroke-width", 1);

  var arrowright = svgElement
    .select("#links")
    .selectAll(".arrowright")
    .data(nodelinks.links)
    .join("line")
      .attr("class", "arrowright")
      .attr("x1", d => (d.target.x - d.source.x) / 2 + d.source.x)
      .attr("y1", d => (d.target.y - d.source.y) / 2 + d.source.y)
      .attr("x2", d => {
        let height = d.target.y - d.source.y;
        let width = d.target.x - d.source.x;

        let theta = Math.atan(Math.abs(height/width));
        let angle = getAngle(height, width, theta);

        return (d.target.x - d.source.x) / 2 + d.source.x + 10 * Math.cos(angle - Math.PI/5)
      })
      .attr("y2", d => {
        let height = (d.target.y - d.source.y)
        let width = (d.target.x - d.source.x)
        let theta = Math.atan(Math.abs(height/width));
        let angle = getAngle(height, width, theta);

        return (d.target.y - d.source.y) / 2 + d.source.y - 10 * Math.sin(angle - Math.PI/5)
      })
      .attr("stroke", "black")
      .attr("stroke-width", 1);

  function onDrag(el, e, d) {

    // console.log(d);

    // console.log(e.x, e.y, e);

    // Change position of node
    d3.select(el).attr("cx", e.x).attr("cy", e.y);

    // Change position of text
    text.filter(l => l.id === d.id).attr("x", e.x).attr("y", e.y);

    // Update endpoints of links
    link.filter(l => l.source.id === d.id).attr("x1", e.x).attr("y1", e.y);
    link.filter(l => l.target.id === d.id).attr("x2", e.x).attr("y2", e.y);

    // Update endpoints of direction arrows
    arrowleft.filter(l => l.target.id === d.id)
      .attr("x1", d => (e.x - d.source.x) / 2 + d.source.x)
      .attr("y1", d => (e.y - d.source.y) / 2 + d.source.y)
      .attr("x2", d => {
        let height = e.y - d.source.y;
        let width = e.x - d.source.x;

        let theta = Math.atan(Math.abs(height/width));
        let angle = getAngle(height, width, theta);

        return (e.x - d.source.x) / 2 + d.source.x + 10 * Math.cos(angle + Math.PI/5)
      })
      .attr("y2", d => {
        let height = (e.y - d.source.y)
        let width = (e.x - d.source.x)
        let theta = Math.atan(Math.abs(height/width));
        let angle = getAngle(height, width, theta);

        return (e.y - d.source.y) / 2 + d.source.y - 10 * Math.sin(angle + Math.PI/5)
      })

    arrowleft.filter(l => l.source.id === d.id)
      .attr("x1", d => (d.target.x - e.x) / 2 + e.x)
      .attr("y1", d => (d.target.y - e.y) / 2 + e.y)
      .attr("x2", d => {
        let height = d.target.y - e.y;
        let width = d.target.x - e.x;

        let theta = Math.atan(Math.abs(height/width));
        let angle = getAngle(height, width, theta);

        return (d.target.x - e.x) / 2 + e.x + 10 * Math.cos(angle + Math.PI/5)
      })
      .attr("y2", d => {
        let height = (d.target.y - e.y)
        let width = (d.target.x - e.x)
        let theta = Math.atan(Math.abs(height/width));
        let angle = getAngle(height, width, theta);

        return (d.target.y - e.y) / 2 + e.y - 10 * Math.sin(angle + Math.PI/5)
      })
      .attr("stroke", "black")
      .attr("stroke-width", 1);

    arrowright.filter(l => l.target.id === d.id)
      .attr("x1", d => (e.x - d.source.x) / 2 + d.source.x)
      .attr("y1", d => (e.y - d.source.y) / 2 + d.source.y)
      .attr("x2", d => {
        let height = e.y - d.source.y;
        let width = e.x - d.source.x;

        let theta = Math.atan(Math.abs(height/width));
        let angle = getAngle(height, width, theta);

        return (e.x - d.source.x) / 2 + d.source.x + 10 * Math.cos(angle - Math.PI/5)
      })
      .attr("y2", d => {
        let height = (e.y - d.source.y)
        let width = (e.x - d.source.x)
        let theta = Math.atan(Math.abs(height/width));
        let angle = getAngle(height, width, theta);

        return (e.y - d.source.y) / 2 + d.source.y - 10 * Math.sin(angle - Math.PI/5)
      })

      arrowright.filter(l => l.source.id === d.id)
      .attr("x1", d => (d.target.x - e.x) / 2 + e.x)
      .attr("y1", d => (d.target.y - e.y) / 2 + e.y)
      .attr("x2", d => {
        let height = d.target.y - e.y;
        let width = d.target.x - e.x;

        let theta = Math.atan(Math.abs(height/width));
        let angle = getAngle(height, width, theta);

        return (d.target.x - e.x) / 2 + e.x + 10 * Math.cos(angle - Math.PI/5)
      })
      .attr("y2", d => {
        let height = (d.target.y - e.y)
        let width = (d.target.x - e.x)
        let theta = Math.atan(Math.abs(height/width));
        let angle = getAngle(height, width, theta);

        return (d.target.y - e.y) / 2 + e.y - 10 * Math.sin(angle - Math.PI/5)
      })
      .attr("stroke", "black")
      .attr("stroke-width", 1);
  }

  var text = svgElement
    .select("#nodeNames")
    .selectAll(".nodeName")
    .data(nodelinks.nodes)
    .join("text")
    .attr("class", "nodeName")
    .text(d => d.name)
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    .attr("fill", d => d.name === treatment ? "#1976d2" : d.name === outcome ? "#f57c00" : "black")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")

  // Each line represents a link between attributes
  var link = svgElement
    .select("#links")
    .selectAll(".link")
    .data(nodelinks.links)
    .join("line")
      .attr("class", "link")
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .on("mouseover", function () {
        if (mode === "path") {
          d3.select(this).attr("stroke-width", 3);
          // d3.select(this).attr("stroke", "#1976d2").attr("stroke-width", 3);
        }
      })
      .on("mouseout", function () {
        if (mode === "path") {
          d3.select(this).attr("stroke", "black").attr("stroke-width", 1);
        }
      })
      .on("click", function(e, d) {
        if (mode === "path") {
          deleteLinks(d);
        }
      });

  // Each ellipse represents an attribute
  var node = svgElement
    .select("#nodes")
    .selectAll(".node")
    .data(nodelinks.nodes)
    .join("ellipse")
      .attr("class", "node")
      .attr("rx", 50)
      .attr("ry", 20)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("fill", "white")
      .attr("stroke", d => d.name === treatment ? "#1976d2" : d.name === outcome ? "#f57c00" : "black")
      .attr("stroke-width", 1)
      .attr("cursor", "pointer")
      .call(d3.drag()
        .on("start", function(e, d) {
        })
        .on("drag", function (e, d) {

          if (mode === "default") {
            // Adjust the position of a node
            onDrag(this, e, d);
          }

        })
        .on("end", function (e, d) {

          // Update the new position of the node
          if (mode === "default") {
            updateNodePos(d.id, e.x, e.y);
          }

        })
      )
      .on("click", function (e, d) {

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
        
      })
      .on("mouseover", function (e, d) {
        if (mode === "path") {
          d3.select(this).attr("stroke-width", 3);
        }
      })
      .on("mouseout", function (e, d) {
        if (mode === "path" && currentPath.map(cp => cp.name).indexOf(d.name) < 0) {
          d3.select(this).attr("stroke-width", 1);
        }
      })
      .on("contextmenu", (e, d) => handleContextMenu(e, d));

  const menuStyle = {};
  let aStyle = {"height":"24px"};

  return (
    <div>
      <Menu
        id="basic-menu"
        anchorReference="anchorPosition"
        anchorPosition={anchorPos}
        style={menuStyle}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleTreatment} selected={contextItem===treatment}>Set as Treatment</MenuItem>
        <MenuItem onClick={handleOutcome} selected={contextItem===outcome}>Set as Outcome</MenuItem>
        <MenuItem onClick={handleDelete}>Delete from Graph</MenuItem>
      </Menu>
      <IconButton id="fitScreen" onClick={() => resetZoom()}>
        <a style={aStyle} title="reset zoom">
          <FullscreenExitOutlinedIcon />
        </a>
      </IconButton>
      <svg width={layout.width} height={layout.height} ref={ref} id="svgDAG">
        <g>
          <g id="links" />
          <g id="nodes" />
          <g id="nodeNames" />
        </g>
      </svg>
    </div>
  )
}