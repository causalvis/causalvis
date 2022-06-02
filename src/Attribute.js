import React, {useState} from 'react';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export const Attribute = ({value=[], color="inherit", addAttribute}) => {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  function handleContextMenu(e) {
    e.preventDefault();
    setOpen(!open);
    setAnchorEl(e.target);
  }

  const buttonStyle = {"width":"100%", "margin-bottom":"5px"};
  const menuStyle = {"width":"150px"}

  return (
    <div>
      <Button style={buttonStyle}
              onClick={() => addAttribute(value)}
              onContextMenu={(e) => handleContextMenu(e)}
              color={color}
              variant="outlined">{value}</Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        style={menuStyle}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>Set Treatment</MenuItem>
        <MenuItem onClick={handleClose}>Set Outcome</MenuItem>
      </Menu>
    </div>
  )
}