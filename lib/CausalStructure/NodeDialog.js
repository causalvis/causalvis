"use strict";

exports.__esModule = true;
exports.NodeDialog = void 0;

var _react = _interopRequireWildcard(require("react"));

var _Button = _interopRequireDefault(require("@mui/material/Button"));

var _Dialog = _interopRequireDefault(require("@mui/material/Dialog"));

var _DialogActions = _interopRequireDefault(require("@mui/material/DialogActions"));

var _DialogContent = _interopRequireDefault(require("@mui/material/DialogContent"));

var _DialogContentText = _interopRequireDefault(require("@mui/material/DialogContentText"));

var _DialogTitle = _interopRequireDefault(require("@mui/material/DialogTitle"));

var _TextField = _interopRequireDefault(require("@mui/material/TextField"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var NodeDialog = function NodeDialog(_ref) {
  var _ref$open = _ref.open,
      open = _ref$open === void 0 ? false : _ref$open,
      handleNodeClose = _ref.handleNodeClose,
      addAttribute = _ref.addAttribute,
      addCustom = _ref.addCustom;

  var _React$useState = _react["default"].useState(""),
      value = _React$useState[0],
      setValue = _React$useState[1];

  function handleChange(e) {
    setValue(e.target.value);
  }

  ; // Add node with input attribute name

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
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_Dialog["default"], {
    open: open,
    onClose: handleNodeClose
  }, /*#__PURE__*/_react["default"].createElement(_DialogContent["default"], null, /*#__PURE__*/_react["default"].createElement(_DialogContentText["default"], null, "Add Custom Node"), /*#__PURE__*/_react["default"].createElement(_TextField["default"], {
    style: textStyle,
    id: "outlined-basic",
    label: "Variable Name",
    variant: "outlined",
    onChange: function onChange(e) {
      return handleChange(e);
    }
  })), /*#__PURE__*/_react["default"].createElement(_DialogActions["default"], null, /*#__PURE__*/_react["default"].createElement(_Button["default"], {
    onClick: handleNodeClose
  }, "Cancel"), /*#__PURE__*/_react["default"].createElement(_Button["default"], {
    onClick: handleAdd
  }, "Add"))));
};

exports.NodeDialog = NodeDialog;