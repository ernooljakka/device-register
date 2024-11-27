import React from 'react';
import PropTypes from 'prop-types'
import { Card, CardContent, Typography } from '@mui/material';

const Device_description = ({ devName, devLocation, devClass, devComments, devManufacturer, devModel, devHome, error }) => {

  return (
    <Card variant="outlined" sx={{ maxWidth: 800,
                                    width: '80%',
                                   margin: "auto",
                                   padding: 2,
                                   mt: 8
                                   }}>
    <CardContent sx ={{ display: 'flex',      
                                   flexDirection: 'column', 
                                   justifyContent: 'center',
                                   alignItems: 'center'}}>
      <Typography variant="h6" component="div">
        Device Name:
      </Typography>
      <Typography variant="body1">
      {error ?  "Device not found!" : devName}
      </Typography>
      <Typography variant="h6" component="div">
        Device Location:
      </Typography>
      <Typography variant="body1">
        {devLocation}
      </Typography>
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

      <Typography variant="h6" component="div">
        Home location:
      </Typography>
      <Typography variant="body1">
        {devHome}
      </Typography>

    </CardContent>
  </Card>
  );
};

Device_description.propTypes = {
  devName: PropTypes.string,
  devLocation: PropTypes.string,
  devClass: PropTypes.string,
  devComments: PropTypes.string,    
  devManufacturer: PropTypes.string,
  devModel: PropTypes.string,
  devHome: PropTypes.string,
  error: PropTypes.any
};

export default Device_description;