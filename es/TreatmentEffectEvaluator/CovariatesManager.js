import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey, blue, orange } from '@mui/material/colors';
import { Covariate } from './Covariate';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
export var CovariatesManager = function CovariatesManager(_ref) {
  var _ref$attributes = _ref.attributes,
    attributes = _ref$attributes === void 0 ? [] : _ref$attributes,
    changeStratify = _ref.changeStratify,
    _ref$stratify = _ref.stratify,
    stratify = _ref$stratify === void 0 ? [] : _ref$stratify;
  var buttonStyle = {
    "width": "100%",
    "marginBottom": "5px"
  };
  var attrStyle = {
    "display": "flex",
    "flexDirection": "column",
    "height": "500px",
    "overflow": "scroll"
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: attrStyle
  }, attributes.map(function (value, index) {
    return /*#__PURE__*/React.createElement(Covariate, {
      value: value,
      key: "covariate" + index,
      changeStratify: changeStratify,
      color: stratify.indexOf(value) < 0 ? "grey" : "black"
    });
  })));
};