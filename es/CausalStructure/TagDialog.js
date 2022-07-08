function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { useEffect } from 'react';
import { SwatchesPicker } from 'react-color';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle'; // import FormControl from '@mui/material/FormControl';
// import FormLabel from '@mui/material/FormLabel';
// import FormGroup from '@mui/material/FormGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField'; // import { saveAs } from 'file-saver';

export var TagDialog = function TagDialog(_ref) {
  var _ref$tagNode = _ref.tagNode,
      tagNode = _ref$tagNode === void 0 ? "" : _ref$tagNode,
      _ref$tagColors = _ref.tagColors,
      tagColors = _ref$tagColors === void 0 ? {} : _ref$tagColors,
      _ref$attrTags = _ref.attrTags,
      attrTags = _ref$attrTags === void 0 ? [] : _ref$attrTags,
      _ref$open = _ref.open,
      open = _ref$open === void 0 ? false : _ref$open,
      handleTagClose = _ref.handleTagClose,
      updateTag = _ref.updateTag,
      deleteTag = _ref.deleteTag;

  var _React$useState = React.useState(""),
      value = _React$useState[0],
      setValue = _React$useState[1];

  var _React$useState2 = React.useState(false),
      colorOpen = _React$useState2[0],
      setColorOpen = _React$useState2[1];

  var _React$useState3 = React.useState("#000000"),
      color = _React$useState3[0],
      setColor = _React$useState3[1]; // console.log(tagColors);
  // Handle when users select a tag from existing tags;


  function handleChange(e, val) {
    setValue(val);
    setColor(tagColors[val]);
  } // Handle when users add a new tag;


  function handleInputChange(e) {
    // console.log(e.target.value);
    setValue(e.target.value);
  }

  ; // Toggle open/close color selector

  var handleClick = function handleClick() {
    setColorOpen(!colorOpen);
  }; // Close color selector


  var handleClose = function handleClose() {
    setColorOpen(false);
  }; // Update color selected


  var handleColorChange = function handleColorChange(color) {
    setColor(color.hex);
  }; // Add tag and associated color


  var handleAdd = function handleAdd() {
    if (value === "") {// handleTagClose();
    } else {
      updateTag(color, value); // handleTagClose();
    }

    setColor("#000000");
  }; // Delete tag for selected attribute


  var handleDelete = function handleDelete(value) {
    // console.log("deleting...", value);
    deleteTag(value);
  };

  var styles = {
    cover: {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px'
    }
  };
  var textStyle = {
    "margin": "24px 10px 0px 0px",
    "width": "300px"
  };
  var dialogContentStyle = {
    "display": "flex",
    "alignItems": "center"
  };
  var swatchStyle = {
    "margin": "24px 24px 0px 0px",
    "width": "48px",
    "height": "48px",
    "padding": "4px",
    "background": '#fff',
    "borderRadius": '4px',
    "boxShadow": '0 0 0 1px rgba(0,0,0,.1)',
    "display": 'inline-block',
    "cursor": 'pointer'
  };
  var colorStyle = {
    "width": "100%",
    "height": "100%",
    "borderRadius": '4px',
    "background": "" + color
  };
  var popoverStyle = {
    position: 'fixed',
    zIndex: '1301'
  };
  var stackStyle = {
    "display": attrTags.length > 0 ? "block" : "none",
    "margin": "24px 10px 0px 0px"
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Dialog, {
    open: open,
    onClose: handleTagClose
  }, /*#__PURE__*/React.createElement(DialogTitle, null, "Add or Edit Tags"), /*#__PURE__*/React.createElement(DialogContent, null, /*#__PURE__*/React.createElement(DialogContentText, null, "You are editing tags for the node: ", /*#__PURE__*/React.createElement("i", null, tagNode)), /*#__PURE__*/React.createElement(Stack, {
    style: stackStyle,
    direction: "row",
    spacing: 1
  }, attrTags.map(function (value, index) {
    return /*#__PURE__*/React.createElement(Chip, {
      label: value,
      variant: "outlined",
      onDelete: function onDelete() {
        return handleDelete(value);
      },
      sx: {
        "color": tagColors[value]
      }
    });
  })), /*#__PURE__*/React.createElement("div", {
    style: dialogContentStyle
  }, /*#__PURE__*/React.createElement(Autocomplete, {
    disablePortal: true,
    freeSolo: true,
    options: Object.keys(tagColors),
    sx: textStyle,
    onChange: function onChange(e, val) {
      return handleChange(e, val);
    },
    onInputChange: function onInputChange(e) {
      return handleInputChange(e);
    },
    renderInput: function renderInput(params) {
      return /*#__PURE__*/React.createElement(TextField, _extends({}, params, {
        label: "Tag Name"
      }));
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: swatchStyle,
    onClick: handleClick
  }, /*#__PURE__*/React.createElement("div", {
    style: colorStyle
  }), colorOpen ? /*#__PURE__*/React.createElement("div", {
    style: popoverStyle
  }, /*#__PURE__*/React.createElement("div", {
    style: styles.cover,
    onClick: handleClose
  }), /*#__PURE__*/React.createElement(SwatchesPicker, {
    color: color,
    onChange: handleColorChange
  })) : null))), /*#__PURE__*/React.createElement(DialogActions, null, /*#__PURE__*/React.createElement(Button, {
    onClick: handleTagClose
  }, "Close"), /*#__PURE__*/React.createElement(Button, {
    onClick: handleAdd
  }, "Add"))));
};