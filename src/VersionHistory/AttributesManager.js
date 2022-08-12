import React, {useState} from 'react';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey, blue, orange } from '@mui/material/colors';

import { Attribute } from './Attribute';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

export const AttributesManager = ({attributes=[], changeStratify, stratify=[], setStratifyBy}) => {

  const buttonStyle = {"width":"150px", "marginBottom":"5px"};
  let attrStyle = {"display": "flex",
                   "width":"150px",
                   "flexDirection": "column",
                   "height": "500px",
                   "overflow": "scroll",
                   "marginRight": "50px"};

  return (
    <div>
        <div style={attrStyle}>

          {attributes.map((value, index) => {
            return <Attribute
                      value={value}
                      key={`covariate${index}`}
                      changeStratify={setStratifyBy}
                      color={stratify.indexOf(value) < 0 ? "grey" : "black"} />
          })}
        </div>
    </div>
  )
}