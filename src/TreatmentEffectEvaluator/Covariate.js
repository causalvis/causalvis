import React, {useState} from 'react';

import Button from '@mui/material/Button';

export const Covariate = ({value=[], color="inherit", changeStratify}) => {

  function handleClick() {
    console.log("clicked")
    changeStratify(value)
  }

  const buttonStyle = {"width":"100%", "marginBottom":"5px"};
  const menuStyle = {}

  return (
    <div>
      <Button style={buttonStyle}
              onClick={() => handleClick()}
              variant="outlined"><a title="click to add">{value}</a></Button>
    </div>
  )
}