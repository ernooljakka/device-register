import React from 'react';
import { render, screen } from '@testing-library/react';
import EventView from "../views/event_view";
import '@testing-library/jest-dom';

jest.mock('../components/shared/navigation_bar', () => {
    const MockedNavigationBar = () => <div>Mocked NavigationBar</div>;
    MockedNavigationBar.displayName = 'MockedNavigationBar';
    return MockedNavigationBar;
});

jest.mock('../components/event_view_components/event_grid', () => {
    const MockedEventGrid = () => <div>Mocked EventGrid</div>;
    MockedEventGrid.displayName = 'MockedEventGrid';
    return MockedEventGrid;
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

    test('renders Navbar, header, and EventGrid correctly when authenticated', () => {
        useFetchData.mockReturnValue({ data: {"msg": "Authorized"}, loading: false, error: null });

        render(<EventView />);
        console.log(useFetchData.mock.results[0].value);

        expect(screen.getByText('Mocked NavigationBar')).toBeInTheDocument();
        expect(screen.getByText('Event History')).toBeInTheDocument();
        expect(screen.getByText('Mocked EventGrid')).toBeInTheDocument();
    });

    test('renders the header text with correct styles when authenticated', () => {
        useFetchData.mockReturnValue({data: { "msg": "Authorized" }, loading: false, error: null });
        render(<EventView />);
        

        const viewTitle = screen.getByText('Event History');
        expect(viewTitle).toHaveStyle({
            fontSize: 'clamp(1.5rem, 5vw, 2.4rem)',
            textAlign: 'center',
            marginTop: '64px',
            marginBottom: '24px',
        });
    });

    test('shows login required message when not authenticated', () => {
        useFetchData.mockReturnValue({ data: { "msg": "No token" }, loading: false, error: null });
        
        render(<EventView />);
        
        expect(screen.queryByText('Mocked NavigationBar')).toBeInTheDocument();
        expect(screen.queryByText('Mocked EventGrid')).not.toBeInTheDocument();
        expect(screen.getByText('You must be logged in to view this content.')).toBeInTheDocument();
    });

    test('shows loading indicator when loading', () => {
        useFetchData.mockReturnValue({ auth: false, loading: true, error: null });

        render(<EventView />);

        expect(screen.queryByText('Loading...')).toBeInTheDocument();
    });
});
