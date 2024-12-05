import React, {useRef, useState} from 'react';
import GridTable from '../shared/grid_table.jsx';
import Typography from '@mui/material/Typography';
import useFetchData from '../shared/fetch_data';
import PropTypes from 'prop-types'
import Function_button from '../shared/function_button.jsx';
import Box from '@mui/material/Box';

const Device_info_grid = ({ id }) => {
  const { data: events, loading, error } = useFetchData('devices/' + id + '/events');
  const [cellHeight, setCellHeight] = useState(false);
  const [whiteSpace, setWhiteSpace] = useState('');

  const formattedEvents = events.map(event => ({
    ...event,
    move_time: new Date(event.move_time.replace(' ', 'T') + 'Z').toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
  }));
  

  // Tells AG-Grid how to filter EU-formatted datetimes by date
  const filterParams = {
    comparator: (filterLocalDateAtMidnight, cellValue) => {
      if (!cellValue) return -1; // Handle null or undefined values
      
      // Parse cellValue into a date
      const [day, month, year] = cellValue
        .match(/(\d{2})\/(\d{2})\/(\d{4})/)
        .slice(1)
        .map(Number);
  
      const cellDate = new Date(year, month - 1, day); // Strip time from the date
  
      // Compare by day only
      if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
        return 0;
      }
      return cellDate < filterLocalDateAtMidnight ? -1 : 1;
    },
    minValidYear: 2024,
  };
  

  const handleRowSizing = () => {
    setCellHeight(prev => !prev);
    setWhiteSpace(prev => (prev === '' ? 'normal' : ''));
  };

  const columnDefs = [
      { field: "move_time", filter: "agDateColumnFilter", headerName: "Date/Time", flex: 2.0, minWidth: 160, autoHeight: cellHeight,
        cellStyle: {whiteSpace: whiteSpace, wordWrap: 'break-word',  lineHeight: 1.2,  paddingTop: '13px', },
        filterParams:filterParams, suppressHeaderFilterButton: false, sort: 'desc'// Enough for showing datetime
      },
      { field: "loc_name", filter: "agTextColumnFilter", headerName: "Location", flex: 2.2, minWidth: 170, autoHeight: cellHeight,
        cellStyle: {whiteSpace: whiteSpace, wordWrap: 'break-word',  lineHeight: 1.2,  paddingTop: '13px', } // text wrapping
        },
      { field: "user_name", filter: "agTextColumnFilter", headerName: "User name", flex: 2, minWidth: 150, autoHeight: cellHeight,
        cellStyle: {whiteSpace: whiteSpace, wordWrap: 'break-word',  lineHeight: 1.2,  paddingTop: '13px', } // text wrapping  
        },
      { field: "comment", filter: "agTextColumnFilter", headerName: "Comment", flex: 2, minWidth: 200, autoHeight: cellHeight,
        cellStyle: {whiteSpace: whiteSpace, wordWrap: 'break-word',  lineHeight: 1.2,  paddingTop: '13px', } // text wrapping  
        },
  ];

  //export csv functionality
  const gridRef = useRef();

    const exportClick = () => {
        if (gridRef.current) {
  
          gridRef.current.exportCsv();
        } else {
          console.error('Grid reference is not available');
        }
      };

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
    <div>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 1
        }}>
      <Function_button size='small' onClick={exportClick} text='Export CSV'/>
      <Function_button
      size='small'
      text= {!cellHeight ? 'Expand rows' : 'Collapse rows'}
      onClick={handleRowSizing}
      /> 

      </Box>
      <GridTable 
          rowData={formattedEvents.length > 0 ? formattedEvents : []} 
          columnDefs={columnDefs}
          ref={gridRef}
      />
    </div>
  );
};

Device_info_grid.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  };

export default Device_info_grid;