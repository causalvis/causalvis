import React, {useEffect} from 'react';
import { SwatchesPicker } from 'react-color';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// import FormControl from '@mui/material/FormControl';
// import FormLabel from '@mui/material/FormLabel';
// import FormGroup from '@mui/material/FormGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';

// import { saveAs } from 'file-saver';

export const TagDialog = ({tagNode="", open=false, handleTagClose, updateTag}) => {
  const [value, setValue] = React.useState("");
  const [colorOpen, setColorOpen] = React.useState(false);
  const [color, setColor] = React.useState("#000000");

  function handleChange(e) {
    // console.log(e.target.value);
    setValue(e.target.value);
  };

  function handleAdd() {
    if (value === "") {
      handleNodeClose();
    } else {
      addAttribute(value, true);
      setValue("");
      handleNodeClose();
    }
  }

  const handleClick = () => {
    setColorOpen(!colorOpen);
  };

  const handleClose = () => {
    setColorOpen(false);
  };

  const handleColorChange = (color) => {
    setColor(color.hex);
  };

  const styles = {
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
  };

  let textStyle = {"margin": "24px 10px 0px 0px"};
  let dialogContentStyle = {"display":"flex", "align-items":"center"};
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
                    "background": `${ color }`}
  let popoverStyle = {position: 'fixed',
                      zIndex: '1301'}

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
          <div style={dialogContentStyle}>
            <TextField
              style={textStyle}
              id="outlined-basic"
              label="Variable Name"
              variant="outlined"
              onChange={(e) => handleChange(e)} />
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
          <Button onClick={handleTagClose}>Cancel</Button>
          <Button onClick={() => updateTag(color, value)}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
