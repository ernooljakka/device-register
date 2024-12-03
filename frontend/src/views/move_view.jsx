import React from 'react';
import Box from '@mui/material/Box';
import { Typography, TextField } from '@mui/material';
import NavigationBar from '../components/shared/navigation_bar';
import Form_container from '../components/shared/form_container';
import Function_button from '../components/shared/function_button';
import { useParams, useNavigate} from 'react-router-dom';
import { useState, useEffect } from 'react';
import useFetchData from '../components/shared/fetch_data';
import usePostData from '../components/shared/post_data';
import SignoutButton from '../components/shared/sign_out_button';

const Move_view = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const { data: device, loading, error } = useFetchData('devices/' + id);
  const [errorMessage, setErrorMessage] = useState(null);
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  //sets to "" if local storage doesnt have them
  const company_field = localStorage.getItem("user_company") || ""; // eslint-disable-line no-undef
  const name_field = localStorage.getItem("user_name") || ""; // eslint-disable-line no-undef
  const email_field = localStorage.getItem("user_email") || ""; // eslint-disable-line no-undef


  const {
    result: eventResult,
    postData: postEventData,
  } = usePostData('events/');


  const [deviceMoveData, setDeviceMoveData] = useState({
    "dev_id": parseInt(id, 10),
    "move_time": "",
    "loc_name": "",
    "company": company_field,
    "comment": "",
    "user": {
      "user_email": email_field,
      "user_name": name_field,
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('user_')) {
      setDeviceMoveData({
        ...deviceMoveData,
        user: {
          ...deviceMoveData.user,
          [name]: value,
        },
      });
    } else {
      setDeviceMoveData({
        ...deviceMoveData,
        [name]: value,
      });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault()
    const { loc_name, company, user } = deviceMoveData;
    // Check for empty fields
    if (!loc_name || !user.user_name || !user.user_email || !company) {
      setErrorMessage("Please fill out all required fields.");
      setTimeout(() => setErrorMessage(null), 5000); // eslint-disable-line no-undef
      return;
    }
    //Validate email
    if (!emailRegex.test(user.user_email)) {
      setErrorMessage("Please enter a valid email address.");
      setTimeout(() => setErrorMessage(null), 5000); // eslint-disable-line no-undef
      return;
    }

  
    const MoveData = {
      ...deviceMoveData,
      move_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };

    //save to localstorage
    localStorage.setItem("user_name", MoveData.user.user_name); // eslint-disable-line no-undef
    localStorage.setItem("user_email", MoveData.user.user_email); // eslint-disable-line no-undef
    localStorage.setItem("user_company", MoveData.company); // eslint-disable-line no-undef
    
    postEventData(MoveData);
  };
  
  //when postData is called, check if message is right
  useEffect(() => {
    if (eventResult) {
      if (eventResult.message === "Event created successfully") {
        navigate('/'); 
      }
    }
  }, [eventResult, navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography sx={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)' }}>
          Loading device data...
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
          <NavigationBar/>
          <SignoutButton />
          <Typography sx={{
            fontSize: 'clamp(1.5rem, 5vw, 2.4rem)', 
            textAlign: 'center',
            mt: 8, 
            mb: 0,
          }}>
          Move Device
          </Typography>
          <Typography sx={{
            fontSize: 'clamp(1.5rem, 5vw, 2.4rem)', 
            textAlign: 'center',
            mt: 1, 
            mb: 1,
          }}>
          {error ?  "Device not found!" : device.dev_name}
          </Typography>

          <Typography sx={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', 
            textAlign: 'center',
            mt: 0, 
            mb: 3,
          }}>
          {error ?  "Device not found!" : "ID: "+id}
          </Typography>

        {/* displays error when trying to submit without required field */}
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
        <Form_container onSubmit={onSubmit} childrenSx={{gap: 20}}>

            <TextField
              label="Location"
              name="loc_name"
              value={deviceMoveData.loc_name}
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
              label="Name"
              name="user_name"
              value={deviceMoveData.user.user_name}
              onChange={handleChange}
              required={true}
              slotProps={{
                htmlInput: {
                  maxLength: 100,  // Set max length for the input field
                },
              }}
            />

            <TextField
              label="Company"
              name="company"
              value={deviceMoveData.company}
              onChange={handleChange}
              required={true}
              slotProps={{
                htmlInput: {
                  maxLength: 100,  // Set max length for the input field
                },
              }}
            />

            <TextField
              label="Email"
              name="user_email"
              value={deviceMoveData.user.user_email}
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
              name="comment"
              value={deviceMoveData.comment}
              onChange={handleChange}
              slotProps={{
                htmlInput: {
                  maxLength: 300,  // Set max length for the input field
                },
              }}
            />

            <Function_button text='Move' type="submit" ></Function_button>
        </Form_container> 

        
      </Box>
    ); 
  
};

export default Move_view;