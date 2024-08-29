"use strict";

exports.__esModule = true;
exports.DownloadDialog = void 0;

var _react = _interopRequireWildcard(require("react"));

var _Button = _interopRequireDefault(require("@mui/material/Button"));

var _Checkbox = _interopRequireDefault(require("@mui/material/Checkbox"));

var _Dialog = _interopRequireDefault(require("@mui/material/Dialog"));

var _DialogActions = _interopRequireDefault(require("@mui/material/DialogActions"));

var _DialogContent = _interopRequireDefault(require("@mui/material/DialogContent"));

var _DialogContentText = _interopRequireDefault(require("@mui/material/DialogContentText"));

var _DialogTitle = _interopRequireDefault(require("@mui/material/DialogTitle"));

var _FormControl = _interopRequireDefault(require("@mui/material/FormControl"));

var _FormLabel = _interopRequireDefault(require("@mui/material/FormLabel"));

var _FormGroup = _interopRequireDefault(require("@mui/material/FormGroup"));

var _FormControlLabel = _interopRequireDefault(require("@mui/material/FormControlLabel"));

var _TextField = _interopRequireDefault(require("@mui/material/TextField"));

var _fileSaver = require("file-saver");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var DownloadDialog = function DownloadDialog(_ref) {
  var _ref$open = _ref.open,
      open = _ref$open === void 0 ? false : _ref$open,
      _ref$nodelinks = _ref.nodelinks,
      nodelinks = _ref$nodelinks === void 0 ? {} : _ref$nodelinks,
      _ref$treatment = _ref.treatment,
      treatment = _ref$treatment === void 0 ? "" : _ref$treatment,
      _ref$outcome = _ref.outcome,
      outcome = _ref$outcome === void 0 ? "" : _ref$outcome,
      _ref$confounds = _ref.confounds,
      confounds = _ref$confounds === void 0 ? [] : _ref$confounds,
      _ref$colliders = _ref.colliders,
      colliders = _ref$colliders === void 0 ? [] : _ref$colliders,
      _ref$mediators = _ref.mediators,
      mediators = _ref$mediators === void 0 ? [] : _ref$mediators,
      _ref$prognostics = _ref.prognostics,
      prognostics = _ref$prognostics === void 0 ? [] : _ref$prognostics,
      handleClose = _ref.handleClose;

  var _React$useState = _react["default"].useState({
    nodelinkCheck: true,
    treatmentCheck: false,
    outcomeCheck: false,
    confoundsCheck: false,
    mediatorsCheck: false,
    collidersCheck: false,
    prognosticsCheck: false
  }),
      checked = _React$useState[0],
      setChecked = _React$useState[1];

  var _React$useState2 = _react["default"].useState(false),
      error = _React$useState2[0],
      setError = _React$useState2[1];

  var _React$useState3 = _react["default"].useState(''),
      downloadJSON = _React$useState3[0],
      setJSON = _React$useState3[1];

  var _React$useState4 = _react["default"].useState('DAG'),
      filename = _React$useState4[0],
      setFilename = _React$useState4[1]; // Update download json based on user selections


  (0, _react.useEffect)(function () {
    var newDownload = {};

    if (checked.nodelinkCheck) {
      newDownload.nodes = JSON.parse(JSON.stringify(nodelinks.nodes));

      for (var _iterator = _createForOfIteratorHelperLoose(newDownload.nodes), _step; !(_step = _iterator()).done;) {
        var n = _step.value;
        delete n.children;
        delete n.parents;
      }

      newDownload.links = JSON.parse(JSON.stringify(nodelinks.links));
    }

    if (checked.treatmentCheck) {
      newDownload.treatment = treatment;
    }

    if (checked.outcomeCheck) {
      newDownload.outcome = outcome;
    }

    if (checked.confoundsCheck) {
      newDownload.confounds = confounds;
    }

    if (checked.mediatorsCheck) {
      newDownload.mediators = mediators;
    }

    if (checked.collidersCheck) {
      newDownload.colliders = colliders;
    }

    if (checked.prognosticsCheck) {
      newDownload.prognostics = prognostics;
    }

    setJSON(newDownload);
  }, [checked, nodelinks, treatment, outcome, confounds, colliders, mediators, prognostics]);

  function handleChange(val) {
    checked[val] = !checked[val];
    var checkedValues = Object.values(checked);
    var newError = checkedValues.filter(function (v) {
      return v;
    }).length < 1;
    setChecked(_extends({}, checked));
    setError(newError);
  }

  function download() {
    var fileContent = new Blob([JSON.stringify(downloadJSON, null, 4)], {
      type: 'application/json',
      name: filename + ".json"
    });
    (0, _fileSaver.saveAs)(fileContent, filename + ".json");
  }

  function handleFilenameChange(e) {
    setFilename(e.target.value);
  }

  var dataStyle = {
    "display": "flex"
  };
  var checkboxStyle = {
    "width": "250px"
  };
  var textStyle = {
    "margin": "24px 24px 0px 0px"
  };
  var filenameStyle = {
    "marginBottom": "24px"
  };
  var fullWidth = true;
  var maxWidth = "md";
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_Dialog["default"], {
    open: open,
    onClose: handleClose,
    fullWidth: fullWidth,
    maxWidth: maxWidth
  }, /*#__PURE__*/_react["default"].createElement(_DialogTitle["default"], null, "Download"), /*#__PURE__*/_react["default"].createElement(_DialogContent["default"], null, /*#__PURE__*/_react["default"].createElement(_TextField["default"], {
    style: filenameStyle,
    defaultValue: filename,
    id: "outlined-basic",
    label: "Filename",
    variant: "standard",
    onChange: function onChange(e) {
      return handleFilenameChange(e);
    }
  }), /*#__PURE__*/_react["default"].createElement(_DialogContentText["default"], null, "Select the data you would like to include. Your file will be saved as ", /*#__PURE__*/_react["default"].createElement("i", null, filename, ".json"), "."), /*#__PURE__*/_react["default"].createElement("div", {
    style: dataStyle
  }, /*#__PURE__*/_react["default"].createElement(_FormControl["default"], {
    required: true,
    error: error,
    component: "fieldset",
    sx: {
      m: 3
    },
    variant: "standard"
  }, /*#__PURE__*/_react["default"].createElement(_FormLabel["default"], {
    component: "legend"
  }, "Select at least one"), /*#__PURE__*/_react["default"].createElement(_FormGroup["default"], {
    style: checkboxStyle
  }, /*#__PURE__*/_react["default"].createElement(_FormControlLabel["default"], {
    control: /*#__PURE__*/_react["default"].createElement(_Checkbox["default"], {
      checked: checked.nodelinkCheck,
      onChange: function onChange() {
        return handleChange("nodelinkCheck");
      }
    }),
    label: "Node-Link"
  }), /*#__PURE__*/_react["default"].createElement(_FormControlLabel["default"], {
    control: /*#__PURE__*/_react["default"].createElement(_Checkbox["default"], {
      checked: checked.treatmentCheck,
      onChange: function onChange() {
        return handleChange("treatmentCheck");
      }
    }),
    label: "Treatment"
  }), /*#__PURE__*/_react["default"].createElement(_FormControlLabel["default"], {
    control: /*#__PURE__*/_react["default"].createElement(_Checkbox["default"], {
      checked: checked.outcomeCheck,
      onChange: function onChange() {
        return handleChange("outcomeCheck");
      }
    }),
    label: "Outcome"
  }), /*#__PURE__*/_react["default"].createElement(_FormControlLabel["default"], {
    control: /*#__PURE__*/_react["default"].createElement(_Checkbox["default"], {
      checked: checked.confoundsCheck,
      onChange: function onChange() {
        return handleChange("confoundsCheck");
      }
    }),
    label: "Confounds"
  }), /*#__PURE__*/_react["default"].createElement(_FormControlLabel["default"], {
    control: /*#__PURE__*/_react["default"].createElement(_Checkbox["default"], {
      checked: checked.mediatorsCheck,
      onChange: function onChange() {
        return handleChange("mediatorsCheck");
      }
    }),
    label: "Mediators"
  }), /*#__PURE__*/_react["default"].createElement(_FormControlLabel["default"], {
    control: /*#__PURE__*/_react["default"].createElement(_Checkbox["default"], {
      checked: checked.collidersCheck,
      onChange: function onChange() {
        return handleChange("collidersCheck");
      }
    }),
    label: "Colliders"
  }), /*#__PURE__*/_react["default"].createElement(_FormControlLabel["default"], {
    control: /*#__PURE__*/_react["default"].createElement(_Checkbox["default"], {
      checked: checked.prognosticsCheck,
      onChange: function onChange() {
        return handleChange("prognosticsCheck");
      }
    }),
    label: "Prognostics"
  }))), /*#__PURE__*/_react["default"].createElement(_TextField["default"], {
    style: textStyle,
    id: "outlined-multiline-flexible",
    multiline: true,
    fullWidth: true,
    maxRows: 20,
    value: JSON.stringify(downloadJSON, null, 4),
    InputProps: {
      readOnly: true
    }
  }))), /*#__PURE__*/_react["default"].createElement(_DialogActions["default"], null, /*#__PURE__*/_react["default"].createElement(_Button["default"], {
    onClick: handleClose
  }, "Cancel"), /*#__PURE__*/_react["default"].createElement(_Button["default"], {
    onClick: download
  }, "Save"))));
};

exports.DownloadDialog = DownloadDialog;