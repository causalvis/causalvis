import React, {useEffect} from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';

import { saveAs } from 'file-saver';

export const DownloadDialog = ({open=false, nodelinks={}, treatment="", outcome="", confounds=[], colliders=[], mediators=[], handleClose}) => {
  // console.log(colliders);
  const [checked, setChecked] = React.useState({
    nodelinkCheck: true,
    treatmentCheck: false,
    outcomeCheck: false,
    confoundsCheck: false,
    mediatorsCheck: false,
    collidersCheck: false,
  });
  const [error, setError] = React.useState(false);
  const [downloadJSON, setJSON] = React.useState('');
  const [filename, setFilename] = React.useState('DAG');

  // Update download json based on user selections
  useEffect(() => {
    let newDownload = {};
    
    if (checked.nodelinkCheck) {
      newDownload.nodes = JSON.parse(JSON.stringify(nodelinks.nodes));

      for (let n of newDownload.nodes) {
        delete n.children;
        delete n.parents;
      }

      newDownload.links = JSON.parse(JSON.stringify(nodelinks.links));
    }

    if (checked.treatmentCheck) {
      newDownload.treatment = treatment;
    }

    if (checked.outcomeCheck) {
      newDownload.outcome = outcome;
    }

    if (checked.confoundsCheck) {
      newDownload.confounds = confounds;
    }

    if (checked.mediatorsCheck) {
      newDownload.mediators = mediators;
    }

    if (checked.collidersCheck) {
      newDownload.colliders = colliders;
    }

    setJSON(newDownload);

  }, [checked, nodelinks, treatment, outcome, confounds, colliders, mediators])


  function handleChange(val) {
    checked[val] = !checked[val];
    let checkedValues = Object.values(checked);
    let newError = checkedValues.filter((v) => v).length < 1;

    setChecked({...checked});
    setError(newError);
  }

  function download() {
    let fileContent = new Blob([JSON.stringify(downloadJSON, null, 4)], {
      type: 'application/json',
      name: `${filename}.json`
    });

    saveAs(fileContent, `${filename}.json`);
  }

  function handleFilenameChange(e) {
    setFilename(e.target.value);
    // console.log(e.target.value);
    // setValue(val);
    // setColor(tagColors[val]);
  }

  let dataStyle = {"display": "flex"};
  let checkboxStyle = {"width": "250px"};
  let textStyle = {"margin": "24px 24px 0px 0px"};
  let filenameStyle = {"marginBottom": "24px"};
  let fullWidth = true;
  let maxWidth = "md";

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={fullWidth}
        maxWidth={maxWidth}>
        <DialogTitle>Download</DialogTitle>
        <DialogContent>
          <TextField
            style={filenameStyle}
            defaultValue={filename}
            id="outlined-basic"
            label="Filename"
            variant="standard"
            onChange={(e) => handleFilenameChange(e)} />
          <DialogContentText>
            Select the data you would like to include. Your file will be saved as <i>{filename}.json</i>.
          </DialogContentText>
          <div style={dataStyle}>
            <FormControl
              required
              error={error}
              component="fieldset"
              sx={{ m: 3 }}
              variant="standard">
              <FormLabel component="legend">Select at least one</FormLabel>
              <FormGroup style={checkboxStyle}>
                <FormControlLabel control={<Checkbox checked={checked.nodelinkCheck} onChange={() => handleChange("nodelinkCheck")} />} label="Node-Link" />
                <FormControlLabel control={<Checkbox checked={checked.treatmentCheck} onChange={() => handleChange("treatmentCheck")} />} label="Treatment" />
                <FormControlLabel control={<Checkbox checked={checked.outcomeCheck} onChange={() => handleChange("outcomeCheck")} />} label="Outcome" />
                <FormControlLabel control={<Checkbox checked={checked.confoundsCheck} onChange={() => handleChange("confoundsCheck")} />} label="Confounds" />
                <FormControlLabel control={<Checkbox checked={checked.mediatorsCheck} onChange={() => handleChange("mediatorsCheck")} />} label="Mediators" />
                <FormControlLabel control={<Checkbox checked={checked.collidersCheck} onChange={() => handleChange("collidersCheck")} />} label="Colliders" />
              </FormGroup>
            </FormControl>
            <TextField
              style={textStyle}
              id="outlined-multiline-flexible"
              multiline
              fullWidth
              maxRows={20}
              value={JSON.stringify(downloadJSON, null, 4)}
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={download}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
