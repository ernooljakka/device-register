import * as React from 'react';
import Grid2 from '@mui/material/Grid2';
import LinkButton from './link_button';
import { Home, List, Lock } from '@mui/icons-material';

const Navigation_bar = () => (
    <Grid2
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={0.5}
        wrap="nowrap"
        sx={{
            position: 'absolute',
            top: 5,
            left: '50%',
            transform: 'translateX(-50%)',
            borderRadius: '16px',
            boxShadow: 2,
            minWidth: '15%',
            maxHeight: 30,
        }}
    >
      <LinkButton
          href="/events"
          icon={<List aria-label="Events Log"/>}
          variant="text"
          iconsx={{
              minWidth: '20px',
              minHeight: '20px',
              fontSize: 'clamp(24px, 2vw, 32px)',
          }}
      />
      <LinkButton
          href="/"
          icon={<Home aria-label="Home"/>}
          variant="text"
          iconsx={{
              minWidth: '20px',
              minHeight: '20px',
              fontSize: 'clamp(24px, 2vw, 32px)',
          }}
      />
      <LinkButton
          href="/admin"
          icon={<Lock aria-label="Admin Panel"/>}
          variant="text"
          iconsx={{
              minWidth: '20px',
              minHeight: '20px',
              fontSize: 'clamp(24px, 2vw, 32px)',
          }}
      />
    </Grid2>
);

export default Navigation_bar;