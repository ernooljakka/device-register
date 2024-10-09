import React from 'react';
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

export default Device_description;