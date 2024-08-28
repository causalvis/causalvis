import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey, blue, orange } from '@mui/material/colors';
import { Attribute } from './Attribute';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
export var AttributesManager = function AttributesManager(_ref) {
  var _buttonStyle;
  var _ref$attributes = _ref.attributes,
    attributes = _ref$attributes === void 0 ? [] : _ref$attributes,
    _ref$added = _ref.added,
    added = _ref$added === void 0 ? [] : _ref$added,
    treatment = _ref.treatment,
    outcome = _ref.outcome,
    addAttribute = _ref.addAttribute,
    deleteAttribute = _ref.deleteAttribute,
    changeTreatment = _ref.changeTreatment,
    changeOutcome = _ref.changeOutcome,
    handleAddTag = _ref.handleAddTag,
    handleNodeOpen = _ref.handleNodeOpen;
  // Get color of attribute
  function getColor(value) {
    if (treatment === value) {
      return "treatment";
    } else if (outcome === value) {
      return "outcome";
    } else if (added.indexOf(value) >= 0) {
      return "black";
    } else {
      return "grey";
    }
  }
  var buttonStyle = (_buttonStyle = {
    "width": "100%",
    "marginBottom": "5px"
  }, _buttonStyle["width"] = "150px", _buttonStyle);
  var attrStyle = {
    "display": "flex",
    "flexDirection": "column",
    "width": "150px",
    "marginRight": "20px",
    "height": "500px",
    "overflow": "scroll"
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    style: buttonStyle,
    startIcon: /*#__PURE__*/React.createElement(AddOutlinedIcon, null),
    variant: "contained",
    onClick: function onClick() {
      return handleNodeOpen();
    }
  }, /*#__PURE__*/React.createElement("a", {
    title: "click to add"
  }, "Add Node")), /*#__PURE__*/React.createElement("div", {
    style: attrStyle
  }, attributes.map(function (value, index) {
    return /*#__PURE__*/React.createElement(Attribute, {
      key: index,
      value: value,
      isAdded: added.indexOf(value) >= 0 ? true : false,
      color: getColor(value),
      treatment: treatment,
      outcome: outcome,
      addAttribute: addAttribute,
      deleteAttribute: deleteAttribute,
      changeTreatment: changeTreatment,
      changeOutcome: changeOutcome,
      handleAddTag: handleAddTag
    });
  })));
};