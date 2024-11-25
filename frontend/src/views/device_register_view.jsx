import React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import DeviceGrid from '../components/device_register/device_register_grid';
import NavigationBar from '../components/shared/navigation_bar';
import Link_button from '../components/shared/link_button';
import SignoutButton from '../components/shared/sign_out_button';
import useFetchData from '../components/shared/fetch_data';
import { config } from '../utils/config';


function Device_register_view() {

  const { data: auth, loading: authloading, error: authError} = useFetchData('auth/admin');

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
        <NavigationBar auth={auth} />
        {!authloading && auth && !authError && <SignoutButton auth={auth} />}
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 2
        }}>
          <Typography sx={{
            fontSize: 'clamp(1.5rem, 5vw, 2.4rem)', 
            textAlign: 'center',
            mt: 6, 
            mb: 3,
          }}>
          Device Register
          </Typography>
          <Link_button href={`${config.FRONTEND_ADDR}/add`} text= "Add" sx={{ mt: 3}}></Link_button>

        </Box>
        <DeviceGrid/>
    </Box>
  );
}

export default Device_register_view;