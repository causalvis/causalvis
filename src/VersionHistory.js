import React, {useState, useEffect} from 'react';
import { VersionTree } from './VersionHistory/VersionTree';

/*
Props:
  - data: Array, data set before adjustment
  - treatment: String, name of treatment variable
  - outcome: String, name of outcome variable
*/
export const VersionHistory = ({versions=[]}) => {

  const [hierarchy, setHierarchy] = React.useState({"children": [], "name": "All Versions"});

  useEffect(() => {
    let newDAGs = [];
    let newHierarchy = {};

    for (let v of versions) {
      let vDAG = v.DAG;
      let vDAGString = JSON.stringify(vDAG);

      let isIncluded = newDAGs.filter(nd => nd === vDAGString).length > 0;

      if (!isIncluded) {
        newDAGs.push(vDAGString);
        newHierarchy[vDAGString] = [{"name":`Cohort 1`, "Cohort": v.Cohort, "ATE": v.ATE}];
      } else {
        let versionCount = newHierarchy[vDAGString].length;
        newHierarchy[vDAGString].push({"name":`Cohort ${versionCount + 1}`, "Cohort": v.Cohort, "ATE": v.ATE});
      }
    }

    let data = {"children": [], "name": "All Versions"};
    let DAGUnique = Object.keys(newHierarchy)
    let DAGCount = DAGUnique.length;

    for (let i = 0; i < DAGCount; i++) {
      let d = DAGUnique[i];
      data.children.push({"name":`DAG ${i + 1}`, "DAG": JSON.parse(d), "id": i, "children": newHierarchy[d]})
    }

    setHierarchy(data);

  }, [versions])

  return (
    <div>
      <VersionTree data={hierarchy} />
    </div>
  )
}