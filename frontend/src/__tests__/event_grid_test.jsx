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
        const moveTime = new Date('04 Dec 2024 23:59:30 GMT').toISOString();
    
        useFetchData.mockReturnValue({
            data: [
                { 
                    user_email: 'test@example.com',
                    user_name: '020202', 
                    move_time: moveTime,
                    move_time_iso: moveTime,
                    loc_name: 'Test Laboratory', 
                    company: "Apple"
                },
            ],
            loading: false,
            error: null,
        });
    
        render(<EventGrid />);

    
        // Verify cells and headers
        expect(screen.getByText('020202')).toBeInTheDocument();
    
        // Verify datetime with UTC.
        expect(screen.getByText('04/12/2024, 23:59')).toBeInTheDocument();
        expect(screen.getByText('Test Laboratory')).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
    
        // Verify headers
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('User name')).toBeInTheDocument();
        expect(screen.getByText('Date/Time')).toBeInTheDocument();
        expect(screen.getByText('Location')).toBeInTheDocument();
        expect(screen.getByText('Company')).toBeInTheDocument();
    });
    
    

});