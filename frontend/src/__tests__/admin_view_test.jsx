import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminView from "../views/admin_view";
import '@testing-library/jest-dom';

jest.mock('../components/shared/navigation_bar', () => {
    const MockedNavigationBar = () => <div>Mocked NavigationBar</div>;
    MockedNavigationBar.displayName = 'MockedNavigationBar';
    return MockedNavigationBar;
});

// Mock the useFetchData hook to control its return values
jest.mock('../components/shared/fetch_data', () => ({
    __esModule: true,
    default: jest.fn(),
}));

import useFetchData from '../components/shared/fetch_data';

describe('EventView Component', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders Navbar and header correctly when authenticated', () => {
        useFetchData.mockReturnValue({ data: {"msg": "Authorized"}, loading: false, error: null });

        render(<AdminView />);
        console.log(useFetchData.mock.results[0].value);

        expect(screen.getByText('Mocked NavigationBar')).toBeInTheDocument();
        expect(screen.getByText('Management pages')).toBeInTheDocument();
    });



    test('shows login required message when not authenticated', () => {
        useFetchData.mockReturnValue({ data: { "msg": "No token" }, loading: false, error: null });
        
        render(<AdminView />);
        
        expect(screen.queryByText('Mocked NavigationBar')).toBeInTheDocument();
        expect(screen.getByText('You must be logged in to view this content.')).toBeInTheDocument();
    });

    test('shows loading indicator when loading', () => {
        useFetchData.mockReturnValue({ auth: false, loading: true, error: null });

        render(<AdminView />);

        expect(screen.queryByText('Loading...')).toBeInTheDocument();
    });
});
