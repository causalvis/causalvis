"use strict";

exports.__esModule = true;
exports.DownloadDAGDialog = void 0;

var _react = _interopRequireWildcard(require("react"));

var _Button = _interopRequireDefault(require("@mui/material/Button"));

var _Dialog = _interopRequireDefault(require("@mui/material/Dialog"));

var _DialogActions = _interopRequireDefault(require("@mui/material/DialogActions"));

var _DialogContent = _interopRequireDefault(require("@mui/material/DialogContent"));

var _DialogContentText = _interopRequireDefault(require("@mui/material/DialogContentText"));

var _DialogTitle = _interopRequireDefault(require("@mui/material/DialogTitle"));

var _Table = _interopRequireDefault(require("@mui/material/Table"));

var _TableBody = _interopRequireDefault(require("@mui/material/TableBody"));

var _TableCell = _interopRequireDefault(require("@mui/material/TableCell"));

var _TableContainer = _interopRequireDefault(require("@mui/material/TableContainer"));

var _TableHead = _interopRequireDefault(require("@mui/material/TableHead"));

var _TableRow = _interopRequireDefault(require("@mui/material/TableRow"));

var _TextField = _interopRequireDefault(require("@mui/material/TextField"));

var _Paper = _interopRequireDefault(require("@mui/material/Paper"));

var _fileSaver = require("file-saver");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var DownloadDAGDialog = function DownloadDAGDialog(_ref) {
  var _ref$open = _ref.open,
      open = _ref$open === void 0 ? false : _ref$open,
      _ref$selectedDAG = _ref.selectedDAG,
      selectedDAG = _ref$selectedDAG === void 0 ? {
    "nodes": [],
    "links": []
  } : _ref$selectedDAG,
      handleDAGClose = _ref.handleDAGClose;

  var _React$useState = _react["default"].useState([]),
      data = _React$useState[0],
      setData = _React$useState[1];

  var _React$useState2 = _react["default"].useState('selected'),
      filename = _React$useState2[0],
      setFilename = _React$useState2[1];

  function handleFilenameChange(e) {
    setFilename(e.target.value);
  }

  function handleDownload() {
    var fileContent = new Blob([JSON.stringify(data, null, 4)], {
      type: 'application/json',
      name: filename + ".json"
    });
    (0, _fileSaver.saveAs)(fileContent, filename + ".json");
    handleDAGClose();
  }

  var textStyle = {
    "marginBottom": "16px"
  };
  var paragraphStyle = {
    "fontFamily": "sans-serif",
    "fontSize": "12px"
  };
  var filenameStyle = {
    "marginBottom": "24px"
  };
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_Dialog["default"], {
    open: open,
    onClose: handleDAGClose,
    maxWidth: "lg"
  }, /*#__PURE__*/_react["default"].createElement(_DialogTitle["default"], null, "Download"), /*#__PURE__*/_react["default"].createElement(_DialogContent["default"], null, "Something"), /*#__PURE__*/_react["default"].createElement(_DialogActions["default"], null, /*#__PURE__*/_react["default"].createElement(_Button["default"], {
    onClick: handleDAGClose
  }, "Close"), /*#__PURE__*/_react["default"].createElement(_Button["default"], {
    onClick: handleDownload
  }, "Download"))));
};

exports.DownloadDAGDialog = DownloadDAGDialog;