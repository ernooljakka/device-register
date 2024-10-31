import { useState, useEffect } from 'react';
import { config } from '../../utils/config';

const useFetchData = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const url = `${config.BACKEND_ADDR}/${endpoint}`

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
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