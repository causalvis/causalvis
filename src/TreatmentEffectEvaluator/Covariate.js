import React, {useState} from 'react';

import Button from '@mui/material/Button';

export const Covariate = ({value="", color="black", changeStratify}) => {

  const colorMap = {"grey": {"rgb": "rgb(158, 158, 158)", "rgba": "rgba(158, 158, 158, 0.05)"},
                    "treatment": {"rgb": "rgb(78, 121, 167)", "rgba": "rgba(78, 121, 167, 0.05)"},
                    "outcome": {"rgb": "rgb(242, 142, 44)", "rgba": "rgba(242, 142, 44, 0.05)"},
                    "black": {"rgb": "rgb(0, 0, 0)", "rgba": "rgba(0, 0, 0, 0.05)"}};

  const buttonStyle = {"width":"100%",
                       "marginBottom":"5px",
                       "color":colorMap[color].rgb,
                       "borderColor":colorMap[color].rgb,
                       "&:hover": { "borderColor":colorMap[color].rgb, "backgroundColor": colorMap[color].rgba }};

  const menuStyle = {}

  return (
    <div>
      <Button sx={buttonStyle}
              onClick={() => changeStratify(value)}
              variant="outlined"><a title="click to add">{value}</a></Button>
    </div>
  )
}