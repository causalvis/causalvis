import React, {useRef, useState} from 'react'
import * as d3 from 'd3';
import { saveAs } from 'file-saver';

export const DAGEditor = ({layout = {"height": 500, "width": 1000, "margin": 60}, nodelinks = [], mode = "default", updateNodePos, updateLinks, deleteLinks}) => {

  const ref = useRef('scatterplot');

  let currentPath = [];

  // nodelinks.links.forEach(d => {
  //   const linkSource = d.source;
  //   const linkTarget = d.target;
  //   d.source = nodelinks.nodes[linkSource];
  //   d.target = nodelinks.nodes[linkTarget];
  // });

  let svgElement = d3.select(ref.current)

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

    // Change position of node
    d3.select(el).attr("cx", e.x).attr("cy", e.y);

    // Change position of text
    text.filter(l => l === d).attr("x", e.x).attr("y", e.y);

    // Update endpoints of links
    link.filter(l => l.source === d).attr("x1", e.x).attr("y1", e.y);
    link.filter(l => l.target === d).attr("x2", e.x).attr("y2", e.y);

    // Update endpoints of direction arrows
    arrowleft.filter(l => l.target === d)
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

    arrowleft.filter(l => l.source === d)
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

    arrowright.filter(l => l.target === d)
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

      arrowright.filter(l => l.source === d)
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
          d3.select(this).attr("stroke", "#1976d2").attr("stroke-width", 3);
        }
      })
      .on("mouseout", function () {
        if (mode === "path") {
          d3.select(this).attr("stroke", "black").attr("stroke-width", 1);
        }
      })
      .on("click", function(e, d) {
        deleteLinks(d);
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
      .attr("stroke", "black")
      .attr("stroke-width", "1px")
      .attr("cursor", "pointer")
      .call(d3.drag()
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

        if (mode === "path") {

          if (currentPath.length === 1 && d.id === currentPath[0].id) {
            return;
          }

          currentPath.push(d);

          if (currentPath.length === 2) {
            updateLinks(currentPath);
            currentPath = [];
          }
        }
        
      })
      .on("mouseover", function () {
        if (mode === "path") {
          d3.select(this).attr("stroke", "#1976d2").attr("stroke-width", 3);
        }
      })
      .on("mouseout", function () {
        if (mode === "path") {
          d3.select(this).attr("stroke", "black").attr("stroke-width", 1);
        }
      });

  return (
    <div>
      <svg width={layout.width} height={layout.height} ref={ref} id="svgDAG">
        <g id="links" />
        <g id="nodes" />
        <g id="nodeNames" />
        <g id="x-axis" />
        <g id="y-axis" />
      </svg>
    </div>
  )
}