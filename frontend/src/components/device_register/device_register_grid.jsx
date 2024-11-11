import React from 'react';
import GridTable from '../shared/grid_table.jsx';
import Typography from '@mui/material/Typography';
import useFetchData from '../shared/fetch_data';

const Device_register_grid = () => {
    const { data: devices, loading, error } = useFetchData('devices/current_locations/');

    //linking to device info page
    const onRowClicked = (event) => {
        const rowId = event.data.dev_id;  // Access the dev_id from the row

        window.location.href = `/devices/${rowId}`;
    };

    const getRowStyle = () => {
        return { cursor: 'pointer' };
    };

    const columnDefs = [
        { field: "dev_manufacturer", filter: "agTextColumnFilter", headerName: "Manufacturer", flex: 0.5, minWidth: 120, autoHeight: true,
            cellStyle: { whiteSpace: 'normal', wordWrap: 'break-word',  lineHeight: 1.2,  paddingTop: '13px', } // text wrapping
            }, // Enough for 9999 devices
        { field: "dev_model", filter: "agTextColumnFilter", headerName: "Model", flex: 1.4, minWidth: 100, autoHeight: true,
            cellStyle: { whiteSpace: 'normal', wordWrap: 'break-word',  lineHeight: 1.2,  paddingTop: '13px', } // text wrapping
             }, // Not as important, 14 characters
        { field: "dev_name", filter: "agTextColumnFilter", headerName: "Device", flex: 2,  minWidth: 120, autoHeight: true,
            cellStyle: { whiteSpace: 'normal', wordWrap: 'break-word',  lineHeight: 1.2,  paddingTop: '13px', } // text wrapping
            }, // Important, 34 characters 
        { field: "loc_name", filter: "agTextColumnFilter", headerName: "Location", flex: 2, minWidth: 170, autoHeight: true,
            cellStyle: { whiteSpace: 'normal', wordWrap: 'break-word',  lineHeight: 1.2,  paddingTop: '13px', } // text wrapping        
        }, // 14 characters
        { field: "class_name", filter: "agTextColumnFilter", headerName: "Class", flex: 2, minWidth: 120, autoHeight: true,
            cellStyle: { whiteSpace: 'normal', wordWrap: 'break-word',  lineHeight: 1.2,  paddingTop: '13px', } // text wrapping
            },
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