import React from 'react';
import { render, screen } from '@testing-library/react';
import Device_manager_view from "../views/device_manager_view";
import '@testing-library/jest-dom';

jest.mock('../components/shared/navigation_bar', () => {
    const MockedNavigationBar = () => <div>Mocked NavigationBar</div>;
    MockedNavigationBar.displayName = 'MockedNavigationBar';
    return MockedNavigationBar;
});

jest.mock('../components/device_manager/device_manager_grid', () => {
    const MockedManagerGrid = () => <div>Mocked ManagerGrid</div>;
    MockedManagerGrid.displayName = 'MockedManagerGrid';
    return MockedManagerGrid;
});

// Mock the useFetchData hook to control its return values
jest.mock('../components/shared/fetch_data', () => ({
    __esModule: true,
    default: jest.fn(),
}));

import useFetchData from '../components/shared/fetch_data';

describe('Device_manager_view Component', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders Navbar, header, and ManagerGrid correctly when authenticated', () => {
        useFetchData.mockReturnValue({ data: {"msg": "Authorized"}, loading: false, error: null });

        render(<Device_manager_view />);
        console.log(useFetchData.mock.results[0].value);

        expect(screen.getByText('Mocked NavigationBar')).toBeInTheDocument();
        expect(screen.getByText('Device manager')).toBeInTheDocument();
        expect(screen.getByText('Mocked ManagerGrid')).toBeInTheDocument();
    });

    test('renders the header text with correct styles when authenticated', () => {
        useFetchData.mockReturnValue({data: { "msg": "Authorized" }, loading: false, error: null });
        render(<Device_manager_view />);
        

        const viewTitle = screen.getByText('Device manager');
        expect(viewTitle).toHaveStyle({
            fontSize: 'clamp(2.4rem, 3vw, 1.8rem)'
        });
    });

    test('shows login required message when not authenticated', () => {
        useFetchData.mockReturnValue({ data: { "msg": "No token" }, loading: false, error: null });
        
        render(<Device_manager_view />);
        
        expect(screen.queryByText('Mocked NavigationBar')).toBeInTheDocument();
        expect(screen.queryByText('Mocked ManagerGrid')).not.toBeInTheDocument();
        expect(screen.getByText('You must be logged in to view this content.')).toBeInTheDocument();
    });

    test('shows loading indicator when loading', () => {
        useFetchData.mockReturnValue({ auth: false, loading: true, error: null });

        render(<Device_manager_view />);

        expect(screen.queryByText('Loading...')).toBeInTheDocument();
    });
});
