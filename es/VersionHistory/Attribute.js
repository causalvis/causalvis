import React, { useState } from 'react';
import Button from '@mui/material/Button';
export var Attribute = function Attribute(_ref) {
  var _ref$value = _ref.value,
    value = _ref$value === void 0 ? "" : _ref$value,
    _ref$color = _ref.color,
    color = _ref$color === void 0 ? "black" : _ref$color,
    changeStratify = _ref.changeStratify;
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
  };
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
      return changeStratify(value);
    },
    variant: "outlined"
  }, /*#__PURE__*/React.createElement("a", {
    title: "click to add"
  }, value)));
};