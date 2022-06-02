import React, {useState} from 'react';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

import { Attribute } from './Attribute';

import Button from '@mui/material/Button';
// import CardHeader from '@mui/material/CardHeader';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export const AttributesManager = ({attributes=[], added=[], addAttribute}) => {
  const [attr, setAttr] = React.useState(attributes);

  const addedColor = grey[500];

  const theme = createTheme({
    palette: {
      grey: {
        light: grey[50],
        main: grey[500],
        dark: '#002884',
        contrastText: '#fff',
      },
    },
  });

  let attrStyle = {"display": "flex", "flex-direction": "column", "width": "150px", "margin-right": "20px"};

  return (
    <div>
      {/* <CardHeader title="Attributes" /> */}
      <ThemeProvider theme={theme}>
        <div style={attrStyle}>
          {attr.map((value, index) => {
            return <Attribute key={index}
                value={value}
                color={added.indexOf(value) >= 0 ? "inherit" : "grey"}
                addAttribute={addAttribute} />
          })}
        </div>
      </ThemeProvider>
    </div>
  )
}