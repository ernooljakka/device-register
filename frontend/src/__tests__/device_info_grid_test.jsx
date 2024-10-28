import React from 'react';
import { render, screen } from '@testing-library/react';
import Device_info_grid from '../components/device_info/device_info_grid';
import useFetchData from '../components/shared/fetch_data';
import '@testing-library/jest-dom';

jest.mock('../components/shared/fetch_data');

describe('Device_info_grid Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('displays loading message when fetching data', () => {
        useFetchData.mockReturnValue({ data: [], loading: true, error: null });

        render(<Device_info_grid id={1}/>);

        expect(screen.getByText('Loading events...')).toBeInTheDocument();
    });

    test('displays error message on error', () => {
        useFetchData.mockReturnValue({
             data: [], loading: false, error: new Error('Failed to fetch') });
        
        render(<Device_info_grid id={1}/>);

        // Assert that the error message is displayed correctly.
        expect(screen.getByText(/Failed to load events\.\s*Please try again later\./)).toBeInTheDocument();
    });

    test('renders the data grid with the fetched data', async () => {
        useFetchData.mockReturnValue({
            data: [
                { 
                    event_id: 1, 
                    comment: 'toimii', 
                    move_time: '2024-10-08 12:34:56', 
                    loc_name: 'Labra' 
                },
            ],
            loading: false,
            error: null,
        });

        render(<Device_info_grid id={1}/>);

        // Cells
        expect(screen.getByText('toimii')).toBeInTheDocument();
        expect(screen.getByText('08/10/2024 12:34:56')).toBeInTheDocument();
        expect(screen.getByText('Labra')).toBeInTheDocument();
        // Headers
        expect(screen.getByText('ID')).toBeInTheDocument();
        expect(screen.getByText('Comment')).toBeInTheDocument();
        expect(screen.getByText('Date/Time')).toBeInTheDocument();
        expect(screen.getByText('Location')).toBeInTheDocument();
    });
});