import React, {useState} from 'react';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey, blue, orange } from '@mui/material/colors';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

export const CovariatesManager = ({attributes=[], changeStratify, stratify=[]}) => {

  const theme = createTheme({
    palette: {
      grey: {
        light: grey[300],
        main: grey[500],
        dark: grey[700],
        contrastText: '#fff',
      },
      treatment: {
        light: blue[500],
        main: "#4e79a7",
        dark: blue[900],
        contrastText: '#fff',
      },
      outcome: {
        light: orange[500],
        main: "#f28e2c",
        dark: orange[900],
        contrastText: '#fff',
      }
    },
  });

  // Get color of attribute
  // function getColor(value) {
  //   if (treatment === value) {
  //     return "treatment"
  //   } else if (outcome === value) {
  //     return "outcome"
  //   } else if (added.indexOf(value) >= 0) {
  //     return "inherit"
  //   } else {
  //     return "grey"
  //   }
  // }

  const buttonStyle = {"width":"100%", "marginBottom":"5px", "width": "150px",};
  let attrStyle = {"display": "flex",
                   "flexDirection": "column",
                   "width": "150px",
                   "marginTop": "110px",
                   "marginRight": "20px",
                   "height": "500px",
                   "overflow": "scroll"};

  return (
    <div>
      <ThemeProvider theme={theme}>

        <div style={attrStyle}>

          {attributes.map((value, index) => {
            return <Button style={buttonStyle}
                      key={`covariate${index}`}
                      onClick={() => changeStratify(value)}
                      color={stratify.indexOf(value) < 0 ? "grey" : "inherit"}
                      variant="outlined"><a title="click to add">{value}</a></Button>
          })}
        </div>
      </ThemeProvider>
    </div>
  )
}