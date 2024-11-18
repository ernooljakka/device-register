import React from 'react';
import { render, screen } from '@testing-library/react';
import DeviceGrid from '../components/device_register/device_register_grid';
import useFetchData from '../components/shared/fetch_data';
import '@testing-library/jest-dom';

jest.mock('../components/shared/fetch_data');

describe('DeviceRegisterGrid Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('displays loading message when fetching data', () => {
        useFetchData.mockReturnValue({ data: [], loading: true, error: null });

        render(<DeviceGrid />);

        expect(screen.getByText('Loading devices...')).toBeInTheDocument();
    });

    test('displays error message on error', () => {
        useFetchData.mockReturnValue({
             data: [], loading: false, error: new Error('Failed to fetch') });
        
        render(<DeviceGrid />);

        // Assert that the error message is displayed correctly.
        expect(screen.getByText(/Failed to load devices\.\s*Please try again later\./)).toBeInTheDocument();
    });

    test('renders the data grid with the fetched data', async () => {
        useFetchData.mockReturnValue({
            data: [
                { 
                    dev_manufacturer: "Apple", 
                    dev_model: 'Sensor', 
                    dev_name: 'Temperature Sensor', 
                    loc_name: 'Acme Corp',
                    class_name: 'Important'
                },
            ],
            loading: false,
            error: null,
        });

        render(<DeviceGrid />); 

        // Cells
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Temperature Sensor')).toBeInTheDocument();
        expect(screen.getByText('Sensor')).toBeInTheDocument();
        expect(screen.getByText('Acme Corp')).toBeInTheDocument();
        expect(screen.getByText('Important')).toBeInTheDocument();
        // Headers
        expect(screen.getByText('Manufacturer')).toBeInTheDocument();
        expect(screen.getByText('Model')).toBeInTheDocument();
        expect(screen.getByText('Device')).toBeInTheDocument();
        expect(screen.getByText('Location')).toBeInTheDocument();
        expect(screen.getByText('Class')).toBeInTheDocument();
        //Buttons
        const exportButton = screen.getByText('Export CSV');
        const expandButton = screen.getByText('Expand rows');
        expect(exportButton).toBeInTheDocument();
        expect(expandButton).toBeInTheDocument();

    });
});
