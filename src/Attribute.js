import React, {useState} from 'react';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
// import MoreVertIcon from '@mui/icons-material/MoreVert';

export const Attribute = ({value=[], color="inherit", isAdded=false, treatment, outcome, addAttribute, deleteAttribute, changeTreatment, changeOutcome, handleAddTag}) => {

  // const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [anchorPos, setAnchorPos] = React.useState(null);

  function handleClose() {
    setAnchorPos(null);
    setOpen(false);
  }

  // Toggle open/close context menu for attributes that are added to graph
  function handleContextMenu(e) {
    e.preventDefault();
    if (isAdded) {
      setOpen(!open);
      // setAnchorEl(e.target);
      setAnchorPos({"left": e.clientX + 2, "top": e.clientY - 6})
    }
  }

  // Set this attribute as treatment
  // If attribute already is treatment, deselect
  function handleTreatment() {
    if (treatment === value) {
      changeTreatment("");
      handleClose();
    } else if (outcome === value) {
      changeTreatment(value);
      changeOutcome("");
      handleClose();
      // alert("Attribute is already set as outcome");
    } else {
      changeTreatment(value);
      handleClose();
    }
  }

  // Set this attribute as outcome
  // If attribute already is outcome, deselect
  function handleOutcome() {
    if (outcome === value) {
      changeOutcome("");
      handleClose();
    } else if (treatment === value) {
      changeOutcome(value);
      changeTreatment("");
      handleClose();
      // alert("Attribute is already set as treatment");
    } else {
      changeOutcome(value);
      handleClose();
    }
  }

  // Open tag editor for this attribute
  function handleTag() {
    handleAddTag(value);
    handleClose();
  }

  // Delete this attribute from graph
  function handleDelete() {
    deleteAttribute(value);
    handleClose();
  }

  const buttonStyle = {"width":"100%", "marginBottom":"5px"};
  const menuStyle = {}

  return (
    <div>
      <Button style={buttonStyle}
              onClick={() => addAttribute(value)}
              onContextMenu={(e) => handleContextMenu(e)}
              color={color}
              variant="outlined"><a title="click to add">{value}</a></Button>
      <Menu
        id="basic-menu"
        anchorReference="anchorPosition"
        anchorPosition={anchorPos}
        style={menuStyle}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleTreatment} selected={value===treatment}>Set as Treatment</MenuItem>
        <MenuItem onClick={handleOutcome} selected={value===outcome}>Set as Outcome</MenuItem>
        <MenuItem onClick={handleTag}>Edit Tags</MenuItem>
        <MenuItem onClick={handleDelete}>Delete from Graph</MenuItem>
      </Menu>
    </div>
  )
}