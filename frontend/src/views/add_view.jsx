import React from 'react';
import Box from '@mui/material/Box';
import { Typography, TextField, MenuItem, Select, FormControl, InputLabel  } from '@mui/material';
import NavigationBar from '../components/shared/navigation_bar';
import Form_container from '../components/shared/form_container';
import Function_button from '../components/shared/function_button';
import {useNavigate} from 'react-router-dom';
import { useState, useEffect } from 'react';
import useFetchData from '../components/shared/fetch_data';
import usePostData from '../components/shared/post_data';
import SignoutButton from '../components/shared/sign_out_button';
import { config } from '../utils/config';

const Add_view = () => {
  const navigate = useNavigate(); 
  const { data: auth, loading: authloading, error: authError} = useFetchData('auth/admin');
  const { data: deviceClasses, loading} = useFetchData('classes/');
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const {
    result: devResult,
    postData: postDevData,
  } = usePostData('devices/');


  const [deviceData, setDeviceData] = useState({
    "class_id": '',
    "dev_comments": "",
    "dev_home": "",
    "dev_location": "",
    "dev_manufacturer": "",
    "dev_model": "",
    "dev_name": "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target; 
    setDeviceData({
        ...deviceData,
        [name]: value,
    })
  };


  const onSubmit = (e) => {
    e.preventDefault()
    const { dev_name, dev_manufacturer, dev_model, class_id } = deviceData;
    // Check for empty fields
    if (!dev_name || !dev_manufacturer || !dev_model || !class_id) {
      setErrorMessage("Please fill out all required fields.");
      setTimeout(() => setErrorMessage(null), 5000); // eslint-disable-line no-undef
      return;
    }
    
    //need to wrap as a list
    const deviceList = [deviceData];
     
    postDevData(deviceList);
  };
  
  //when postData is called, check if message is right
  useEffect(() => {
    if (devResult) {
      if (devResult.message === "Devices created successfully") {
        handleFileUpload();
        navigate('/'); 
      }
    }
  }, [devResult, navigate]);

  //start of file upload
  // Custom POST for FormData
  const postFormData = async (endpoint, formData) => {
    const url = `${config.BACKEND_ADDR}/${endpoint}`;
    const access_token = localStorage.getItem("access_token"); // eslint-disable-line no-undef
    const headers = {
      ...(access_token && { 'Authorization': `Bearer ${access_token}` }),
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: headers,
      });

      if (!response.ok) {
        const errorResponse = await response.json(); // Parse the response as JSON
        throw new Error(errorResponse.error || `HTTP error! status: ${response.status}`);
      }

      //const result = await response.json();
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {

    if (selectedFile) {
      try {
        // Fetch the latest device ID
        const response = await fetch(`${config.BACKEND_ADDR}/devices`);
        if (!response.ok) throw new Error('Failed to fetch devices');
        const devices = await response.json();
        const lastDevice = devices[devices.length - 1];
        const newDeviceId = parseInt(lastDevice?.dev_id, 10);

        const formData = new FormData();
        formData.append('files', selectedFile, selectedFile.name);
      
        await postFormData(`attachments/upload/${newDeviceId}`, formData);

      } catch (error) {
        console.log(error.message);
      } 
    }
     
    
  }; //end of file upload

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography sx={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)' }}>
          Loading class data...
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
        textWrap: 'nowrap',
        gap: 2
    }}>
          <NavigationBar auth={auth} />
          {!authloading && auth && !authError && <SignoutButton auth={auth} />}
          <Typography sx={{
            fontSize: 'clamp(1.5rem, 5vw, 2.4rem)', 
            textAlign: 'center',
            mt: 8, 
            mb: 0,
          }}>
          Add Device
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
              label="Home Location"
              name="dev_home"
              value={deviceData.dev_home}
              onChange={handleChange}
              required={true}
              slotProps={{
                htmlInput: {
                  maxLength: 100,  // Set max length for the input field
                },
              }}
            />

            <TextField
              label="Current Location"
              name="dev_location"
              value={deviceData.dev_location}
              onChange={handleChange}
              required={true}
              slotProps={{
                htmlInput: {
                  maxLength: 100,  // Set max length for the input field
                },
              }}
            />

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

            <input type="file" onChange={handleFileChange} />

            <Function_button text='Add' type="submit" ></Function_button>
        </Form_container> 


        
      </Box>
    ); 
  
};

export default Add_view;