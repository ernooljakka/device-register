import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { AgGridReact } from 'ag-grid-react';
import SearchBar from './search_bar';
import PropTypes from 'prop-types';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const Grid_table = ({ rowData, columnDefs, onRowClicked, getRowStyle }) => {
  const [quickFilterText, setQuickFilterText] = useState("");

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
          suppressMovable: true,
          suppressHeaderFilterButton: true,
        }}
        getRowStyle={getRowStyle}
        onRowClicked={onRowClicked}
        animateRows={true}
        pagination={true}
        paginationPageSize= {20}
        paginationPageSizeSelector = {false}
        style={{ flexGrow: 1 }}
        quickFilterText={quickFilterText}
      />
    </Box>
  );
};

Grid_table.propTypes = {
  rowData: PropTypes.array.isRequired,
  columnDefs: PropTypes.array.isRequired,
  onRowClicked: PropTypes.func,
  getRowStyle: PropTypes.func
};

export default Grid_table;
