"use strict";

exports.__esModule = true;
exports.Covariate = void 0;

var _react = _interopRequireWildcard(require("react"));

var _Button = _interopRequireDefault(require("@mui/material/Button"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var Covariate = function Covariate(_ref) {
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
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_Button["default"], {
    sx: buttonStyle,
    onClick: function onClick() {
      return changeStratify(value);
    },
    variant: "outlined"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    title: "click to add"
  }, value)));
};

exports.Covariate = Covariate;