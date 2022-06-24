import React, {useEffect} from 'react';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';

export const CovariateSelector = ({open=false, handleClose, attributes, addedAttributes, groupEditCovariate}) => {
  const [value, setValue] = React.useState("");

  const [selected, setSelected] = React.useState(new Set());

  function handleChange(a) {
    let newSelected = new Set(selected);
    if (newSelected.has(a)) {
      newSelected.delete(a);
    } else {
      newSelected.add(a);
    }
    setSelected(new Set(newSelected));
  };

  function handleConfirm() {
    groupEditCovariate(selected);
    handleClose();
  }

  // Add node with input attribute name
  // function handleAdd() {
  //   console.log("adding");
  // }

  useEffect(() => {
    setSelected(new Set(addedAttributes));
  }, [addedAttributes])

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
          <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
            <FormGroup>
              {attributes.map((a, i) => {
                return <FormControlLabel
                  key={`attr-selector-${a}`}
                  control={
                    <Checkbox checked={selected.has(a)} onChange={() => handleChange(a)} name={a} />
                  }
                  label={a}
                />
              })}
            </FormGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()}>Cancel</Button>
          <Button onClick={() => handleConfirm()}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
