import React, {useRef, useState, useEffect} from 'react'
import { min, max } from 'd3-array'

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export const SMDMenu = ({setSort}) => {

  // Control sort menu
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedOption, setSelectedOption] = React.useState("Adjusted High to Low");

  const sortOptions = ["Adjusted High to Low", "Adjusted Low to High", "Unadjusted High to Low", "Unadjusted Low to High"];

  function changeSort(e, s) {
    // console.log("changing sort...");

    let newSMD;

    if (s === selectedOption) {
      return
    }

    setSort(s);

    // if (s === "Adjusted High to Low") {
    //   newSMD = SMDDataset.sort((a, b) => a.adjusted > b.adjusted);
    // } else if (s === "Adjusted Low to High") {
    //   newSMD = SMDDataset.sort((a, b) => a.adjusted < b.adjusted);
    // } else if (s === "Unadjusted High to Low") {
    //   newSMD = SMDDataset.sort((a, b) => a.unadjusted > b.unadjusted);
    // } else if (s === "Unadjusted Low to High") {
    //   newSMD = SMDDataset.sort((a, b) => a.unadjusted < b.unadjusted);
    // }

    // let newSMDExtent = [Math.min(min(newSMD, d => d.unadjusted), min(newSMD, d => d.adjusted)), Math.max(max(newSMD, d => d.unadjusted), max(newSMD, d => d.adjusted))];
    
    // setSMD([...newSMD]);

    // setOpen(!open);
    setOpen(false);
    setAnchorEl(null);
    setSelectedOption(s);
  }

  const handleClick = (e) => {
    // console.log(e);
    // setSMD([...SMD]);
    // console.log("click");
    setOpen(true);
    setAnchorEl(e.target);
  };

  const handleClose = () => {
    // setSMD([...SMD]);
    // console.log('close');
    setOpen(false);
    setAnchorEl(null);
  };

  let iconButtonStyle = {"marginTop":"42px"};

  return (
    <div>

      <div>
        <IconButton
          style={iconButtonStyle}
          onClick={(e) => handleClick(e)}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          {sortOptions.map((option, i) => (
            <MenuItem key={i} onClick={(e) => changeSort(e, option)} selected={option===selectedOption}>
              {option}
            </MenuItem>
          ))}
        </Menu>
      </div>
    </div>
  )
}