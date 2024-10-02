import React from 'react';
import Box from '@mui/material/Box';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const Grid_table = ({rowData, columnDefs}) => {
  return (
    <Box
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        mt: 1,
        mb: 4,
        maxWidth: 1000,
      }}
      className="ag-theme-quartz"
      style={{ width: '95vw', height: '80vh' }}
    >
      <AgGridReact
        rowData={rowData} 
        columnDefs={columnDefs} 
        defaultColDef={{ 
          resizable: false, 
          sortable: true, 
          filter: true,
          floatingFilter: true, 
          minWidth: 100 
        }} 
        animateRows={true}
        pagination={true} 
        paginationAutoPageSize = {true}
        paginationPageSizeSelector={false}
        style={{ flexGrow: 1 }}
      />
    </Box>
  );
};

export default Grid_table;
