import React, {useRef, useState, useEffect} from 'react';

import { AttributesManager } from './AttributesManager';
import { CompareVersionsVis } from './CompareVersionsVis';

import { mean } from 'd3-array';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export const CompareVersions = ({versions=[],
                                 hierarchy={},
                                 allAttributes=[],
                                 versionAttributes={},
                                 attributeLevels={},
                                 effect="",
                                 colorScale}) => {

  const [data, setData] = React.useState([]);
  const [flattened, setFlattened] = React.useState([]);
  const [stratifyBy, setStratifyBy] = React.useState("");

  function handleChange(e, val) {
    if (!val) {
      setStratifyBy("");
    } else {
      setStratifyBy(val);
    }
  }

  useEffect(() => {

    let DAGs = Object.keys(hierarchy);
    let newFlattened = [];

    for (let i = 0; i < DAGs.length; i++) {
      let DAG = DAGs[i];
      let DAGChildren = hierarchy[DAG];

      for (let child of DAGChildren) {
        child["DAG"] = JSON.parse(DAG);
        child["name"] = `DAG ${i + 1}: ${child["name"]}`;

        newFlattened.push(child);
      }
    }

    setFlattened(newFlattened);

  }, [hierarchy])

  useEffect(() => {

    if (stratifyBy == "") {
      let newData = [];

      for (let v of flattened) {
        newData.push({"ATE":v.ATE, "DAG":v.DAG, "name": v.name})
      }

      setData(newData);
    } else {
      let newData = [];

      for (let i = 0; i < flattened.length; i++) {
        let v = flattened[i];
        let vAttributes = versionAttributes[i];

        if (vAttributes.indexOf(stratifyBy) < 0) {
          continue;
        } else if (effect === "") {
          newData.push({"ATE":v.ATE, "DAG":v.DAG, "name": v.name});
        } else if (attributeLevels[stratifyBy].length > 2) {
          let stratifyMean = mean(attributeLevels[stratifyBy]);

          let stratify0 = v.Cohort.filter(d => d[stratifyBy] < stratifyMean);
          let stratify1 = v.Cohort.filter(d => d[stratifyBy] >= stratifyMean);

          let ATE0 = getATE(stratify0);
          let ATE1 = getATE(stratify1);

          newData.push({"ATE": ATE0, "group": `<${stratifyMean.toPrecision(2)}`, "DAG":v.DAG, "name": v.name});
          newData.push({"ATE": ATE1, "group": `>=${stratifyMean.toPrecision(2)}`, "DAG":v.DAG, "name": v.name});
        } else if (attributeLevels[stratifyBy].length == 2) {
          let stratify0 = v.Cohort.filter(d => d[stratifyBy] === 0);
          let stratify1 = v.Cohort.filter(d => d[stratifyBy] === 1);

          let ATE0 = getATE(stratify0);
          let ATE1 = getATE(stratify1);

          newData.push({"ATE": ATE0, "group": `0`, "DAG":v.DAG, "name": v.name});
          newData.push({"ATE": ATE1, "group": `1`, "DAG":v.DAG, "name": v.name});
        } else {
          newData.push({"ATE":v.ATE, "DAG":v.DAG, "name": v.name});
        }
      }
      setData(newData);
    }
  }, [flattened, stratifyBy, attributeLevels])

  function getATE(cohort) {

    let total = 0;

    for (let i of cohort) {
      total = total + i[effect];
    }

    return total/cohort.length
  }

  let attributesStyle = {"width": "150px", "marginRight":"50px"};
  let ateLayout = {"display":"block"};
  let searchStyle = {"height": "48px",
                    "borderRadius": "24px",
                    "marginTop": "11px",
                    "& .MuiOutlinedInput-input": { height: "12px" },
                    "& .MuiOutlinedInput-root": { "padding": "11px" },
                    "& .MuiInputLabel-formControl": { "top": "-1px"}};

  return (
    <div style={ateLayout}>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={Array.from(allAttributes)}
        sx={{ width: 300 }}
        onChange={(e, val) => handleChange(e, val)}
        renderInput={(params) =>
          <TextField
            {...params}
            sx={searchStyle}
            label="Group by"
          />}
      />
      <CompareVersionsVis data={data} stratifyBy={stratifyBy} colorScale={colorScale} />
    </div>
  )
}