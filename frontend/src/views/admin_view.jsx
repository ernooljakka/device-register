import React from 'react';
import Box from '@mui/material/Box';
import { Typography,  } from '@mui/material';
import NavigationBar from '../components/shared/navigation_bar';
import Link_button from '../components/shared/link_button';
import Function_button from '../components/shared/function_button';
import useFetchData from '../components/shared/fetch_data';
import DeviceGrid from '../components/device_register/device_register_grid';

function Admin_view() {

  const {data: auth, loading, error} = useFetchData('auth/admin');

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography sx={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)' }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  //Handle exporting/downloading the csv file
  const exportClick = () => {
    window.dispatchEvent(new Event('Export'));
  }


  if (error || !auth || auth.msg != 'Authorized') { 
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center' }}>
        <NavigationBar/>
        <Typography sx={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', mb: 2 }}>
          You must be logged in to view this content.
        </Typography>
        <Link_button href={`/login`} text= "Login"></Link_button>
      </Box>
    );
  }
  return (
    <div>
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4 
      }}>
        <NavigationBar/>
        <Typography sx={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', mt: 8 }}>
          Management pages
        </Typography>
        <Link_button href={`/`} text= "Devices"></Link_button>
        <Link_button href={`/events`} text= "Events"></Link_button>
        <Function_button onClick={exportClick} text= "Export CSV"></Function_button>
      </Box>
      <div style={{display: 'none'}}>
        <DeviceGrid/>
      </div>
    </div>
  )
}
  
export default Admin_view;