import { useState } from 'react';
import { config } from '../../utils/config';

const usePatch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const access_token = localStorage.getItem("access_token"); // eslint-disable-line no-undef

  const patchData = async (endpoint, data, actionErrorString) => {
    setLoading(true);

    const url = `${config.BACKEND_ADDR}/${endpoint}`;

    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(access_token && { 'Authorization': `Bearer ${access_token}` }),
      };

      const response = await fetch(url, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData);
        alert(`${actionErrorString} failed: ${response.status} ${response.statusText}`);
        return;
      }

      setError(null);
    } catch (err) {
      setError(err);
      alert(`${actionErrorString} failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return { patchData, loading, error };
};

export default usePatch;
