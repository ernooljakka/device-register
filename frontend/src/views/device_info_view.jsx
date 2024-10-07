import React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import Device_Info_Grid from '../components/device_info/device_info_grid';
import NavigationBar from '../components/shared/navigation_bar';
import { useParams } from 'react-router-dom';
const Device_info_view = () => {
  const { id } = useParams();

  return (
    <div>
        <NavigationBar/>
        <Typography sx={{
          fontSize: 'clamp(1.5rem, 5vw, 2.4rem)', 
          textAlign: 'center',
          mt: 8, 
          mb: 3,
        }}>
        Device name
        </Typography>
        <Device_Info_Grid id = { id }/>
    </div>
  );
};

export default Device_info_view;