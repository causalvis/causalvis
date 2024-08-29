"use strict";

exports.__esModule = true;
exports.AttributesManager = void 0;

var _react = _interopRequireWildcard(require("react"));

var _styles = require("@mui/material/styles");

var _colors = require("@mui/material/colors");

var _Attribute = require("./Attribute");

var _Button = _interopRequireDefault(require("@mui/material/Button"));

var _Menu = _interopRequireDefault(require("@mui/material/Menu"));

var _MenuItem = _interopRequireDefault(require("@mui/material/MenuItem"));

var _AddOutlined = _interopRequireDefault(require("@mui/icons-material/AddOutlined"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var AttributesManager = function AttributesManager(_ref) {
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
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_Button["default"], {
    style: buttonStyle,
    startIcon: /*#__PURE__*/_react["default"].createElement(_AddOutlined["default"], null),
    variant: "contained",
    onClick: function onClick() {
      return handleNodeOpen();
    }
  }, /*#__PURE__*/_react["default"].createElement("a", {
    title: "click to add"
  }, "Add Node")), /*#__PURE__*/_react["default"].createElement("div", {
    style: attrStyle
  }, attributes.map(function (value, index) {
    return /*#__PURE__*/_react["default"].createElement(_Attribute.Attribute, {
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

exports.AttributesManager = AttributesManager;