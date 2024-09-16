import React from 'react';
import { useEffect, useState } from 'react';

const Device_register_grid = () => {

  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Fetch devices from the api
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/devices');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setDevices(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDevices();
    
  }, []);

  useEffect(() => {
    if (devices.length > 0) {
      console.log('devices:', devices[0]);
    }
  }, [devices]);

  return (
    <div>

    </div>
  );
};

export default Device_register_grid;