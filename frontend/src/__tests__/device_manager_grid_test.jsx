import React from 'react';
import { render, screen } from '@testing-library/react';
import Device_manager_grid from '../components/device_manager/device_manager_grid';
import useFetchData from '../components/shared/fetch_data';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

jest.mock('../components/shared/fetch_data');

describe('Device_manager_grid Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('displays loading message when fetching data', () => {
        useFetchData.mockReturnValue({ data: [], loading: true, error: null });

        render(
        //needs to be wrapped inside router because it uses useNavigate()
        <MemoryRouter>
            <Device_manager_grid id={1}/>
        </MemoryRouter>);

        expect(screen.getByText('Loading devices...')).toBeInTheDocument();
    });

    test('displays error message on error', () => {
        useFetchData.mockReturnValue({
             data: [], loading: false, error: new Error('Failed to fetch') });
        
        render(<MemoryRouter>
            <Device_manager_grid id={1}/>
        </MemoryRouter>);

        // Assert that the error message is displayed correctly.
        expect(screen.getByText(/Failed to load devices\.\s*Please try again later\./)).toBeInTheDocument();
    });

    test('renders the data grid with the fetched data', async () => {
        useFetchData.mockReturnValue({
            data: [
                { 
 
                    dev_name: 'iPhone', 
                    dev_manufacturer: 'Apple',
                    dev_model: 'Phone',
                    class_name: 'Kamera'
                },
            ],
            loading: false,
            error: null,
        });

        render(<MemoryRouter>
            <Device_manager_grid id={1}/>
        </MemoryRouter>);

        // Cells
        expect(screen.getByText('iPhone')).toBeInTheDocument();
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Phone')).toBeInTheDocument();
        expect(screen.getByText('Kamera')).toBeInTheDocument();
        // Headers
        expect(screen.getByText('Device')).toBeInTheDocument();
        expect(screen.getByText('Actions')).toBeInTheDocument();
        expect(screen.getByText('Manufacturer')).toBeInTheDocument();
        expect(screen.getByText('Model')).toBeInTheDocument();
        expect(screen.getByText('Class')).toBeInTheDocument();
    });
});