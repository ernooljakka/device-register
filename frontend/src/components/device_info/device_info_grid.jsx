import React, {useRef, useState} from 'react';
import GridTable from '../shared/grid_table.jsx';
import Typography from '@mui/material/Typography';
import useFetchData from '../shared/fetch_data';
import PropTypes from 'prop-types'
import Function_button from '../shared/function_button.jsx';
import Box from '@mui/material/Box';
import { formatEventData, dateFilterParams, dateTimeComparator, getRowStyle  } from '../../utils/grid_utils.jsx';

const Device_info_grid = ({ id }) => {
  const { data: events, loading, error } = useFetchData('devices/' + id + '/events');
  const [cellHeight, setCellHeight] = useState(false);
  const [whiteSpace, setWhiteSpace] = useState('');

  const formattedEvents = formatEventData(events);
  
  const handleRowSizing = () => {
    setCellHeight(prev => !prev);
    setWhiteSpace(prev => (prev === '' ? 'normal' : ''));
  };

  const columnDefs = [
    {
      field: "move_time", filter: "agDateColumnFilter", headerName: "Date/Time",
      flex: 2.0, minWidth: 160, autoHeight: cellHeight,
      cellStyle: { whiteSpace: whiteSpace, wordWrap: 'break-word', lineHeight: 1.2, paddingTop: '13px', },
      filterParams: dateFilterParams, // Filter dates by dd/MM/yyyy
      comparator: dateTimeComparator, // Sort dates by dd/MM/yyyy hh:mm
      suppressHeaderFilterButton: false, sort: 'desc', sortingOrder: ["desc", "asc"]
    },
    { 
      field: "loc_name", filter: "agTextColumnFilter", headerName: "Location", 
      flex: 2.2, minWidth: 170, autoHeight: cellHeight,
      cellStyle: {whiteSpace: whiteSpace, wordWrap: 'break-word',  lineHeight: 1.2,  paddingTop: '13px', } 
    },
    { 
      field: "user_name", filter: "agTextColumnFilter", headerName: "User name", 
      flex: 2, minWidth: 150, autoHeight: cellHeight,
      cellStyle: {whiteSpace: whiteSpace, wordWrap: 'break-word',  lineHeight: 1.2,  paddingTop: '13px', } 
    },
    { 
      field: "comment", filter: "agTextColumnFilter", headerName: "Comment", 
      flex: 2, minWidth: 200, autoHeight: cellHeight,
      cellStyle: {whiteSpace: whiteSpace, wordWrap: 'break-word',  lineHeight: 1.2,  paddingTop: '13px', } 
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
          getRowStyle={getRowStyle}
          ref={gridRef}
      />
    </div>
  );
};

Device_info_grid.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  };

export default Device_info_grid;