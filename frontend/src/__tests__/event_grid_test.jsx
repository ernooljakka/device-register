import React from 'react';
import { render, screen } from '@testing-library/react';
import EventGrid from '../components/event_view_components/event_grid';
import useFetchData from '../components/shared/fetch_data';
import '@testing-library/jest-dom';

jest.mock('../components/shared/fetch_data');

describe('DeviceRegisterGrid Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('displays loading message when fetching data', () => {
        useFetchData.mockReturnValue({ data: [], loading: true, error: null });

        render(<EventGrid />);

        expect(screen.getByText('Loading devices...')).toBeInTheDocument();
    });

    test('displays error message on error', () => {
        useFetchData.mockReturnValue({
             data: [], loading: false, error: new Error('Failed to fetch') });

        render(<EventGrid />);

        // Assert that the error message is displayed correctly.
        expect(screen.getByText(/Failed to load devices\.\s*Please try again later\./)).toBeInTheDocument();
    });

    test('renders the data grid with the fetched data', async () => {
        useFetchData.mockReturnValue({
            data: [
                { 
                    dev_id: 1, 
                    user_id: '020202', 
                    move_time: '2024-10-03T21:12:17.840Z', 
                    loc_name: 'Test Laboratory' 
                },
            ],
            loading: false,
            error: null,
        });

        render(<EventGrid />);

        // Cells
        expect(screen.getByText('020202')).toBeInTheDocument();
        expect(screen.getByText('2024-10-03')).toBeInTheDocument();
        expect(screen.getByText('Test Laboratory')).toBeInTheDocument();
        // Headers
        expect(screen.getByText('DEV')).toBeInTheDocument();
        expect(screen.getByText('USER')).toBeInTheDocument();
        expect(screen.getByText('Date')).toBeInTheDocument();
        expect(screen.getByText('Location')).toBeInTheDocument();
    });
});