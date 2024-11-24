import React from 'react';
import Box from '@mui/material/Box';
import { Typography, TextField, MenuItem, Select, FormControl, InputLabel  } from '@mui/material';
import NavigationBar from '../components/shared/navigation_bar';
import Form_container from '../components/shared/form_container';
import Function_button from '../components/shared/function_button';
import Link_button from '../components/shared/link_button';
import {useParams, useNavigate} from 'react-router-dom';
import { useState, useEffect } from 'react';
import useFetchData from '../components/shared/fetch_data';
import SignoutButton from '../components/shared/sign_out_button';
import usePatch from '../components/shared/patch_data';

const Edit_view = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {data: auth, loading: authLoading, error: error} = useFetchData('auth/admin');
  const { data: deviceClasses} = useFetchData('classes/');
  const { data: device, loading} = useFetchData('devices/'+id);
  const [errorMessage, setErrorMessage] = useState(null);
  const { patchData } = usePatch();

  
  




  const [deviceData, setDeviceData] = useState({
    class_id: '',
    dev_comments: '',
    dev_manufacturer: '',
    dev_model: '',
    dev_name: '',
  });



  
  
  useEffect(() => {
    if (device && deviceClasses.length > 0) {
        const matchedClass = deviceClasses.find(
          (deviceClass) => deviceClass.class_name === device.class_name
        );

      setDeviceData({
        class_id: matchedClass ? matchedClass.class_id : '',
        dev_comments: device.dev_comments || '', 
        dev_manufacturer: device.dev_manufacturer || '',
        dev_model: device.dev_model || '',
        dev_name: device.dev_name || '',
      });
    }
  }, [device, deviceClasses]);

  const handleChange = (e) => {
    const { name, value } = e.target; 
    setDeviceData({
        ...deviceData,
        [name]: value,
    })
  };


  const onSubmit = async(e) => {
    e.preventDefault()

    const { dev_name, dev_manufacturer, dev_model, class_id } = deviceData;
    // Check for empty fields
    if (!dev_name || !dev_manufacturer || !dev_model  || !class_id) {
      setErrorMessage("Please fill out all required fields.");
      setTimeout(() => setErrorMessage(null), 5000); // eslint-disable-line no-undef
      return;
    }
    
        try {
            await patchData('devices/'+id, deviceData);
            navigate('/admin/manager');
        } catch (error) {
            console.error(`Failed to patch`, error);
        }
  };
  

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography sx={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)' }}>
          Loading class data...
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
          {!authLoading && auth && !error && <SignoutButton auth={auth} />}
          <Typography sx={{
            fontSize: 'clamp(1.5rem, 5vw, 2.4rem)', 
            textAlign: 'center',
            mt: 8, 
            mb: 0,
          }}>
          Edit Device
          </Typography>

        

        {/* displays error when trying to submit without required field */}
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
        <Form_container onSubmit={onSubmit} childrenSx={{gap: 20}}>

            <TextField
              label="Device name"
              name="dev_name"
              value={deviceData.dev_name}
              onChange={handleChange}
              required={true}
              slotProps={{
                htmlInput: {
                  maxLength: 100,  // Set max length for the input field
                },
              }}
              autoFocus
            />

            <TextField
              label="Device model"
              name="dev_model"
              value={deviceData.dev_model}
              onChange={handleChange}
              required={true}
              slotProps={{
                htmlInput: {
                  maxLength: 100,  // Set max length for the input field
                },
              }}
            />

            <TextField
              label="Device manufacturer"
              name="dev_manufacturer"
              value={deviceData.dev_manufacturer}
              onChange={handleChange}
              required={true}
              slotProps={{
                htmlInput: {
                  maxLength: 100,  // Set max length for the input field
                },
              }}
            />

            <FormControl fullWidth>
                <InputLabel id="class_id">Device Class</InputLabel>
                    <Select
                        labelId="class_id"
                        value={deviceData.class_id}
                        onChange={(e) =>
                            setDeviceData({
                              ...deviceData,
                              class_id: parseInt(e.target.value, 10),
                            })}
                        required={true}
                    >
                        {deviceClasses.map((deviceClass) => (
                        <MenuItem key={deviceClass.class_id} value={deviceClass.class_id}>
                            {deviceClass.class_name}
                        </MenuItem>
                        ))}
                    </Select>
            </FormControl>


            <TextField
              label="Comment"
              name="dev_comments"
              value={deviceData.dev_comments}
              onChange={handleChange}
              slotProps={{
                htmlInput: {
                  maxLength: 300,  // Set max length for the input field
                },
              }}
            />

            <Function_button text='Edit' type="submit" ></Function_button>
        </Form_container> 

        
      </Box>
    ); 
  
};

export default Edit_view;