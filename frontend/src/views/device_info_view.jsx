import React from 'react';
import Box from '@mui/material/Box';
import Device_Info_Grid from '../components/device_info/device_info_grid';
import NavigationBar from '../components/shared/navigation_bar';
import Device_description from '../components/device_info/device_description';
import Link_button from '../components/shared/link_button';
import { useParams } from 'react-router-dom';
import useFetchData from '../components/shared/fetch_data';

const Device_info_view = () => {
  const { id } = useParams();

  const { data: device, error } = useFetchData('devices/' + id);
  const { data: locations} = useFetchData('devices/current_locations');

  

  const devName = String(device.dev_name);
  const devClass = String(device.class_name);
  const devComments = String(device.dev_comments);
  const devManufacturer = String(device.dev_manufacturer);
  const devModel = String(device.dev_model);
  const devLoc = String(getLocName(locations, id));

  function getLocName(loc, id) {
    const location = loc.find(item => item.dev_id == id);

    //check so we don't access undefined
    if (location) {
      return location.loc_name; 
  } else {
      return "";
  }
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
      textWrap: 'nowrap',
      gap: 2
  }}>
        <NavigationBar/>

        <Device_description devName={devName} devLocation={devLoc} devClass={devClass}
         devModel={devModel} devManufacturer={devManufacturer} devComments={devComments} error={error}/>
        
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2
        }}>
          <Link_button href={`/devices/${id}/move`} text= "Move"></Link_button>

          <Link_button href={`http://localhost:5000/static/qr/${id}.png`} text= "Get QR"></Link_button>



        </Box>
        

        <Device_Info_Grid id = { id }/>
    </Box>
  );
};

export default Device_info_view;