import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { saveAs } from 'file-saver';
export var DownloadDAGDialog = function DownloadDAGDialog(_ref) {
  var _ref$open = _ref.open,
    open = _ref$open === void 0 ? false : _ref$open,
    _ref$selectedDAG = _ref.selectedDAG,
    selectedDAG = _ref$selectedDAG === void 0 ? {
      "nodes": [],
      "links": []
    } : _ref$selectedDAG,
    handleDAGClose = _ref.handleDAGClose;
  var _React$useState = React.useState([]),
    data = _React$useState[0],
    setData = _React$useState[1];
  var _React$useState2 = React.useState('selected'),
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
    saveAs(fileContent, filename + ".json");
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
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Dialog, {
    open: open,
    onClose: handleDAGClose,
    maxWidth: "lg"
  }, /*#__PURE__*/React.createElement(DialogTitle, null, "Download"), /*#__PURE__*/React.createElement(DialogContent, null, "Something"), /*#__PURE__*/React.createElement(DialogActions, null, /*#__PURE__*/React.createElement(Button, {
    onClick: handleDAGClose
  }, "Close"), /*#__PURE__*/React.createElement(Button, {
    onClick: handleDownload
  }, "Download"))));
};