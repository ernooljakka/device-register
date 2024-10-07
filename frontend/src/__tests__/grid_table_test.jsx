import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/';
import GridTable from '../components/shared/grid_table';

const rowData = [
    { test_id: '1', test_name: 'Chungus McTesterdon', test_sandwich: 'BLT', dev_dreams: 'job' },
    { test_id: '2', test_name: 'Real TestName', test_sandwich: 'Club', dev_dreams: 'thesis' },
  ];
  
const columnDefs = [
    { field: 'test_id', headerName: 'TEST ID' },
    { field: 'test_name', headerName: 'TEST NAME' },
    { field: 'test_sandwich', headerName: 'EAT ME' },
    { field: 'dev_dreams', headerName: 'CRUSHED' },
];

describe('GridTable Component', () => {

    test('renders the correct column headers', () => {
        const { getByText } = render(<GridTable rowData={rowData} columnDefs={columnDefs} />);
        expect(getByText('TEST ID')).toBeInTheDocument();
        expect(getByText('TEST NAME')).toBeInTheDocument();
        expect(getByText('EAT ME')).toBeInTheDocument();
        expect(getByText('CRUSHED')).toBeInTheDocument();
    });

    test('renders the correct number of rows', () => {
        const { getAllByRole } = render(<GridTable rowData={rowData} columnDefs={columnDefs} />);
        const rows = getAllByRole('row');
        expect(rows.length).toBe(3); // Take in account header row.
    });

    test('renders the correct data cells', () => {
        const { getByText } = render(<GridTable rowData={rowData} columnDefs={columnDefs} />);
        expect(getByText('Chungus McTesterdon')).toBeInTheDocument();
        expect(getByText('BLT')).toBeInTheDocument();
        expect(getByText('job')).toBeInTheDocument();

        expect(getByText('Real TestName')).toBeInTheDocument();
        expect(getByText('Club')).toBeInTheDocument();
        expect(getByText('thesis')).toBeInTheDocument();
    });
});