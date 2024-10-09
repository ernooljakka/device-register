import React from 'react';
import GridTable from '../shared/grid_table.jsx';
import Typography from '@mui/material/Typography';
import useFetchData from '../shared/fetch_data';

const Event_grid = () => {
    const { data, loading, error } = useFetchData('events');

    const formattedData = data.map(event => ({
        ...event,
        // Format Datetime to just be a Date.
        move_time: event.move_time.split("T")[0],
    }));  
    
    const columnDefs = [
        { field: "dev_id", filter: "agTextColumnFilter", headerName: "DEV", flex: 1.5 },
        { field: "user_id", filter: "agTextColumnFilter", headerName: "USER", flex: 1.5 }, 
        { field: "move_time", filter: "agDateColumnFilter", headerName: "Date", flex: 2.5, suppressHeaderFilterButton: false, },
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