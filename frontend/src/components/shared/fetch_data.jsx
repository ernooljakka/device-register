import { useState, useEffect } from 'react';
import { config } from '../../utils/config';

const useFetchData = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const url = `${config.BACKEND_ADDR}/${endpoint}`
  const access_token = localStorage.getItem("access_token"); // eslint-disable-line no-undef



  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
          ...(access_token && { 'Authorization': `Bearer ${access_token}` }),
        }
        const response = await fetch(url, {headers});
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false); // Used by pages to verify data is readable.
      }
    };
    fetchData();

  }, [url, endpoint]);
  
  return { data, loading, error };
  
};

export default useFetchData;