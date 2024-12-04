import { useState } from 'react';
import { config } from '../../utils/config';

const useDelete = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const access_token = localStorage.getItem("access_token"); // eslint-disable-line no-undef

  const deleteData = async (endpoint, data, actionErrorString) => {
    setLoading(true);
    setError(null);

    const url = `${config.BACKEND_ADDR}/${endpoint}`;

    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(access_token && { 'Authorization': `Bearer ${access_token}` }),
      };

      const response = await fetch(url, {
        method: 'DELETE',
        headers: headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorMsg = `${actionErrorString} failed: ${response.status} ${response.statusText}`;
        setError(errorMsg);
        alert(errorMsg);
        return;
      }

      setError(null);
    } catch (err) {
      const errorMsg = `${actionErrorString} failed: ${err.message}`;
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return { deleteData, loading, error };
};

export default useDelete;
