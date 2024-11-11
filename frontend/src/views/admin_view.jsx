import React from 'react';
import Box from '@mui/material/Box';
import { Typography,  } from '@mui/material';
import NavigationBar from '../components/shared/navigation_bar';
import Link_button from '../components/shared/link_button';
import useFetchData from '../components/shared/fetch_data';

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
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2 
      }}>
        <a
          className="App-link"
          href="/"
          target="_self"
          rel="noopener noreferrer"
        >
          Login
        </a>
        <a
          className="App-link"
          href="/home"
          target="_self"
          rel="noopener noreferrer"
        >
          Home
        </a>
        <a
          className="App-link"
          href="/device_history"
          target="_self"
          rel="noopener noreferrer"
        >
          Device History
        </a>
      </Box>
    </div>
  )
}
  
export default Admin_view;