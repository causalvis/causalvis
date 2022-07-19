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

export const DownloadSelectedDialog = ({open=false, handleDownloadClose, selectedItems}) => {

  const [attributes, setAttributes] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [filename, setFilename] = React.useState('selected');

  useEffect(() => {
    if (selectedItems.data[0]) {
      let newAttributes = Object.keys(selectedItems.data[0]);
      let newData = JSON.parse(JSON.stringify(selectedItems.data));

      newData = newData.map((d, i) => {
        d.propensity = selectedItems.propensity[i];
        d.treatment = selectedItems.treatment[i];
        return d;
      })

      setAttributes([...newAttributes, "propensity", "treatment"]);
      setData(newData);
    }
  }, [selectedItems])

  function handleFilenameChange(e) {
    setFilename(e.target.value);
  }

  function handleDownload() {
    let fileContent = new Blob([JSON.stringify(data, null, 4)], {
      type: 'application/json',
      name: `${filename}.json`
    });

    saveAs(fileContent, `${filename}.json`);
    handleDownloadClose();
  }

  let textStyle = {"marginBottom": "16px"};
  let paragraphStyle = {"fontFamily":"sans-serif",
                        "fontSize":"12px"};
  let filenameStyle = {"marginBottom": "24px"};

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleDownloadClose}
        maxWidth="lg">
        <DialogTitle>Download</DialogTitle>
        <DialogContent>
          {selectedItems.data.length > 0
            ? <div>
                <TextField
                  style={filenameStyle}
                  defaultValue={filename}
                  id="outlined-basic"
                  label="Filename"
                  variant="standard"
                  onChange={(e) => handleFilenameChange(e)} />
                <DialogContentText style={textStyle}>
                  The following data items will be downloaded as <i>{filename}.json</i>.
                </DialogContentText>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
                    <TableHead>
                      <TableRow>
                        {attributes.map(function (a) {
                          return <TableCell component="th" scope="row">{a}</TableCell>
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map(function (d, i) {
                        return <TableRow
                          key={i}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          {attributes.map(function (a) {
                            return <TableCell component="th" scope="row">{d[a]}</TableCell>
                          })}
                        </TableRow>
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            : <DialogContentText>
                Select items from the propensity score plot to download.
              </DialogContentText>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDownloadClose}>Close</Button>
          {selectedItems.data.length > 0
            ? <Button onClick={handleDownload}>Download</Button>
            : null}
        </DialogActions>
      </Dialog>
    </div>
  );
}
