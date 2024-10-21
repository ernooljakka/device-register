import React from 'react';
import GridTable from '../shared/grid_table.jsx';
import Typography from '@mui/material/Typography';
import useFetchData from '../shared/fetch_data';
import PropTypes from 'prop-types'

const Device_info_grid = ({ id }) => {
  const { data: events, loading, error } = useFetchData('devices/' + id + '/events');

  const columnDefs = [
      { field: "event_id", filter: "agTextColumnFilter", headerName: "ID", flex: 1, minWidth: 100}, //  Should be enough.
      { field: "comment", filter: "agTextColumnFilter", headerName: "Comment", flex: 2, minWidth: 200 },
      { field: "move_time", filter: "agTextColumnFilter", headerName: "Date/Time", flex: 2.0, minWidth: 170, // Enough for showing datetime
        //formatting date right
        valueFormatter: (params) => {
            if (params.value) {
              return params.value.replace('T', ' '); 
            }
            return params.value;
          }
      },
      { field: "loc_name", filter: "agTextColumnFilter", headerName: "Location", flex: 2.5, minWidth: 130 },
  ];

  if (loading) {
      return (
          <Typography sx={{ mt: 7, fontSize: 'clamp(1.5rem, 10vw, 2.4rem)' }}>
              Loading events...
          </Typography>
      );
  }

  if (error) {
      return (
          <Typography sx={{ mt: 7, fontSize: 'clamp(1.5rem, 9vw, 2.4rem)', color: 'red' }}>
              Failed to load events.<br />
              Please try again later.<br />
          </Typography>
      );
  }


  return (
      <GridTable 
          rowData={events.length > 0 ? events : []} 
          columnDefs={columnDefs}
      />
  );
};

Device_info_grid.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  };

export default Device_info_grid;