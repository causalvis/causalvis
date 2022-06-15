import React, {useEffect} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

export const NodeDialog = ({open=false, handleNodeClose, addAttribute, addCustom}) => {
  const [value, setValue] = React.useState("");

  function handleChange(e) {
    // console.log(e.target.value);
    setValue(e.target.value);
  };

  // Add node with input attribute name
  function handleAdd() {
    if (value === "") {
      handleNodeClose();
    } else {
      addCustom(value);
      setValue("");
      handleNodeClose();
    }
  }

  let textStyle = {"margin": "24px 24px 0px 0px"};

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleNodeClose}>
        {/*<DialogTitle>Add Custom Node</DialogTitle>*/}
        <DialogContent>
          <DialogContentText>
          Add Custom Node
          </DialogContentText>
          <TextField
            style={textStyle}
            id="outlined-basic"
            label="Variable Name"
            variant="outlined"
            onChange={(e) => handleChange(e)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNodeClose}>Cancel</Button>
          <Button onClick={handleAdd}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
