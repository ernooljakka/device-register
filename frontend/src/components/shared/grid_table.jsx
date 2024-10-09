import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { AgGridReact } from 'ag-grid-react';
import SearchBar from './search_bar';
import PropTypes from 'prop-types';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const Grid_table = ({ rowData, columnDefs }) => {
  const [quickFilterText, setQuickFilterText] = useState("");

  console.log('Row Data:', rowData);
  console.log('Column Definitions:', columnDefs);

  return (
    <Box
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        mt: 1,
        mb: 6,
        maxWidth: 1000,
      }}
      className="ag-theme-quartz"
      style={{ width: '95vw', height: '75vh' }}
    >
      <SearchBar
        quickFilterText={quickFilterText}
        setQuickFilterText={setQuickFilterText}
      />
      
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{
          resizable: false,
          sortable: true,
          filter: true,
          suppressHeaderFilterButton: true,
        }}
        animateRows={true}
        pagination={true}
        paginationAutoPageSize={true}
        style={{ flexGrow: 1 }}
      />
    </Box>
  );
};

Grid_table.propTypes = {
  rowData: PropTypes.array.isRequired,
  columnDefs: PropTypes.array.isRequired,
};

export default Grid_table;
