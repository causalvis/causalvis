import React, {useRef, useState, useEffect} from 'react';

import { AttributesManager } from './AttributesManager';
import { CompareVersionsVis } from './CompareVersionsVis';

import { mean } from 'd3-array';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export const CompareVersions = ({versions=[],
                                 allAttributes=[],
                                 versionAttributes={},
                                 attributeLevels={},
                                 effect="",
                                 colorScale}) => {

  const [data, setData] = React.useState([]);
  const [stratifyBy, setStratifyBy] = React.useState("");

  // console.log(allAttributes, versionAttributes);

  function handleChange(e, val) {
    if (!val) {
      setStratifyBy("");
    } else {
      setStratifyBy(val);
    }
  }

  useEffect(() => {
    // console.log(stratifyBy);

    if (stratifyBy == "") {
      let newData = [];

      for (let v of versions) {
        newData.push({"ATE":v.ATE, "DAG":JSON.stringify(v.DAG)})
      }

      setData(newData);
    } else {
      let newData = [];

      for (let i = 0; i < versions.length; i++) {
        let v = versions[i];
        let vAttributes = versionAttributes[i];

        if (vAttributes.indexOf(stratifyBy) < 0) {
          continue;
        } else if (effect === "") {
          newData.push({"ATE":v.ATE, "DAG":JSON.stringify(v.DAG)});
        } else if (attributeLevels[stratifyBy].length > 2) {
          let stratifyMean = mean(attributeLevels[stratifyBy]);

          let stratify0 = v.Cohort.filter(d => d[stratifyBy] < stratifyMean);
          let stratify1 = v.Cohort.filter(d => d[stratifyBy] >= stratifyMean);

          let ATE0 = getATE(stratify0);
          let ATE1 = getATE(stratify1);

          newData.push({"ATE": ATE0, "group": `<${stratifyMean.toPrecision(2)}`, "DAG":JSON.stringify(v.DAG)});
          newData.push({"ATE": ATE1, "group": `>=${stratifyMean.toPrecision(2)}`, "DAG":JSON.stringify(v.DAG)});
        } else if (attributeLevels[stratifyBy].length == 2) {
          let stratify0 = v.Cohort.filter(d => d[stratifyBy] === 0);
          let stratify1 = v.Cohort.filter(d => d[stratifyBy] === 1);

          let ATE0 = getATE(stratify0);
          let ATE1 = getATE(stratify1);

          newData.push({"ATE": ATE0, "group": `0`, "DAG":JSON.stringify(v.DAG)});
          newData.push({"ATE": ATE1, "group": `1`, "DAG":JSON.stringify(v.DAG)});
        } else {
          newData.push({"ATE":v.ATE, "DAG":JSON.stringify(v.DAG)});
        }
      }
      setData(newData);
    }
  }, [versions, stratifyBy, attributeLevels])

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
      {/* <AttributesManager style={attributesStyle} attributes={Array.from(allAttributes)} setStratifyBy={setStratifyBy} /> */}
      <CompareVersionsVis data={data} stratifyBy={stratifyBy} colorScale={colorScale} />
    </div>
  )
}