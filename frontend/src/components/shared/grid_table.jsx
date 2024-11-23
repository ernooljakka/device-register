import React, { forwardRef, useRef, useImperativeHandle, useState } from 'react';
import Box from '@mui/material/Box';
import SearchBar from './search_bar';
import PropTypes from 'prop-types';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';
import { AgGridReact } from '@ag-grid-community/react';
import { CsvExportModule } from '@ag-grid-community/csv-export';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-quartz.css';

ModuleRegistry.registerModules([ClientSideRowModelModule, CsvExportModule]);

const Grid_table = forwardRef(
  ({ rowData, columnDefs, onRowClicked, getRowStyle, getRowHeight = () => 'auto' }, ref) => {
    const [quickFilterText, setQuickFilterText] = useState("");

    const gridRef = useRef(null);

    useImperativeHandle(ref, () => ({
      exportCsv: () => {
        if (gridRef.current && gridRef.current.api) {
          const exportParams = {
            columnSeparator: ';',
          };
          gridRef.current.api.exportDataAsCsv(exportParams);
        } else {
          console.error('Grid API is not available');
        }
      },
    }));

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
          ref={gridRef}
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
          getRowHeight={getRowHeight} 
          onRowClicked={onRowClicked}
          animateRows={true}
          pagination={true}
          paginationPageSize={20}
          paginationPageSizeSelector={false}
          localeText={{
            page: "",
            to: "..",
            of: "/"
          }}
          style={{ flexGrow: 1 }}
          quickFilterText={quickFilterText}
        />
      </Box>
    );
  }
);

Grid_table.propTypes = {
  rowData: PropTypes.array.isRequired,
  columnDefs: PropTypes.array.isRequired,
  onRowClicked: PropTypes.func,
  getRowStyle: PropTypes.func,
  getRowHeight: PropTypes.func, 
};

Grid_table.displayName = 'Grid_table';
export default Grid_table;
