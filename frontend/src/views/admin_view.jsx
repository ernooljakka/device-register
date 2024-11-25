import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import NavigationBar from '../components/shared/navigation_bar';
import Link_button from '../components/shared/link_button';
import Function_button from '../components/shared/function_button';
import { config } from '../utils/config';
import useFetchData from "../components/shared/fetch_data";
import SignoutButton from '../components/shared/sign_out_button';

function Admin_view() {
  const { data: auth, loading: authLoading, error: authError } = useFetchData('auth/admin');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const exportClick = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(`${config.BACKEND_ADDR}/devices/export/`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
      });
      if (!response.ok) throw new Error(await response.text());
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'devices.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Export failed: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const importClick = async (event) => {
    setIsImporting(true);
    const file = event.target.files[0];
    if (!file) return setIsImporting(false);
    try {
      const formData = new FormData();
      formData.append('files', file);
      const response = await fetch(`${config.BACKEND_ADDR}/devices/import/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
        body: formData,
      });
      if (!response.ok) throw new Error(await response.text());
      const res = await response.json();
      alert(`Import successful: ${res.message}`);
    } catch (error) {
      alert(`Import failed: ${error.message}`);
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography sx={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)' }}>Loading...</Typography>
      </Box>
    );
  }

  if (authError || !auth || auth.msg !== 'Authorized') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', height: '100vh', textAlign: 'center' }}>
        <NavigationBar auth={auth} />
        <Typography sx={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', mb: 2 }}>
          You must be logged in to view this content.
        </Typography>
        <Link_button href={`/login`} text="Login" />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <NavigationBar auth={auth} />
      {!authLoading && auth && !authError && <SignoutButton auth={auth} />}
      <Typography sx={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', mt: 8 }}>Management pages</Typography>
      <Link_button href={`/admin/manager`} text="Devices" />
      <Link_button href={`/events`} text="Events" />
      <Function_button onClick={exportClick} text={isExporting ? 'Exporting...' : 'Export CSV'} disabled={isExporting} />
      <input type="file" id="csv-import" accept=".csv" style={{ display: 'none' }} onChange={importClick} />
      <Function_button onClick={() => document.getElementById('csv-import').click()} text={isImporting ? 'Importing...' : 'Import CSV'} disabled={isImporting} />
    </Box>
  );
}

export default Admin_view;

