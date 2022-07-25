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
export var DownloadSelectedDialog = function DownloadSelectedDialog(_ref) {
  var _ref$open = _ref.open,
      open = _ref$open === void 0 ? false : _ref$open,
      handleDownloadClose = _ref.handleDownloadClose,
      selectedItems = _ref.selectedItems;

  var _React$useState = React.useState([]),
      attributes = _React$useState[0],
      setAttributes = _React$useState[1];

  var _React$useState2 = React.useState([]),
      data = _React$useState2[0],
      setData = _React$useState2[1];

  var _React$useState3 = React.useState('selected'),
      filename = _React$useState3[0],
      setFilename = _React$useState3[1];

  useEffect(function () {
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
    saveAs(fileContent, filename + ".json");
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
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Dialog, {
    open: open,
    onClose: handleDownloadClose,
    maxWidth: "lg"
  }, /*#__PURE__*/React.createElement(DialogTitle, null, "Download"), /*#__PURE__*/React.createElement(DialogContent, null, data.length > 0 && data.length < 1000 ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TextField, {
    style: filenameStyle,
    defaultValue: filename,
    id: "outlined-basic",
    label: "Filename",
    variant: "standard",
    onChange: function onChange(e) {
      return handleFilenameChange(e);
    }
  }), /*#__PURE__*/React.createElement(DialogContentText, {
    style: textStyle
  }, "The following data items will be downloaded as ", /*#__PURE__*/React.createElement("i", null, filename, ".json"), "."), /*#__PURE__*/React.createElement(TableContainer, {
    component: Paper
  }, /*#__PURE__*/React.createElement(Table, {
    sx: {
      minWidth: 650
    },
    "aria-label": "simple table",
    size: "small"
  }, /*#__PURE__*/React.createElement(TableHead, null, /*#__PURE__*/React.createElement(TableRow, null, attributes.map(function (a) {
    return /*#__PURE__*/React.createElement(TableCell, {
      component: "th",
      scope: "row"
    }, a);
  }))), /*#__PURE__*/React.createElement(TableBody, null, data.map(function (d, i) {
    return /*#__PURE__*/React.createElement(TableRow, {
      key: i,
      sx: {
        '&:last-child td, &:last-child th': {
          border: 0
        }
      }
    }, attributes.map(function (a) {
      return /*#__PURE__*/React.createElement(TableCell, {
        component: "th",
        scope: "row"
      }, d[a]);
    }));
  }))))) : data.length > 1000 ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TextField, {
    style: filenameStyle,
    defaultValue: filename,
    id: "outlined-basic",
    label: "Filename",
    variant: "standard",
    onChange: function onChange(e) {
      return handleFilenameChange(e);
    }
  }), /*#__PURE__*/React.createElement(DialogContentText, null, "File size too large for preview. Selected data items will be downloaded as ", /*#__PURE__*/React.createElement("i", null, filename, ".json"), ".")) : /*#__PURE__*/React.createElement(DialogContentText, null, "Select items from the propensity score plot to download.")), /*#__PURE__*/React.createElement(DialogActions, null, /*#__PURE__*/React.createElement(Button, {
    onClick: handleDownloadClose
  }, "Close"), selectedItems.confounds.length > 0 ? /*#__PURE__*/React.createElement(Button, {
    onClick: handleDownload
  }, "Download") : null)));
};