"use strict";

var _react = _interopRequireWildcard(require("react"));
var _reactDom = require("react-dom");
var _DAG = require("./DAG.js");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
var Causalvis = function Causalvis() {
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("h1", {
    style: {
      "fontFamily": "sans-serif"
    }
  }, "Causalvis"), /*#__PURE__*/_react["default"].createElement("p", {
    style: {
      "fontFamily": "sans-serif"
    }
  }, "This is a browser demo of the DAG module in the ", /*#__PURE__*/_react["default"].createElement("a", {
    href: "https://github.com/causalvis/causalvis"
  }, "Causalvis Python package"), ". For more information about this work, please refer to ", /*#__PURE__*/_react["default"].createElement("a", {
    href: "https://dl.acm.org/doi/full/10.1145/3544548.3581236"
  }, "our paper"), "."), /*#__PURE__*/_react["default"].createElement(_DAG.DAG, null));
};
(0, _reactDom.render)( /*#__PURE__*/_react["default"].createElement(Causalvis, null), document.querySelector('#app'));