import React from 'react';
import { render, screen } from '@testing-library/react';
import ClassView from "../views/class_view";
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

describe('ClassView Component', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders Navbar and header correctly when authenticated, no delete button', () => {
        useFetchData.mockReturnValue({ data: {"msg": "Authorized"}, loading: false, error: null });

        render(<ClassView/>);
        console.log(useFetchData.mock.results[0].value);

        expect(screen.getByText('Mocked NavigationBar')).toBeInTheDocument();
        expect(screen.getByText('Edit Classes')).toBeInTheDocument();
        expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    });



    test('shows login required message when not authenticated', () => {
        useFetchData.mockReturnValue({ data: { "msg": "No token" }, loading: false, error: null });
        
        render(<ClassView />);
        
        expect(screen.queryByText('Mocked NavigationBar')).toBeInTheDocument();
        expect(screen.getByText('You must be logged in to view this content.')).toBeInTheDocument();
    });
});