function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _createForOfIteratorHelperLoose(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: !0 } : { done: !1, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import { saveAs } from 'file-saver';
export var DownloadDialog = function DownloadDialog(_ref) {
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
  var _React$useState = React.useState({
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
  var _React$useState2 = React.useState(false),
    error = _React$useState2[0],
    setError = _React$useState2[1];
  var _React$useState3 = React.useState(''),
    downloadJSON = _React$useState3[0],
    setJSON = _React$useState3[1];
  var _React$useState4 = React.useState('DAG'),
    filename = _React$useState4[0],
    setFilename = _React$useState4[1];

  // Update download json based on user selections
  useEffect(function () {
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
    saveAs(fileContent, filename + ".json");
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
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Dialog, {
    open: open,
    onClose: handleClose,
    fullWidth: fullWidth,
    maxWidth: maxWidth
  }, /*#__PURE__*/React.createElement(DialogTitle, null, "Download"), /*#__PURE__*/React.createElement(DialogContent, null, /*#__PURE__*/React.createElement(TextField, {
    style: filenameStyle,
    defaultValue: filename,
    id: "outlined-basic",
    label: "Filename",
    variant: "standard",
    onChange: function onChange(e) {
      return handleFilenameChange(e);
    }
  }), /*#__PURE__*/React.createElement(DialogContentText, null, "Select the data you would like to include. Your file will be saved as ", /*#__PURE__*/React.createElement("i", null, filename, ".json"), "."), /*#__PURE__*/React.createElement("div", {
    style: dataStyle
  }, /*#__PURE__*/React.createElement(FormControl, {
    required: true,
    error: error,
    component: "fieldset",
    sx: {
      m: 3
    },
    variant: "standard"
  }, /*#__PURE__*/React.createElement(FormLabel, {
    component: "legend"
  }, "Select at least one"), /*#__PURE__*/React.createElement(FormGroup, {
    style: checkboxStyle
  }, /*#__PURE__*/React.createElement(FormControlLabel, {
    control: /*#__PURE__*/React.createElement(Checkbox, {
      checked: checked.nodelinkCheck,
      onChange: function onChange() {
        return handleChange("nodelinkCheck");
      }
    }),
    label: "Node-Link"
  }), /*#__PURE__*/React.createElement(FormControlLabel, {
    control: /*#__PURE__*/React.createElement(Checkbox, {
      checked: checked.treatmentCheck,
      onChange: function onChange() {
        return handleChange("treatmentCheck");
      }
    }),
    label: "Treatment"
  }), /*#__PURE__*/React.createElement(FormControlLabel, {
    control: /*#__PURE__*/React.createElement(Checkbox, {
      checked: checked.outcomeCheck,
      onChange: function onChange() {
        return handleChange("outcomeCheck");
      }
    }),
    label: "Outcome"
  }), /*#__PURE__*/React.createElement(FormControlLabel, {
    control: /*#__PURE__*/React.createElement(Checkbox, {
      checked: checked.confoundsCheck,
      onChange: function onChange() {
        return handleChange("confoundsCheck");
      }
    }),
    label: "Confounds"
  }), /*#__PURE__*/React.createElement(FormControlLabel, {
    control: /*#__PURE__*/React.createElement(Checkbox, {
      checked: checked.mediatorsCheck,
      onChange: function onChange() {
        return handleChange("mediatorsCheck");
      }
    }),
    label: "Mediators"
  }), /*#__PURE__*/React.createElement(FormControlLabel, {
    control: /*#__PURE__*/React.createElement(Checkbox, {
      checked: checked.collidersCheck,
      onChange: function onChange() {
        return handleChange("collidersCheck");
      }
    }),
    label: "Colliders"
  }), /*#__PURE__*/React.createElement(FormControlLabel, {
    control: /*#__PURE__*/React.createElement(Checkbox, {
      checked: checked.prognosticsCheck,
      onChange: function onChange() {
        return handleChange("prognosticsCheck");
      }
    }),
    label: "Prognostics"
  }))), /*#__PURE__*/React.createElement(TextField, {
    style: textStyle,
    id: "outlined-multiline-flexible",
    multiline: true,
    fullWidth: true,
    maxRows: 20,
    value: JSON.stringify(downloadJSON, null, 4),
    InputProps: {
      readOnly: true
    }
  }))), /*#__PURE__*/React.createElement(DialogActions, null, /*#__PURE__*/React.createElement(Button, {
    onClick: handleClose
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    onClick: download
  }, "Save"))));
};