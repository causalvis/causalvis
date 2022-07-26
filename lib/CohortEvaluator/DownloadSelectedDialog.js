"use strict";

exports.__esModule = true;
exports.DownloadSelectedDialog = void 0;

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

var DownloadSelectedDialog = function DownloadSelectedDialog(_ref) {
  var _ref$open = _ref.open,
      open = _ref$open === void 0 ? false : _ref$open,
      handleDownloadClose = _ref.handleDownloadClose,
      selectedItems = _ref.selectedItems;

  var _React$useState = _react["default"].useState([]),
      attributes = _React$useState[0],
      setAttributes = _React$useState[1];

  var _React$useState2 = _react["default"].useState([]),
      data = _React$useState2[0],
      setData = _React$useState2[1];

  var _React$useState3 = _react["default"].useState('selected'),
      filename = _React$useState3[0],
      setFilename = _React$useState3[1];

  (0, _react.useEffect)(function () {
    if (selectedItems.confounds.length > 0) {
      var newAttributes = Object.keys(selectedItems.confounds[0]);
      var newData = JSON.parse(JSON.stringify(selectedItems.confounds));
      newData = newData.map(function (d, i) {
        d.propensity = selectedItems.propensity[i];
        d.treatment = selectedItems.treatment[i];
        return d;
      });
      setAttributes([].concat(newAttributes, ["propensity", "treatment"]));
      setData(newData);
    } else {
      setAttributes([]);
      setData([]);
    }
  }, [selectedItems]);

  function handleFilenameChange(e) {
    setFilename(e.target.value);
  }

  function handleDownload() {
    var fileContent = new Blob([JSON.stringify(data, null, 4)], {
      type: 'application/json',
      name: filename + ".json"
    });
    (0, _fileSaver.saveAs)(fileContent, filename + ".json");
    handleDownloadClose();
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
    onClose: handleDownloadClose,
    maxWidth: "lg"
  }, /*#__PURE__*/_react["default"].createElement(_DialogTitle["default"], null, "Download"), /*#__PURE__*/_react["default"].createElement(_DialogContent["default"], null, data.length > 0 && data.length < 1000 ? /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_TextField["default"], {
    style: filenameStyle,
    defaultValue: filename,
    id: "outlined-basic",
    label: "Filename",
    variant: "standard",
    onChange: function onChange(e) {
      return handleFilenameChange(e);
    }
  }), /*#__PURE__*/_react["default"].createElement(_DialogContentText["default"], {
    style: textStyle
  }, "The following data items will be downloaded as ", /*#__PURE__*/_react["default"].createElement("i", null, filename, ".json"), "."), /*#__PURE__*/_react["default"].createElement(_TableContainer["default"], {
    component: _Paper["default"]
  }, /*#__PURE__*/_react["default"].createElement(_Table["default"], {
    sx: {
      minWidth: 650
    },
    "aria-label": "simple table",
    size: "small"
  }, /*#__PURE__*/_react["default"].createElement(_TableHead["default"], null, /*#__PURE__*/_react["default"].createElement(_TableRow["default"], null, attributes.map(function (a, j) {
    return /*#__PURE__*/_react["default"].createElement(_TableCell["default"], {
      key: "header" + j,
      component: "th",
      scope: "row"
    }, a);
  }))), /*#__PURE__*/_react["default"].createElement(_TableBody["default"], null, data.map(function (d, i) {
    return /*#__PURE__*/_react["default"].createElement(_TableRow["default"], {
      key: i,
      sx: {
        '&:last-child td, &:last-child th': {
          border: 0
        }
      }
    }, attributes.map(function (a) {
      return /*#__PURE__*/_react["default"].createElement(_TableCell["default"], {
        component: "th",
        scope: "row"
      }, d[a]);
    }));
  }))))) : data.length > 1000 ? /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_TextField["default"], {
    style: filenameStyle,
    defaultValue: filename,
    id: "outlined-basic",
    label: "Filename",
    variant: "standard",
    onChange: function onChange(e) {
      return handleFilenameChange(e);
    }
  }), /*#__PURE__*/_react["default"].createElement(_DialogContentText["default"], null, "File size too large for preview. Selected data items will be downloaded as ", /*#__PURE__*/_react["default"].createElement("i", null, filename, ".json"), ".")) : /*#__PURE__*/_react["default"].createElement(_DialogContentText["default"], null, "Select items from the propensity score plot to download.")), /*#__PURE__*/_react["default"].createElement(_DialogActions["default"], null, /*#__PURE__*/_react["default"].createElement(_Button["default"], {
    onClick: handleDownloadClose
  }, "Close"), selectedItems.confounds.length > 0 ? /*#__PURE__*/_react["default"].createElement(_Button["default"], {
    onClick: handleDownload
  }, "Download") : null)));
};

exports.DownloadSelectedDialog = DownloadSelectedDialog;