import React, {useRef, useState} from 'react';
import GridTable from '../shared/grid_table.jsx';
import Typography from '@mui/material/Typography';
import useFetchData from '../shared/fetch_data';
import Function_button from '../shared/function_button.jsx';
import Box from '@mui/material/Box';
import { formatEventData, dateFilterParams, dateTimeComparator, getRowStyle  } from '../../utils/grid_utils.jsx';

const Event_grid = () => {
  const { data, loading, error } = useFetchData('events/');
  const [cellHeight, setCellHeight] = useState(false);
  const [whiteSpace, setWhiteSpace] = useState('');

  const formattedData = formatEventData(data)
  
  //linking to device info page
  const onRowClicked = (event) => {
      const rowId = event.data.dev_id;  // Access the dev_id from the row

      window.location.href = `/devices/${rowId}`;
  };

  //Row sizing
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
      flex: 1.2, minWidth: 130,  autoHeight: cellHeight, 
      cellStyle: {whiteSpace: whiteSpace, wordWrap: 'break-word',  lineHeight: 1.2,  paddingTop: '13px', }
    },
    { field: "dev_name", filter: "agTextColumnFilter", headerName: "Device", 
      flex: 1, minWidth: 130,  autoHeight: cellHeight, 
      cellStyle: {whiteSpace: whiteSpace, wordWrap: 'break-word',  lineHeight: 1.2,  paddingTop: '13px', }
    },
    { field: "user_name", filter: "agTextColumnFilter", headerName: "User name", 
      flex: 1, minWidth: 150,  autoHeight: cellHeight, 
      cellStyle: {whiteSpace: whiteSpace, wordWrap: 'break-word',  lineHeight: 1.2,  paddingTop: '13px', }
    },
    { field: "user_email", filter: "agTextColumnFilter", headerName: "Email", 
      flex: 1, minWidth: 200,  autoHeight: cellHeight, 
      cellStyle: {whiteSpace: whiteSpace, wordWrap: 'break-word',  lineHeight: 1.2,  paddingTop: '13px', }
    },
    { field: "company", filter: "agTextColumnFilter", headerName: "Company", 
      flex: 1, minWidth: 150,  autoHeight: cellHeight, 
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
          rowData={formattedData.length > 0 ? formattedData : []} 
          columnDefs={columnDefs}
          onRowClicked={onRowClicked}
          getRowStyle={getRowStyle}
          ref={gridRef}
      />
    </div>
  );
};

export default Event_grid;
