import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box } from '@mui/material';
import Function_button from '../shared/function_button';
import { config } from '../../utils/config';
import useFetchData from '../shared/fetch_data';
import useDelete from '../shared/delete_data';
import ConfirmationPopup from '../device_manager/confirmation_popup';


const Attachment_box = ({ id, modify }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const { data: attachments} = useFetchData('attachments/list/' + id);
  const { deleteData } = useDelete();
  const popupRef = useRef(null);

  // custom post for formdata
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
        headers: headers
      });
      
      if (!response.ok) {
        const errorResponse = await response.json();  // Parse the response as JSON
        throw new Error(errorResponse.error || `HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      setUploadResult(result);
    } catch (err) {
      setUploadError(err.message || 'Unknown error occurred');
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('files', selectedFile, selectedFile.name);

      postFormData(`attachments/upload/${id}`, formData);
    }
  };

  const handleDelete = async(fileName) => {
    try {
      await deleteData('attachments/delete/'+id+'/'+fileName);
      window.location.reload();
  } catch (error) {
      console.error(`Failed to delete attachment: ${fileName}`, error);
  }
  };

  //clears errors after 5 seconds
  useEffect(() => {
    if (uploadResult) { 
      setTimeout(() => setUploadResult(null), 5000); // eslint-disable-line no-undef
      window.location.reload();
    }
  }, [uploadResult]);

  useEffect(() => {
    if (uploadError) {
      setTimeout(() => setUploadError(null), 5000); // eslint-disable-line no-undef
    }
  }, [uploadError])

  //creates links for attachments
  const renderFileLinks = (attachments) => {
    if (!attachments || !attachments.files || attachments.files.length === 0) return null;
      return attachments.files.map((file, index) => {
      const fileName = file.split('/').pop();
      
      return (
        <Card key={index}>
        <Typography>
          <a href={`${config.BACKEND_ADDR}${file}`} target="_blank" rel="noopener noreferrer">
            {fileName}
          </a>
        </Typography>

        {!modify && (<Box sx={{mt: 1}}></Box>)}

        {modify &&(<ConfirmationPopup
                                    renderTrigger={() => (
                                    <Function_button
                                        text="Delete"
                                        color="error"
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            popupRef.current.openPopup(); 
                                        }}
                                    />
                                    )}
                                onConfirm={() => handleDelete(fileName)}
                                dialogTitle="Delete Attachment"
                                dialogText="Are you sure you want to delete this attachment?"
                                ref={popupRef} // Attach the ref to the popup
                            />)}
      </Card>
      );
    });
  };

  return (
    <Card
      variant="outlined"
      sx={{
        maxWidth: 800,
        width: '80%',
        margin: 'auto',
        padding: 2,
        mt: 1,
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">
              Attachments:
        </Typography>
        {attachments && attachments.files && attachments.files.length > 0 && (
          <Card>
            {renderFileLinks(attachments)}
          </Card>
        )}

        {modify && (<Box sx ={{ mt: 2}}>
        <input type="file" onChange={handleFileChange}
          disabled={attachments && attachments.files && attachments.files.length >= 4} // Disable if 4 or more files
         />
        <Function_button
          text='Upload'  
          variant="contained"
          size="small"
          color="primary"
          onClick={handleFileUpload}
          disabled={!selectedFile}
          sx={{ mt: 2 }}
        >
        </Function_button>
        </Box>)}

        {uploadError && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            { uploadError }
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

Attachment_box.propTypes = {
  id: PropTypes.string.isRequired,
  modify: PropTypes.bool.isRequired,
};

export default Attachment_box;