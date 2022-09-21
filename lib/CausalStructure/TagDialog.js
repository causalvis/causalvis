"use strict";

exports.__esModule = true;
exports.TagDialog = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactColor = require("react-color");

var _Autocomplete = _interopRequireDefault(require("@mui/material/Autocomplete"));

var _Button = _interopRequireDefault(require("@mui/material/Button"));

var _Chip = _interopRequireDefault(require("@mui/material/Chip"));

var _Dialog = _interopRequireDefault(require("@mui/material/Dialog"));

var _DialogActions = _interopRequireDefault(require("@mui/material/DialogActions"));

var _DialogContent = _interopRequireDefault(require("@mui/material/DialogContent"));

var _DialogContentText = _interopRequireDefault(require("@mui/material/DialogContentText"));

var _DialogTitle = _interopRequireDefault(require("@mui/material/DialogTitle"));

var _Stack = _interopRequireDefault(require("@mui/material/Stack"));

var _TextField = _interopRequireDefault(require("@mui/material/TextField"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// import { saveAs } from 'file-saver';
var TagDialog = function TagDialog(_ref) {
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

  var _React$useState = _react["default"].useState(""),
      value = _React$useState[0],
      setValue = _React$useState[1];

  var _React$useState2 = _react["default"].useState(false),
      colorOpen = _React$useState2[0],
      setColorOpen = _React$useState2[1];

  var _React$useState3 = _react["default"].useState("#000000"),
      color = _React$useState3[0],
      setColor = _React$useState3[1]; // Handle when users select a tag from existing tags;


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
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_Dialog["default"], {
    open: open,
    onClose: handleTagClose
  }, /*#__PURE__*/_react["default"].createElement(_DialogTitle["default"], null, "Add or Edit Tags"), /*#__PURE__*/_react["default"].createElement(_DialogContent["default"], null, /*#__PURE__*/_react["default"].createElement(_DialogContentText["default"], null, "You are editing tags for the node: ", /*#__PURE__*/_react["default"].createElement("i", null, tagNode)), /*#__PURE__*/_react["default"].createElement(_Stack["default"], {
    style: stackStyle,
    direction: "row",
    spacing: 1
  }, attrTags.map(function (value, index) {
    return /*#__PURE__*/_react["default"].createElement(_Chip["default"], {
      label: value,
      variant: "outlined",
      onDelete: function onDelete() {
        return handleDelete(value);
      },
      sx: {
        "color": tagColors[value]
      }
    });
  })), /*#__PURE__*/_react["default"].createElement("div", {
    style: dialogContentStyle
  }, /*#__PURE__*/_react["default"].createElement(_Autocomplete["default"], {
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
      return /*#__PURE__*/_react["default"].createElement(_TextField["default"], _extends({}, params, {
        label: "Tag Name"
      }));
    }
  }), /*#__PURE__*/_react["default"].createElement("div", {
    style: swatchStyle,
    onClick: handleClick
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: colorStyle
  }), colorOpen ? /*#__PURE__*/_react["default"].createElement("div", {
    style: popoverStyle
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.cover,
    onClick: handleClose
  }), /*#__PURE__*/_react["default"].createElement(_reactColor.SwatchesPicker, {
    color: color,
    onChange: handleColorChange
  })) : null))), /*#__PURE__*/_react["default"].createElement(_DialogActions["default"], null, /*#__PURE__*/_react["default"].createElement(_Button["default"], {
    onClick: handleTagClose
  }, "Close"), /*#__PURE__*/_react["default"].createElement(_Button["default"], {
    onClick: handleAdd
  }, "Add"))));
};

exports.TagDialog = TagDialog;