import React from 'react';
import Box from '@mui/material/Box';
import { Typography, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import NavigationBar from '../components/shared/navigation_bar';
import Form_container from '../components/shared/form_container';
import Function_button from '../components/shared/function_button';
import { useState } from 'react';
import useFetchData from '../components/shared/fetch_data';
import SignoutButton from '../components/shared/sign_out_button';
import Link_button from '../components/shared/link_button';
import usePostData from '../components/shared/post_data';
import useDelete from '../components/shared/delete_data';

const ClassView = () => {
  const { deleteData: deleteData } = useDelete();
  const { data: auth, error } = useFetchData('auth/admin');
  const { data: deviceClasses, loading } = useFetchData('classes/');
  const { data: devices } = useFetchData('devices/');
  const [errorMessage, setErrorMessage] = useState(null);

  const { postData: postAddData } = usePostData('classes/', "Adding class");

  const [classData, setClassData] = useState({
    class_name: '',
  });

  const [deleteClass, setDeleteClass] = useState({
    class_id: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassData({
      ...classData,
      [name]: value,
    });
  };

  const onDeleteSubmit = async (e) => {
    e.preventDefault();
    const { class_id } = deleteClass;
    if (!class_id) {
      setErrorMessage("Please select a class to delete.");
      setTimeout(() => setErrorMessage(null), 5000); // eslint-disable-line no-undef
      return;
    }
    try {
        const classInUse = deviceClasses.find((cls) => cls.class_id === class_id.toString());
        if (devices.some((device) => device.class_name === classInUse.class_name)){
            setErrorMessage("There are still devices that use this class.");
            setTimeout(() => setErrorMessage(null), 5000); // eslint-disable-line no-undef
        }
        else {
            await deleteData(`classes/${class_id}`);    
            window.location.reload();
        }
   
    } catch (err) {
      const errorMsg = err?.message || "Are there still devices with this class?.";
      setErrorMessage(errorMsg);
      setTimeout(() => setErrorMessage(null), 5000); // eslint-disable-line no-undef
    }
  };

  const onAddSubmit = async (e) => {
    e.preventDefault();
   /* const { class_name } = classData;
    if (!class_name) {
      setErrorMessage("Please fill out all required fields.");
      setTimeout(() => setErrorMessage(null), 5000); // eslint-disable-line no-undef
      return;
    }*/
    try {
      await postAddData(classData);
      window.location.reload();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', justifyContent: 'center', 
        alignItems: 'center', height: '100vh' 
      }}>
        <Typography sx={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)' }}>
          Loading class data...
        </Typography>
      </Box>
    );
  }

  if (error || !auth || auth.msg != 'Authorized') {
    return (
      <Box sx={{ 
        display: 'flex', flexDirection: 'column', 
        justifyContent: 'center', alignItems: 'center', 
        height: '100vh', textAlign: 'center' 
      }}>
        <NavigationBar />
        <Typography sx={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', mb: 2 }}>
          You must be logged in to view this content.
        </Typography>
        <Link_button href={`/login`} text="Login" />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', flexDirection: 'column', 
      justifyContent: 'center', alignItems: 'center', 
      width: '100%', height: '100%', overflow: 'hidden', 
      textWrap: 'nowrap', gap: 2 
    }}>
      <NavigationBar />
      <SignoutButton />
      <Typography sx={{ fontSize: 'clamp(1.5rem, 5vw, 2.4rem)', textAlign: 'center', mt: 8, mb: 0 }}>
        Edit Classes
      </Typography>

      {errorMessage && <Typography color="error">{errorMessage}</Typography>}

      {deviceClasses.length > 0 && (
        <Form_container onSubmit={onDeleteSubmit} childrenSx={{ gap: 20 }}>
          <FormControl fullWidth>
            <InputLabel id="class_id">Device Class</InputLabel>
            <Select
              labelId="class_id"
              value={deleteClass.class_id || ''}
              onChange={(e) => setDeleteClass({ ...deleteClass, class_id: parseInt(e.target.value, 10) })}
              required
              aria-label="Device class select"
            >
              {deviceClasses.map((deviceClass) => (
                <MenuItem key={deviceClass.class_id} value={deviceClass.class_id}>
                  {deviceClass.class_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Function_button text="Delete" type="submit" aria-label="Delete class button" />
        </Form_container>
      )}

      <Form_container onSubmit={onAddSubmit} childrenSx={{ gap: 20 }}>
        <TextField
          label="Add class"
          name="class_name"
          value={classData.class_name}
          onChange={handleChange}
          required
          aria-label="Add class input"
          slotProps={{
            htmlInput: {
              maxLength: 100,
            },
          }}
        />
        <Function_button text="Add" type="submit" aria-label="Add class button" />
      </Form_container>
    </Box>
  );
};

export default ClassView;
