"use strict";

exports.__esModule = true;
exports.SMDMenu = void 0;

var _react = _interopRequireWildcard(require("react"));

var _d3Array = require("d3-array");

var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));

var _Menu = _interopRequireDefault(require("@mui/material/Menu"));

var _MenuItem = _interopRequireDefault(require("@mui/material/MenuItem"));

var _MoreVert = _interopRequireDefault(require("@mui/icons-material/MoreVert"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var SMDMenu = function SMDMenu(_ref) {
  var setSort = _ref.setSort;

  // Control sort menu
  var _React$useState = _react["default"].useState(false),
      open = _React$useState[0],
      setOpen = _React$useState[1];

  var _React$useState2 = _react["default"].useState(null),
      anchorEl = _React$useState2[0],
      setAnchorEl = _React$useState2[1];

  var _React$useState3 = _react["default"].useState("Adjusted High to Low"),
      selectedOption = _React$useState3[0],
      setSelectedOption = _React$useState3[1];

  var sortOptions = ["Adjusted High to Low", "Adjusted Low to High", "Unadjusted High to Low", "Unadjusted Low to High", "A-Z Alphebatically", "Z-A Alphebatically", "Difference High to Low", "Difference Low to High"];

  function changeSort(e, s) {
    // console.log("changing sort...");
    var newSMD;

    if (s === selectedOption) {
      return;
    }

    setSort(s); // if (s === "Adjusted High to Low") {
    //   newSMD = SMDDataset.sort((a, b) => a.adjusted > b.adjusted);
    // } else if (s === "Adjusted Low to High") {
    //   newSMD = SMDDataset.sort((a, b) => a.adjusted < b.adjusted);
    // } else if (s === "Unadjusted High to Low") {
    //   newSMD = SMDDataset.sort((a, b) => a.unadjusted > b.unadjusted);
    // } else if (s === "Unadjusted Low to High") {
    //   newSMD = SMDDataset.sort((a, b) => a.unadjusted < b.unadjusted);
    // }
    // let newSMDExtent = [Math.min(min(newSMD, d => d.unadjusted), min(newSMD, d => d.adjusted)), Math.max(max(newSMD, d => d.unadjusted), max(newSMD, d => d.adjusted))];
    // setSMD([...newSMD]);
    // setOpen(!open);

    setOpen(false);
    setAnchorEl(null);
    setSelectedOption(s);
  }

  var handleClick = function handleClick(e) {
    // console.log(e);
    // setSMD([...SMD]);
    // console.log("click");
    setOpen(true);
    setAnchorEl(e.target);
  };

  var handleClose = function handleClose() {
    // setSMD([...SMD]);
    // console.log('close');
    setOpen(false);
    setAnchorEl(null);
  };

  var iconButtonStyle = {
    "marginTop": "42px"
  };
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_IconButton["default"], {
    style: iconButtonStyle,
    onClick: function onClick(e) {
      return handleClick(e);
    }
  }, /*#__PURE__*/_react["default"].createElement(_MoreVert["default"], null)), /*#__PURE__*/_react["default"].createElement(_Menu["default"], {
    id: "long-menu",
    anchorEl: anchorEl,
    open: open,
    onClose: handleClose
  }, sortOptions.map(function (option, i) {
    return /*#__PURE__*/_react["default"].createElement(_MenuItem["default"], {
      key: i,
      onClick: function onClick(e) {
        return changeSort(e, option);
      },
      selected: option === selectedOption
    }, option);
  }))));
};

exports.SMDMenu = SMDMenu;