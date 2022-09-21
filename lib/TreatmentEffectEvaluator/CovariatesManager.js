"use strict";

exports.__esModule = true;
exports.CovariatesManager = void 0;

var _react = _interopRequireWildcard(require("react"));

var _styles = require("@mui/material/styles");

var _colors = require("@mui/material/colors");

var _Covariate = require("./Covariate");

var _Button = _interopRequireDefault(require("@mui/material/Button"));

var _Menu = _interopRequireDefault(require("@mui/material/Menu"));

var _MenuItem = _interopRequireDefault(require("@mui/material/MenuItem"));

var _AddOutlined = _interopRequireDefault(require("@mui/icons-material/AddOutlined"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var CovariatesManager = function CovariatesManager(_ref) {
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
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
    style: attrStyle
  }, attributes.map(function (value, index) {
    return /*#__PURE__*/_react["default"].createElement(_Covariate.Covariate, {
      value: value,
      key: "covariate" + index,
      changeStratify: changeStratify,
      color: stratify.indexOf(value) < 0 ? "grey" : "black"
    });
  })));
};

exports.CovariatesManager = CovariatesManager;