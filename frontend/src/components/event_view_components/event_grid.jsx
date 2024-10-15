import React from 'react';
import PropTypes from 'prop-types';
import GridTable from '../shared/grid_table.jsx';
import Typography from '@mui/material/Typography';
import useFetchData from '../shared/fetch_data';
import LinkButton from '../shared/link_button';

const Event_grid = () => {
    const { data, loading, error } = useFetchData('events');

    const formattedData = data.map(event => ({
        ...event,
         // Format dates in data to European time format
        move_time: new Date(event.move_time).toLocaleDateString('en-GB')
    }));

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
      { field: "dev_id", filter: "agTextColumnFilter", headerName: "DEV", flex: 1.5, cellRenderer: DeviceCellRenderer },
      { field: "user_id", filter: "agTextColumnFilter", headerName: "USER", flex: 1.5 },
      { field: "move_time", filter: "agDateColumnFilter", headerName: "Date", flex: 2.5, suppressHeaderFilterButton: false },
      { field: "loc_name", filter: "agTextColumnFilter", headerName: "Location", flex: 2.0 },
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
            rowData={formattedData.length > 0 ? formattedData : []} 
            columnDefs={columnDefs}
        />
    );
};

export default Event_grid;
