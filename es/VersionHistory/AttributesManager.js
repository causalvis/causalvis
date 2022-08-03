import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey, blue, orange } from '@mui/material/colors';
import { Attribute } from './Attribute';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
export var AttributesManager = function AttributesManager(_ref) {
  var _ref$attributes = _ref.attributes,
      attributes = _ref$attributes === void 0 ? [] : _ref$attributes,
      changeStratify = _ref.changeStratify,
      _ref$stratify = _ref.stratify,
      stratify = _ref$stratify === void 0 ? [] : _ref$stratify,
      setStratifyBy = _ref.setStratifyBy;
  // console.log(grey, blue, orange);
  // Get color of attribute
  // function getColor(value) {
  //   if (treatment === value) {
  //     return "treatment"
  //   } else if (outcome === value) {
  //     return "outcome"
  //   } else if (added.indexOf(value) >= 0) {
  //     return "inherit"
  //   } else {
  //     return "grey"
  //   }
  // }
  var buttonStyle = {
    "width": "150px",
    "marginBottom": "5px"
  };
  var attrStyle = {
    "display": "flex",
    "width": "150px",
    "flexDirection": "column",
    "height": "500px",
    "overflow": "scroll",
    "marginRight": "50px"
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: attrStyle
  }, attributes.map(function (value, index) {
    return /*#__PURE__*/React.createElement(Attribute, {
      value: value,
      key: "covariate" + index,
      changeStratify: setStratifyBy,
      color: stratify.indexOf(value) < 0 ? "grey" : "black"
    });
  })));
};