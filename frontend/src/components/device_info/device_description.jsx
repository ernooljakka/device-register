import React from 'react';
import PropTypes from 'prop-types'
import { Card, CardContent, Typography } from '@mui/material';

const Device_description = ({ devClass, devComments, devManufacturer, devModel }) => {

  return (
    <Card variant="outlined" sx={{ maxWidth: 400,
                                   margin: "auto",
                                   padding: 2 }}>
    <CardContent>
      <Typography variant="h6" component="div">
        Device Class:
      </Typography>
      <Typography variant="body1">
        {devClass}
      </Typography>

      <Typography variant="h6" component="div">
        Manufacturer:
      </Typography>
      <Typography variant="body1">
        {devManufacturer}
      </Typography>

      <Typography variant="h6" component="div">
        Model:
      </Typography>
      <Typography variant="body1">
        {devModel}
      </Typography>

      <Typography variant="h6" component="div">
        Device Comments:
      </Typography>
      <Typography variant="body1">
        {devComments}
      </Typography>
    </CardContent>
  </Card>
  );
};

Device_description.propTypes = {
  devClass: PropTypes.string,
  devComments: PropTypes.string,    
  devManufacturer: PropTypes.string,
  devModel: PropTypes.string
};

export default Device_description;