import React from 'react';
import { render, screen } from '@testing-library/react';
import Device_info_grid from '../components/device_info/device_info_grid';
import useFetchData from '../components/shared/fetch_data';
import '@testing-library/jest-dom';

jest.mock('../components/shared/fetch_data');
jest.spyOn(Date.prototype, 'toLocaleString').mockImplementation(() => '08/10/2024, 15:34');

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
                    comment: 'toimii', 
                    move_time: "2024-10-08T12:34:00", 
                    loc_name: 'Labra', 
                    user_name: 'User1'
                },
            ],
            loading: false,
            error: null,
        });

        render(<Device_info_grid id={1}/>);

        // Cells
        expect(screen.getByText('toimii')).toBeInTheDocument();
        expect(screen.getByText('08/10/2024, 15:34')).toBeInTheDocument();
        expect(screen.getByText('Labra')).toBeInTheDocument();
        expect(screen.getByText('User1')).toBeInTheDocument();
        // Headers
        expect(screen.getByText('Comment')).toBeInTheDocument();
        expect(screen.getByText('Date/Time')).toBeInTheDocument();
        expect(screen.getByText('Location')).toBeInTheDocument();
        expect(screen.getByText('User name')).toBeInTheDocument();
        //buttons
        const exportButton = screen.getByText('Export CSV');
        const expandButton = screen.getByText('Expand rows');
        expect(exportButton).toBeInTheDocument();
        expect(expandButton).toBeInTheDocument();
    });

    test('correctly formats move_time into local timezone', () => {
        const test_time = "2024-12-12 23:59:59"
        const mockData = {
            data: [
                { move_time: test_time, comment: "Test Comment" },
            ],
            loading: false,
            error: null,
        };
    
        useFetchData.mockReturnValue(mockData);

        const test_time_format =  new Date(test_time.replace(' ', 'T') + 'Z').toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
    
        render(<Device_info_grid id={1} />);
    
        // Check formatted time in local timezone
        expect(screen.getByText(test_time_format)).toBeInTheDocument(); // Adjust this based on your local timezone
    });

});