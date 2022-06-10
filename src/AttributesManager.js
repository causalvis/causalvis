import React, {useState} from 'react';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey, blue, orange } from '@mui/material/colors';

import { Attribute } from './Attribute';

import Button from '@mui/material/Button';
// import CardHeader from '@mui/material/CardHeader';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export const AttributesManager = ({attributes=[], added=[], treatment, outcome, addAttribute, deleteAttribute, changeTreatment, changeOutcome, handleAddTag}) => {
  const [attr, setAttr] = React.useState(attributes);

  // const addedColor = grey[500];

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
        main: blue[700],
        dark: blue[900],
        contrastText: '#fff',
      },
      outcome: {
        light: orange[500],
        main: orange[700],
        dark: orange[900],
        contrastText: '#fff',
      }
    },
  });

  function getColor(value) {
    if (treatment === value) {
      return "treatment"
    } else if (outcome === value) {
      return "outcome"
    } else if (added.indexOf(value) >= 0) {
      return "inherit"
    } else {
      return "grey"
    }
  }

  let attrStyle = {"display": "flex", "flexDirection": "column", "width": "150px", "marginRight": "20px", "height": "550px", "overflow": "scroll"};

  return (
    <div>
      {/* <CardHeader title="Attributes" /> */}
      <ThemeProvider theme={theme}>
        <div style={attrStyle}>
          {attr.map((value, index) => {
            return <Attribute key={index}
                value={value}
                isAdded={added.indexOf(value) >= 0 ? true : false}
                color={getColor(value)}
                treatment={treatment}
                outcome={outcome}
                addAttribute={addAttribute}
                deleteAttribute={deleteAttribute}
                changeTreatment={changeTreatment}
                changeOutcome={changeOutcome}
                handleAddTag={handleAddTag} />
          })}
        </div>
      </ThemeProvider>
    </div>
  )
}