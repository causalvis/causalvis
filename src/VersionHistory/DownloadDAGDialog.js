import React, {useEffect, useState} from 'react';
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

export const DownloadDAGDialog = ({open=false, selectedDAG={"nodes":[], "links":[]}, handleDAGClose}) => {

  const [data, setData] = React.useState([]);
  const [filename, setFilename] = React.useState('selected');

  function handleFilenameChange(e) {
    setFilename(e.target.value);
  }

  function handleDownload() {
    let fileContent = new Blob([JSON.stringify(data, null, 4)], {
      type: 'application/json',
      name: `${filename}.json`
    });

    saveAs(fileContent, `${filename}.json`);
    handleDAGClose();
  }

  let textStyle = {"marginBottom": "16px"};
  let paragraphStyle = {"fontFamily":"sans-serif",
                        "fontSize":"12px"};
  let filenameStyle = {"marginBottom": "24px"};

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleDAGClose}
        maxWidth="lg">
        <DialogTitle>Download</DialogTitle>
        <DialogContent>
          Something
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDAGClose}>Close</Button>
          <Button onClick={handleDownload}>Download</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
