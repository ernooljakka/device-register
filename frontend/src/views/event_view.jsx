import React from 'react';
import Box from '@mui/material/Box';
import NavigationBar from '../components/shared/navigation_bar';
import EventGrid from '../components/event_view_components/event_grid';
import { Typography } from '@mui/material';

function Event_view() {

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