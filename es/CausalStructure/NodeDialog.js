import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
export var NodeDialog = function NodeDialog(_ref) {
  var _ref$open = _ref.open,
    open = _ref$open === void 0 ? false : _ref$open,
    handleNodeClose = _ref.handleNodeClose,
    addAttribute = _ref.addAttribute,
    addCustom = _ref.addCustom;
  var _React$useState = React.useState(""),
    value = _React$useState[0],
    setValue = _React$useState[1];
  function handleChange(e) {
    setValue(e.target.value);
  }
  ;

  // Add node with input attribute name
  function handleAdd() {
    if (value === "") {
      handleNodeClose();
    } else {
      addCustom(value);
      setValue("");
      handleNodeClose();
    }
  }
  var textStyle = {
    "margin": "24px 24px 0px 0px"
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Dialog, {
    open: open,
    onClose: handleNodeClose
  }, /*#__PURE__*/React.createElement(DialogContent, null, /*#__PURE__*/React.createElement(DialogContentText, null, "Add Custom Node"), /*#__PURE__*/React.createElement(TextField, {
    style: textStyle,
    id: "outlined-basic",
    label: "Variable Name",
    variant: "outlined",
    onChange: function onChange(e) {
      return handleChange(e);
    }
  })), /*#__PURE__*/React.createElement(DialogActions, null, /*#__PURE__*/React.createElement(Button, {
    onClick: handleNodeClose
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    onClick: handleAdd
  }, "Add"))));
};