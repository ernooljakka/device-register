import React from 'react';
import Box from '@mui/material/Box';
import { Typography, TextField } from '@mui/material';
import NavigationBar from '../components/shared/navigation_bar';
import Form_container from '../components/shared/form_container';
import Function_button from '../components/shared/function_button';
import {useNavigate} from 'react-router-dom';
import { useState, useEffect } from 'react';
import usePostData from '../components/shared/post_data';
const Login_view = () => {

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  
  const {
    result: loginResult,
    error: loginError,
    postData: postEventData,
  } = usePostData('auth/login');

  const [loginData, setLoginData] = useState({
    "password": "",
    "username": "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
      setLoginData({
        ...loginData,
        [name]: value,
      });
    };

  const onSubmit = (e) => {
    e.preventDefault()
    const { password, username } = loginData;
    console.log(loginData);
    // Check for empty fields
    if (!username || !password) {
      setErrorMessage("Please fill out all required fields.");
      setTimeout(() => setErrorMessage(null), 5000); // eslint-disable-line no-undef
      return;
    }
    else {
      postEventData(loginData);
    }
  }

  //when postData is called, check if error is sent
  useEffect(() => {
    if (loginError) {
      setErrorMessage("Wrong username or password");
      setTimeout(() => setErrorMessage(null), 5000); // eslint-disable-line no-undef
      }
    else if(loginResult){
      localStorage.setItem("access_token", loginResult.access_token); // eslint-disable-line no-undef
      navigate('/admin'); 
    }
    })


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
            mb: 0,
          }}>
          Login
          </Typography>
  
        {/* displays error when trying to submit without required field */}
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
         <Form_container onSubmit={onSubmit} childrenSx={{gap: 20}}>
  
            <TextField
              label="Username"
              name="username"
              value={loginData.username}
              onChange={handleChange}
              required={true}
              autoFocus
            />
  
            <TextField
              label="Password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              required={true}
            />
  
            <Function_button text='Login' type="submit" ></Function_button>
         </Form_container> 
  
         
      </Box>
    );
  };

  
  export default Login_view;