import React, {useState, useEffect} from "react";
import { scaleOrdinal } from "d3-scale";
import { schemePuBuGn, schemeSpectral, schemeYlGnBu } from "d3-scale-chromatic";

import { CompareVersions } from "./VersionHistory/CompareVersions";
import { VersionTree } from "./VersionHistory/VersionTree";

export const VersionHistory = ({versions=[], effect="", ITE, _dag, _cohort}) => {

  const [hierarchy, setHierarchy] = React.useState({"children": [], "name": "All Versions"});
  const [layout, setLayout] = React.useState({"height": 120, "width": 1200, "margin": 30, "marginLeft": 10, "marginBottom": 30});

  const [versionAttributes, setVersionAttributes] = React.useState([]);
  const [allAttributes, setAllAttributes] = React.useState(new Set());
  const [attributeLevels, setAttributeLevels] = React.useState({});
  const [colorScale, setColorScale] = React.useState(() => x => "black");

  useEffect(() => {
    let newDAGs = [];
    let newHierarchy = {};

    let newVersionAttributes = [];
    let newAllAttributes = [];
    let newAttributeLevels = {};

    for (let v of versions) {
      let vDAG = v.DAG;
      let vDAGString = JSON.stringify(vDAG);

      let isIncluded = newDAGs.filter(nd => nd === vDAGString).length > 0;

      let attributes = Object.keys(v.Cohort[0]);
      newVersionAttributes.push(attributes);

      newAllAttributes = newAllAttributes.concat(attributes);

      for (let a of attributes) {
        let versionAttributeValues = Array.from(new Set(v.Cohort.map(d => d[a])));

        if (a in newAttributeLevels) {
          newAttributeLevels[a] = newAttributeLevels[a].concat(versionAttributeValues);
        } else {
          newAttributeLevels[a] = versionAttributeValues;
        }
      }

      if (!isIncluded) {
        newDAGs.push(vDAGString);
        newHierarchy[vDAGString] = [{"name":`Cohort 1: ${v.Cohort.length} rows`, "Cohort": v.Cohort, "ATE": v.ATE}];
      } else {
        let versionCount = newHierarchy[vDAGString].length;
        newHierarchy[vDAGString].push({"name":`Cohort ${versionCount + 1}: ${v.Cohort.length} rows`, "Cohort": v.Cohort, "ATE": v.ATE});
      }
    }

    let colors = schemeYlGnBu[newDAGs.length + 1].slice(1);

    let newColorScale = scaleOrdinal()
                          .domain(newDAGs)
                          .range(colors);

    setColorScale(() => x => newColorScale(x));

    for (let attr of Object.keys(newAttributeLevels)) {
      newAttributeLevels[attr] = Array.from(new Set(newAttributeLevels[attr]));
    }

    setVersionAttributes(newVersionAttributes);
    setAllAttributes(new Set(newAllAttributes));
    setAttributeLevels(newAttributeLevels);

    let data = {"children": [], "name": "All Versions"};
    let DAGUnique = Object.keys(newHierarchy);
    let DAGCount = DAGUnique.length;

    for (let i = 0; i < DAGCount; i++) {
      let d = DAGUnique[i];
      data.children.push({"name":`DAG ${i + 1}`, "DAG": JSON.parse(d), "id": i, "children": newHierarchy[d]})
    }

    setHierarchy(data);

    if (versions.length > 5) {
      setLayout({"height": 24 * versions.length, "width": 1200, "margin": 30, "marginLeft": 10, "marginBottom": 30})
    }

  }, [versions])

  return (
    <div>
      <VersionTree
        layout={layout}
        data={hierarchy}
        colorScale={colorScale}
        _dag={_dag}
        _cohort={_cohort} />
      <CompareVersions
        versions={versions}
        allAttributes={allAttributes}
        versionAttributes={versionAttributes}
        attributeLevels={attributeLevels}
        effect={effect}
        colorScale={colorScale} />
    </div>
  )
}