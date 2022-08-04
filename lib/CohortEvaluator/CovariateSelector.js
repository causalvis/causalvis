"use strict";

exports.__esModule = true;
exports.CovariateSelector = void 0;

var _react = _interopRequireWildcard(require("react"));

var _Button = _interopRequireDefault(require("@mui/material/Button"));

var _Checkbox = _interopRequireDefault(require("@mui/material/Checkbox"));

var _Dialog = _interopRequireDefault(require("@mui/material/Dialog"));

var _DialogActions = _interopRequireDefault(require("@mui/material/DialogActions"));

var _DialogContent = _interopRequireDefault(require("@mui/material/DialogContent"));

var _DialogContentText = _interopRequireDefault(require("@mui/material/DialogContentText"));

var _DialogTitle = _interopRequireDefault(require("@mui/material/DialogTitle"));

var _FormLabel = _interopRequireDefault(require("@mui/material/FormLabel"));

var _FormControl = _interopRequireDefault(require("@mui/material/FormControl"));

var _FormGroup = _interopRequireDefault(require("@mui/material/FormGroup"));

var _FormControlLabel = _interopRequireDefault(require("@mui/material/FormControlLabel"));

var _TextField = _interopRequireDefault(require("@mui/material/TextField"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var CovariateSelector = function CovariateSelector(_ref) {
  var _ref$open = _ref.open,
      open = _ref$open === void 0 ? false : _ref$open,
      handleClose = _ref.handleClose,
      attributes = _ref.attributes,
      addedAttributes = _ref.addedAttributes,
      groupEditCovariate = _ref.groupEditCovariate;

  var _React$useState = _react["default"].useState(""),
      value = _React$useState[0],
      setValue = _React$useState[1];

  var _React$useState2 = _react["default"].useState(new Set()),
      selected = _React$useState2[0],
      setSelected = _React$useState2[1];

  function handleChange(a) {
    var newSelected = new Set(selected);

    if (newSelected.has(a)) {
      newSelected["delete"](a);
    } else {
      newSelected.add(a);
    }

    setSelected(new Set(newSelected));
  }

  ;

  function handleConfirm() {
    groupEditCovariate(selected);
    handleClose();
  } // Add node with input attribute name
  // function handleAdd() {
  //   console.log("adding");
  // }


  (0, _react.useEffect)(function () {
    setSelected(new Set(addedAttributes));
  }, [addedAttributes]);
  var textStyle = {
    "margin": "24px 24px 0px 0px"
  };
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_Dialog["default"], {
    open: open,
    onClose: handleClose
  }, /*#__PURE__*/_react["default"].createElement(_DialogContent["default"], null, /*#__PURE__*/_react["default"].createElement(_DialogContentText["default"], null, "Show/Hide Covariates"), /*#__PURE__*/_react["default"].createElement(_FormControl["default"], {
    sx: {
      m: 3
    },
    component: "fieldset",
    variant: "standard"
  }, /*#__PURE__*/_react["default"].createElement(_FormGroup["default"], null, attributes.map(function (a, i) {
    return /*#__PURE__*/_react["default"].createElement(_FormControlLabel["default"], {
      key: "attr-selector-" + a,
      control: /*#__PURE__*/_react["default"].createElement(_Checkbox["default"], {
        checked: selected.has(a),
        onChange: function onChange() {
          return handleChange(a);
        },
        name: a
      }),
      label: a
    });
  })))), /*#__PURE__*/_react["default"].createElement(_DialogActions["default"], null, /*#__PURE__*/_react["default"].createElement(_Button["default"], {
    onClick: function onClick() {
      return handleClose();
    }
  }, "Cancel"), /*#__PURE__*/_react["default"].createElement(_Button["default"], {
    onClick: function onClick() {
      return handleConfirm();
    }
  }, "Confirm"))));
};

exports.CovariateSelector = CovariateSelector;