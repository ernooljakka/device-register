import React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import DeviceGrid from '../components/device_register/device_register_grid';
import NavigationBar from '../components/shared/navigation_bar';

function Device_register_view() {

  return (
    <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%', 
        height: '100%',
        overflow: 'hidden',
        textWrap: 'nowrap'
    }}>
        <NavigationBar/>
        <Typography sx={{
          fontSize: 'clamp(1.5rem, 5vw, 2.4rem)', 
          textAlign: 'center',
          mt: 8, 
          mb: 3,
        }}>
        Device Register
        </Typography>
        <DeviceGrid/>
    </Box>
  );
}

export default Device_register_view;