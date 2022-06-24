import React, {useEffect} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

export const CovariateSelector = ({open=false, handleClose, attributes}) => {
  const [value, setValue] = React.useState("");

  function handleChange(e) {
    // console.log(e.target.value);
    console.log(e.target.value);
  };

  // Add node with input attribute name
  function handleAdd() {
    console.log("adding");
  }

  let textStyle = {"margin": "24px 24px 0px 0px"};

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}>
        {/*<DialogTitle>Add Custom Node</DialogTitle>*/}
        <DialogContent>
          <DialogContentText>
          Show/Hide Covariates
          </DialogContentText>
          {attributes.map((a) => {
            return <p>{a}</p>
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAdd}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
