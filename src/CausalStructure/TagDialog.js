import React, {useEffect} from 'react';
import { SwatchesPicker } from 'react-color';

import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// import FormControl from '@mui/material/FormControl';
// import FormLabel from '@mui/material/FormLabel';
// import FormGroup from '@mui/material/FormGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

// import { saveAs } from 'file-saver';

export const TagDialog = ({tagNode="", tagColors={}, attrTags=[], open=false, handleTagClose, updateTag, deleteTag}) => {
  const [value, setValue] = React.useState("");
  const [colorOpen, setColorOpen] = React.useState(false);
  const [color, setColor] = React.useState("#000000");

  // console.log(tagColors);

  // Handle when users select a tag from existing tags;
  function handleChange(e, val) {
    setValue(val);
    setColor(tagColors[val]);
  }

  // Handle when users add a new tag;
  function handleInputChange(e) {
    // console.log(e.target.value);
    setValue(e.target.value);
  };

  // Toggle open/close color selector
  const handleClick = () => {
    setColorOpen(!colorOpen);
  };

  // Close color selector
  const handleClose = () => {
    setColorOpen(false);
  };

  // Update color selected
  const handleColorChange = (color) => {
    setColor(color.hex);
  };

  // Add tag and associated color
  const handleAdd = () => {
    if (value === "") {
      // handleTagClose();
    } else {
      updateTag(color, value);
      // handleTagClose();
    }

    setColor("#000000");
  };

  // Delete tag for selected attribute
  const handleDelete = (value) => {
    // console.log("deleting...", value);
    deleteTag(value);
  }

  const styles = {
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
  };

  let textStyle = {"margin": "24px 10px 0px 0px", "width": "300px"};
  let dialogContentStyle = {"display":"flex", "alignItems":"center"};
  let swatchStyle = {"margin": "24px 24px 0px 0px",
                    "width":"48px",
                    "height":"48px",
                    "padding":"4px",
                    "background": '#fff',
                    "borderRadius": '4px',
                    "boxShadow": '0 0 0 1px rgba(0,0,0,.1)',
                    "display": 'inline-block',
                    "cursor": 'pointer',};
  let colorStyle = {"width":"100%",
                    "height":"100%",
                    "borderRadius": '4px',
                    "background": `${ color }`};
  let popoverStyle = {position: 'fixed',
                      zIndex: '1301'};
  let stackStyle = {"display": attrTags.length > 0 ? "block" : "none", "margin": "24px 10px 0px 0px"};

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleTagClose}>
        <DialogTitle>Add or Edit Tags</DialogTitle>
        <DialogContent>
          <DialogContentText>
          You are editing tags for the node: <i>{tagNode}</i>
          </DialogContentText>
          <Stack style={stackStyle} direction="row" spacing={1}>
            {attrTags.map((value, index) => {
              return <Chip label={value} variant="outlined" onDelete={() => handleDelete(value)} sx={{"color": tagColors[value]}}/>
            })}
          </Stack>
          <div style={dialogContentStyle}>
            <Autocomplete
              disablePortal
              freeSolo
              options={Object.keys(tagColors)}
              sx={textStyle}
              onChange={(e, val) => handleChange(e, val)}
              onInputChange={(e) => handleInputChange(e)}
              renderInput={(params) =>
                <TextField
                  {...params}
                  label="Tag Name"
                />}
            />

            {/*<TextField
              style={textStyle}
              id="outlined-basic"
              label="Tag Name"
              variant="outlined"
              onChange={(e) => handleChange(e)} />*/}
            <div style={ swatchStyle } onClick={ handleClick }>
              <div style={ colorStyle } />
              { colorOpen ? <div style={ popoverStyle }>
                <div style={ styles.cover } onClick={ handleClose }/>
                <SwatchesPicker color={ color } onChange={ handleColorChange } />
              </div> : null }
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTagClose}>Close</Button>
          <Button onClick={handleAdd}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
