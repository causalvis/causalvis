"use strict";

exports.__esModule = true;
exports.Attribute = void 0;

var _react = _interopRequireWildcard(require("react"));

var _Button = _interopRequireDefault(require("@mui/material/Button"));

var _Menu = _interopRequireDefault(require("@mui/material/Menu"));

var _MenuItem = _interopRequireDefault(require("@mui/material/MenuItem"));

var _colors = require("@mui/material/colors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// import MoreVertIcon from '@mui/icons-material/MoreVert';
var Attribute = function Attribute(_ref) {
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
  };

  var _React$useState = _react["default"].useState(false),
      open = _React$useState[0],
      setOpen = _React$useState[1];

  var _React$useState2 = _react["default"].useState(null),
      anchorPos = _React$useState2[0],
      setAnchorPos = _React$useState2[1];

  function handleClose() {
    setAnchorPos(null);
    setOpen(false);
  } // Toggle open/close context menu for attributes that are added to graph


  function handleContextMenu(e) {
    e.preventDefault();

    if (isAdded) {
      setOpen(!open);
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
      handleClose();
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
      handleClose();
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
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_Button["default"], {
    sx: buttonStyle,
    onClick: function onClick() {
      return addAttribute(value);
    },
    onContextMenu: function onContextMenu(e) {
      return handleContextMenu(e);
    },
    variant: "outlined"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    title: "click to add"
  }, value)), /*#__PURE__*/_react["default"].createElement(_Menu["default"], {
    id: "basic-menu",
    anchorReference: "anchorPosition",
    anchorPosition: anchorPos,
    style: menuStyle,
    open: open,
    onClose: handleClose,
    MenuListProps: {
      'aria-labelledby': 'basic-button'
    }
  }, /*#__PURE__*/_react["default"].createElement(_MenuItem["default"], {
    onClick: handleTreatment,
    selected: value === treatment
  }, "Set as Treatment"), /*#__PURE__*/_react["default"].createElement(_MenuItem["default"], {
    onClick: handleOutcome,
    selected: value === outcome
  }, "Set as Outcome"), /*#__PURE__*/_react["default"].createElement(_MenuItem["default"], {
    onClick: handleTag
  }, "Edit Tags"), /*#__PURE__*/_react["default"].createElement(_MenuItem["default"], {
    onClick: handleDelete
  }, "Delete from Graph")));
};

exports.Attribute = Attribute;