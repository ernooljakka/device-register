import React from 'react';
import GridTable from '../shared/grid_table.jsx';
import Typography from '@mui/material/Typography';
import useFetchData from '../shared/fetch_data';

const Device_register_grid = () => {
    const { data: devices, loading, error } = useFetchData('devices/current_locations');

    //linking to device info page
    const onRowClicked = (event) => {
        const rowId = event.data.dev_id;  // Access the dev_id from the row

        window.location.href = `/devices/${rowId}`;
    };

    const getRowStyle = () => {
        return { cursor: 'pointer' };
    };

    const columnDefs = [
        { field: "dev_id", filter: "agTextColumnFilter", headerName: "ID", flex: 0.5, minWidth: 63 }, // Enough for 9999 devices
        { field: "dev_model", filter: "agTextColumnFilter", headerName: "Type", flex: 1.4, minWidth: 130 }, // Not as important, 14 characters
        { field: "dev_name", filter: "agTextColumnFilter", headerName: "Device", flex: 2,  minWidth: 250}, // Important, 34 characters 
        { field: "loc_name", filter: "agTextColumnFilter", headerName: "Location", flex: 2, minWidth: 130}, // 14 characters
    ];

    if (loading) {
        return (
            <Typography sx={{ mt: 7, fontSize: 'clamp(1.5rem, 10vw, 2.4rem)' }}>
                Loading devices...
            </Typography>
        );
    }

    if (error) {
        return (
            <Typography sx={{ mt: 7, fontSize: 'clamp(1.5rem, 9vw, 2.4rem)', color: 'red' }}>
                Failed to load devices.<br />
                Please try again later.<br />
            </Typography>
        );
    }

    return (
        <GridTable 
            rowData={devices.length > 0 ? devices : []} 
            columnDefs={columnDefs}
            onRowClicked={onRowClicked}
            getRowStyle={getRowStyle}
        />
    );
};

export default Device_register_grid;