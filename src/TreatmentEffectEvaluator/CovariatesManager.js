import React, {useState} from 'react';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey, blue, orange } from '@mui/material/colors';

import { Covariate } from './Covariate';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

export const CovariatesManager = ({attributes=[], changeStratify, stratify=[]}) => {

  const buttonStyle = {"width":"100%", "marginBottom":"5px"};
  let attrStyle = {"display": "flex",
                   "flexDirection": "column",
                   "height": "500px",
                   "overflow": "scroll"};

  return (
    <div>
        <div style={attrStyle}>

          {attributes.map((value, index) => {
            return <Covariate
                      value={value}
                      key={`covariate${index}`}
                      changeStratify={changeStratify}
                      color={stratify.indexOf(value) < 0 ? "grey" : "black"} />
          })}
        </div>
    </div>
  )
}