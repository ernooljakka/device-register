import React from 'react';
import GridTable from '../shared/grid_table.jsx';
import Typography from '@mui/material/Typography';
import useFetchData from '../shared/fetch_data';

const Event_grid = () => {
    const { data, loading, error } = useFetchData('events/');

    const formattedData = data.map(event => ({
        ...event,
        // Format move_time to DD/MM/YYYY HH:MM:SS, parse forces javascript to treat time as UTC format
        move_time: new Date(Date.parse(event.move_time)).toLocaleString('en-GB', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', 
            hour12: false, 
          }),
          // `move_time_iso` in ISO format for easier sorting/filtering
        move_time_iso: new Date(Date.parse(event.move_time)).toISOString()
    }));

     // Tells AG-Grid how to filter EU-formatted datetimes by date
  var filterParams = {
    comparator: (filterLocalDateAtMidnight, cellValue) => {
        const cellDate = new Date(cellValue); // Use ISO string directly
        if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
            return 0;
        }
        return cellDate < filterLocalDateAtMidnight ? -1 : 1;
    },
  
    minValidYear: 2024,
  };

    //linking to device info page
    const onRowClicked = (event) => {
        const rowId = event.data.dev_id;  // Access the dev_id from the row

        window.location.href = `/devices/${rowId}`;
    };

    const getRowStyle = () => {
        return { cursor: 'pointer' };
    };

    const columnDefs = [
      { field: "move_time_iso", filter: "agDateColumnFilter", headerName: "Date/Time", flex: 1.0, minWidth: 150, // Enough for showing datetime
            filterParams:filterParams, suppressHeaderFilterButton: false, sort: 'desc'
            , valueFormatter: (params) => params.data.move_time
      },
      { field: "loc_name", filter: "agTextColumnFilter", headerName: "Location", flex: 1.2, minWidth: 130 }, // 14 characters
      { field: "user_name", filter: "agTextColumnFilter", headerName: "User name", flex: 1, minWidth: 150 },  // 15 characters
      { field: "user_email", filter: "agTextColumnFilter", headerName: "Email", flex: 1, minWidth: 200 },
      { field: "company", filter: "agTextColumnFilter", headerName: "Company", flex: 1, minWidth: 150 },
      
      
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
            onRowClicked={onRowClicked}
            getRowStyle={getRowStyle}
        />
    );
};

export default Event_grid;
