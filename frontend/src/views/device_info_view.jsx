import React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import Device_Info_Grid from '../components/device_info/device_info_grid';
import NavigationBar from '../components/shared/navigation_bar';
import Device_description from '../components/device_info/device_description';
import Link_button from '../components/shared/link_button';
import { useParams } from 'react-router-dom';
import useFetchData from '../components/shared/fetch_data';

const Device_info_view = () => {
  const { id } = useParams();

  const { data: device, error } = useFetchData('devices/' + id);

  

  const devName = String(device.dev_name);
  const devClass = String(device.dev_class);
  const devComments = String(device.dev_comments);
  const devManufacturer = String(device.dev_manufacturer);
  const devModel = String(device.dev_model);


  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%', 
      height: '100%',
      overflow: 'hidden',
      textWrap: 'nowrap',
      gap: 2
  }}>
        <NavigationBar/>
        <Typography sx={{
          fontSize: 'clamp(1.5rem, 5vw, 2.4rem)', 
          textAlign: 'center',
          mt: 8, 
          mb: 3,
        }}>
        {error ?  "Device not found!" : devName}
        </Typography>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2
        }}>
          <Link_button href={`/move/${id}`} text= "Move"></Link_button>
          <Link_button href={`/devices/${id}/qr`} text= "Get QR"></Link_button>
        </Box>
        <Device_description devClass={devClass} devModel={devModel} devManufacturer={devManufacturer} devComments={devComments}/>

        

        <Device_Info_Grid id = { id }/>
    </Box>
  );
};

export default Device_info_view;