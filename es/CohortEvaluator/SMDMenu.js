import React, { useRef, useState, useEffect } from 'react';
import { min, max } from 'd3-array';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
export var SMDMenu = function SMDMenu(_ref) {
  var setSort = _ref.setSort;

  // Control sort menu
  var _React$useState = React.useState(false),
      open = _React$useState[0],
      setOpen = _React$useState[1];

  var _React$useState2 = React.useState(null),
      anchorEl = _React$useState2[0],
      setAnchorEl = _React$useState2[1];

  var _React$useState3 = React.useState("Adjusted High to Low"),
      selectedOption = _React$useState3[0],
      setSelectedOption = _React$useState3[1];

  var sortOptions = ["Adjusted High to Low", "Adjusted Low to High", "Unadjusted High to Low", "Unadjusted Low to High", "A-Z Alphebatically", "Z-A Alphebatically", "Difference High to Low", "Difference Low to High"];

  function changeSort(e, s) {
    // console.log("changing sort...");
    var newSMD;

    if (s === selectedOption) {
      return;
    }

    setSort(s); // if (s === "Adjusted High to Low") {
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

  var handleClick = function handleClick(e) {
    // console.log(e);
    // setSMD([...SMD]);
    // console.log("click");
    setOpen(true);
    setAnchorEl(e.target);
  };

  var handleClose = function handleClose() {
    // setSMD([...SMD]);
    // console.log('close');
    setOpen(false);
    setAnchorEl(null);
  };

  var iconButtonStyle = {
    "marginTop": "42px"
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(IconButton, {
    style: iconButtonStyle,
    onClick: function onClick(e) {
      return handleClick(e);
    }
  }, /*#__PURE__*/React.createElement(MoreVertIcon, null)), /*#__PURE__*/React.createElement(Menu, {
    id: "long-menu",
    anchorEl: anchorEl,
    open: open,
    onClose: handleClose
  }, sortOptions.map(function (option, i) {
    return /*#__PURE__*/React.createElement(MenuItem, {
      key: i,
      onClick: function onClick(e) {
        return changeSort(e, option);
      },
      selected: option === selectedOption
    }, option);
  }))));
};