import React from 'react';
import GridTable from '../shared/grid_table.jsx';
import Typography from '@mui/material/Typography';
import useFetchData from '../shared/fetch_data';

const Event_grid = () => {
    const { data, loading, error } = useFetchData('events');

    const formattedData = data.map(event => ({
        ...event,
         // Format dates in data to European time format
        move_time: new Date(event.move_time).toLocaleDateString('en-GB')
    }));

    //linking to device info page
    const onRowClicked = (event) => {
        const rowId = event.data.dev_id;  // Access the dev_id from the row

        window.location.href = `/devices/${rowId}`;
    };

    const getRowStyle = () => {
        return { cursor: 'pointer' };
    };

    // Tells AG-Grid how to filter EU-formatted dates
    var filterParams = {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
            var dateAsString = cellValue;
            if (dateAsString == null) return -1;
            var dateParts = dateAsString.split("/");
            var cellDate = new Date(
            Number(dateParts[2]),
            Number(dateParts[1]) - 1,
            Number(dateParts[0]),
            );

            if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
                return 0;
            }
            if (cellDate < filterLocalDateAtMidnight) {
                return -1;
            }
            if (cellDate > filterLocalDateAtMidnight) {
                return 1;
            }
            return 0;
        },
        minValidYear: 2024,
    };

    const columnDefs = [
      { field: "dev_id", filter: "agTextColumnFilter", headerName: "DEV", flex: 1, minWidth: 63}, // Enough for 9999 devices
      { field: "user_id", filter: "agTextColumnFilter", headerName: "USER", flex: 1, minWidth: 63 }, // Enough for 9999 users
      { field: "move_time", filter: "agDateColumnFilter", headerName: "Date", flex: 1.8, minWidth: 110,
                                             filterParams: filterParams, suppressHeaderFilterButton: false },
      { field: "loc_name", filter: "agTextColumnFilter", headerName: "Location", flex: 2.0, minWidth: 130 }, // 14 characters
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
