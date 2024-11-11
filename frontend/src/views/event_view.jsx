import React from 'react';
import Box from '@mui/material/Box';
import NavigationBar from '../components/shared/navigation_bar';
import EventGrid from '../components/event_view_components/event_grid';
import { Typography,  } from '@mui/material';
import useFetchData from '../components/shared/fetch_data';

function Event_view() {
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


  if (error || auth.msg != 'Authorized' ) { 
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center' }}>
        <NavigationBar/>
        <Typography sx={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)' }}>
          You must be logged in to view this content.
        </Typography>
      </Box>
    );
  }

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
          Event History
        </Typography>
        <EventGrid />
    </Box>
  );
}

export default Event_view;
