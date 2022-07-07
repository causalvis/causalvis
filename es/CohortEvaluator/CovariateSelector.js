import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
export var CovariateSelector = function CovariateSelector(_ref) {
  var _ref$open = _ref.open,
      open = _ref$open === void 0 ? false : _ref$open,
      handleClose = _ref.handleClose,
      attributes = _ref.attributes,
      addedAttributes = _ref.addedAttributes,
      groupEditCovariate = _ref.groupEditCovariate;

  var _React$useState = React.useState(""),
      value = _React$useState[0],
      setValue = _React$useState[1];

  var _React$useState2 = React.useState(new Set()),
      selected = _React$useState2[0],
      setSelected = _React$useState2[1];

  function handleChange(a) {
    var newSelected = new Set(selected);

    if (newSelected.has(a)) {
      newSelected["delete"](a);
    } else {
      newSelected.add(a);
    }

    setSelected(new Set(newSelected));
  }

  ;

  function handleConfirm() {
    groupEditCovariate(selected);
    handleClose();
  } // Add node with input attribute name
  // function handleAdd() {
  //   console.log("adding");
  // }


  useEffect(function () {
    setSelected(new Set(addedAttributes));
  }, [addedAttributes]);
  var textStyle = {
    "margin": "24px 24px 0px 0px"
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Dialog, {
    open: open,
    onClose: handleClose
  }, /*#__PURE__*/React.createElement(DialogContent, null, /*#__PURE__*/React.createElement(DialogContentText, null, "Show/Hide Covariates"), /*#__PURE__*/React.createElement(FormControl, {
    sx: {
      m: 3
    },
    component: "fieldset",
    variant: "standard"
  }, /*#__PURE__*/React.createElement(FormGroup, null, attributes.map(function (a, i) {
    return /*#__PURE__*/React.createElement(FormControlLabel, {
      key: "attr-selector-" + a,
      control: /*#__PURE__*/React.createElement(Checkbox, {
        checked: selected.has(a),
        onChange: function onChange() {
          return handleChange(a);
        },
        name: a
      }),
      label: a
    });
  })))), /*#__PURE__*/React.createElement(DialogActions, null, /*#__PURE__*/React.createElement(Button, {
    onClick: function onClick() {
      return handleClose();
    }
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    onClick: function onClick() {
      return handleConfirm();
    }
  }, "Confirm"))));
};