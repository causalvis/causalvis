import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem'; // import MoreVertIcon from '@mui/icons-material/MoreVert';

import { grey, blue, orange } from '@mui/material/colors';
export var Attribute = function Attribute(_ref) {
  var _ref$value = _ref.value,
      value = _ref$value === void 0 ? [] : _ref$value,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? "black" : _ref$color,
      _ref$isAdded = _ref.isAdded,
      isAdded = _ref$isAdded === void 0 ? false : _ref$isAdded,
      treatment = _ref.treatment,
      outcome = _ref.outcome,
      addAttribute = _ref.addAttribute,
      deleteAttribute = _ref.deleteAttribute,
      changeTreatment = _ref.changeTreatment,
      changeOutcome = _ref.changeOutcome,
      handleAddTag = _ref.handleAddTag;
  var colorMap = {
    "grey": {
      "rgb": "rgb(158, 158, 158)",
      "rgba": "rgba(158, 158, 158, 0.05)"
    },
    "treatment": {
      "rgb": "rgb(78, 121, 167)",
      "rgba": "rgba(78, 121, 167, 0.05)"
    },
    "outcome": {
      "rgb": "rgb(242, 142, 44)",
      "rgba": "rgba(242, 142, 44, 0.05)"
    },
    "black": {
      "rgb": "rgb(0, 0, 0)",
      "rgba": "rgba(0, 0, 0, 0.05)"
    }
  }; // const [anchorEl, setAnchorEl] = React.useState(null);

  var _React$useState = React.useState(false),
      open = _React$useState[0],
      setOpen = _React$useState[1];

  var _React$useState2 = React.useState(null),
      anchorPos = _React$useState2[0],
      setAnchorPos = _React$useState2[1];

  function handleClose() {
    setAnchorPos(null);
    setOpen(false);
  } // Toggle open/close context menu for attributes that are added to graph


  function handleContextMenu(e) {
    e.preventDefault();

    if (isAdded) {
      setOpen(!open); // setAnchorEl(e.target);

      setAnchorPos({
        "left": e.clientX + 2,
        "top": e.clientY - 6
      });
    }
  } // Set this attribute as treatment
  // If attribute already is treatment, deselect


  function handleTreatment() {
    if (treatment === value) {
      changeTreatment("");
      handleClose();
    } else if (outcome === value) {
      changeTreatment(value);
      changeOutcome("");
      handleClose(); // alert("Attribute is already set as outcome");
    } else {
      changeTreatment(value);
      handleClose();
    }
  } // Set this attribute as outcome
  // If attribute already is outcome, deselect


  function handleOutcome() {
    if (outcome === value) {
      changeOutcome("");
      handleClose();
    } else if (treatment === value) {
      changeOutcome(value);
      changeTreatment("");
      handleClose(); // alert("Attribute is already set as treatment");
    } else {
      changeOutcome(value);
      handleClose();
    }
  } // Open tag editor for this attribute


  function handleTag() {
    handleAddTag(value);
    handleClose();
  } // Delete this attribute from graph


  function handleDelete() {
    deleteAttribute(value);
    handleClose();
  }

  var buttonStyle = {
    "width": "100%",
    "marginBottom": "5px",
    "color": colorMap[color].rgb,
    "borderColor": colorMap[color].rgb,
    "&:hover": {
      "borderColor": colorMap[color].rgb,
      "backgroundColor": colorMap[color].rgba
    }
  };
  var menuStyle = {};
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    sx: buttonStyle,
    onClick: function onClick() {
      return addAttribute(value);
    },
    onContextMenu: function onContextMenu(e) {
      return handleContextMenu(e);
    },
    variant: "outlined"
  }, /*#__PURE__*/React.createElement("a", {
    title: "click to add"
  }, value)), /*#__PURE__*/React.createElement(Menu, {
    id: "basic-menu",
    anchorReference: "anchorPosition",
    anchorPosition: anchorPos,
    style: menuStyle,
    open: open,
    onClose: handleClose,
    MenuListProps: {
      'aria-labelledby': 'basic-button'
    }
  }, /*#__PURE__*/React.createElement(MenuItem, {
    onClick: handleTreatment,
    selected: value === treatment
  }, "Set as Treatment"), /*#__PURE__*/React.createElement(MenuItem, {
    onClick: handleOutcome,
    selected: value === outcome
  }, "Set as Outcome"), /*#__PURE__*/React.createElement(MenuItem, {
    onClick: handleTag
  }, "Edit Tags"), /*#__PURE__*/React.createElement(MenuItem, {
    onClick: handleDelete
  }, "Delete from Graph")));
};