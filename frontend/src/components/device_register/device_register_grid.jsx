import React from 'react';
import PropTypes from 'prop-types';
import GridTable from '../shared/grid_table.jsx';
import Typography from '@mui/material/Typography';
import useFetchData from '../shared/fetch_data';
import LinkButton from '../shared/link_button';

const Device_register_grid = () => {
    const { data: devices, loading, error } = useFetchData('devices');

    // Link dev_id to the device_info page
    const DeviceCellRenderer = ({ value }) => {
        const devIdString = value?.toString() || 'Unknown Device';
        return (
            <LinkButton 
              href={`/device_info/${devIdString}`} 
              text={devIdString}
              variant="text"
              color="primary"
              size="small"
            />
        );
    };
    DeviceCellRenderer.propTypes = {
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    };

    const columnDefs = [
        { field: "dev_id", filter: "agTextColumnFilter", headerName: "ID", flex: 2, cellRenderer: DeviceCellRenderer},
        { field: "dev_class", filter: "agTextColumnFilter", headerName: "Type", flex: 2 },
        { field: "dev_name", filter: "agTextColumnFilter", headerName: "Device", flex: 2.5 },
        { field: "dev_manufacturer", filter: "agTextColumnFilter", headerName: "Location", flex: 2.5 },
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
        />
    );
};

export default Device_register_grid;