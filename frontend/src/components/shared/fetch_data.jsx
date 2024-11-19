import { useState, useEffect } from 'react';
import { config } from '../../utils/config';

const useFetchData = (endpoint, isBinary = false) => {
  const [data, setData] = useState(isBinary ? null : []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const url = `${config.BACKEND_ADDR}/${endpoint}`;
  const access_token = localStorage.getItem('access_token'); // eslint-disable-line no-undef

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          ...(access_token && { 'Authorization': `Bearer ${access_token}` }),
        };
        const response = await fetch(url, { headers });

        if (!response.ok) {
          throw new Error(`${response.statusText}`);
        }

        if (isBinary) {
          const blob = await response.blob();
          setData(blob);
        } else {
          const result = await response.json();
          setData(result);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url, endpoint, isBinary]);

  return { data, loading, error };
};

export default useFetchData;
