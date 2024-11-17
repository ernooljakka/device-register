import React, { useRef, useEffect, useState } from 'react';
import GridTable from '../shared/grid_table.jsx';
import Typography from '@mui/material/Typography';
import useFetchData from '../shared/fetch_data';
import Function_button from '../shared/function_button.jsx';
import Box from '@mui/material/Box';

const Device_register_grid = () => {
    const { data: devices, loading, error } = useFetchData('devices/current_locations/');
    const [cellHeight, setCellHeight] = useState(false);
    const [whiteSpace, setWhiteSpace] = useState('');

    //linking to device info page
    const onRowClicked = (e) => {
        const rowId = e.data.dev_id;  // Access the dev_id from the row
        window.location.href = `/devices/${rowId}`;  
    };

    //Row sizing
    const handleRowSizing = () => {
        if(!cellHeight) {        
            setWhiteSpace('normal')
        }
        else {
            setWhiteSpace('')
        }
        setCellHeight(!cellHeight);
    }

    const columnDefs = [
        { field: "dev_manufacturer", filter: "agTextColumnFilter", headerName: "Manufacturer", flex: 1.2, minWidth: 140, sort: "asc", autoHeight: cellHeight,
            cellStyle: {whiteSpace: whiteSpace, wordWrap: 'break-word',  lineHeight: 1.2,  paddingTop: '13px', }
            }, // Enough for 9999 devices
        { field: "dev_model", filter: "agTextColumnFilter", headerName: "Model", flex: 1.4, minWidth: 120, autoHeight: cellHeight,
            cellStyle: {whiteSpace: whiteSpace, wordWrap: 'break-word',  lineHeight: 1.2,  paddingTop: '13px', }
             }, // Not as important, 14 characters
        { field: "dev_name", filter: "agTextColumnFilter", headerName: "Device", flex: 2,  minWidth: 120, autoHeight: cellHeight,
            cellStyle: {whiteSpace: whiteSpace, wordWrap: 'break-word',  lineHeight: 1.2,  paddingTop: '13px', },
            }, // Important, 34 characters 
        { field: "loc_name", filter: "agTextColumnFilter", headerName: "Location", flex: 2, minWidth: 170, autoHeight: cellHeight,
            cellStyle: {whiteSpace: whiteSpace, wordWrap: 'break-word',  lineHeight: 1.2,  paddingTop: '13px', }        
        }, // 14 characters
        { field: "class_name", filter: "agTextColumnFilter", headerName: "Class", flex: 2, minWidth: 120, autoHeight: cellHeight,
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

    useEffect(() => {
        const handleExportClick = () => {
            if (gridRef.current) {
              gridRef.current.exportCsv();
            } else {
              console.error('Grid reference is not available');
            }
          };
      
        const handleEvent = () => {
            handleExportClick();
        };
          
        window.addEventListener('Export', handleEvent);
      
        return () => {
          window.removeEventListener('Export', handleEvent);
        };
    }, []);

    const getRowStyle = () => {
        return { cursor: 'pointer' };
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
            rowData={devices.length > 0 ? devices : []} 
            columnDefs={columnDefs}
            onRowClicked={onRowClicked}
            getRowStyle={getRowStyle}
            ref={gridRef}
        />
        </div>
    );
};

export default Device_register_grid;