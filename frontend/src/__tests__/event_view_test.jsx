import React from 'react';
import { render, screen } from '@testing-library/react';
import EventView from "../views/event_view";
import '@testing-library/jest-dom';

jest.mock('../components/shared/navigation_bar', () => {
    const MockedNavigationBar = () => <div>Mocked NavigationBar</div>;
    MockedNavigationBar.displayName = 'MockedNavigationBar'; // eslint wants this.
    return MockedNavigationBar;
});

jest.mock('../components/event_view_components/event_grid', () => {
    const MockedDeviceGrid = () => <div>Mocked EventGrid</div>;
    MockedDeviceGrid.displayName = 'MockedEventGrid'; // eslint wants this.
    return MockedDeviceGrid;
});

describe('EventView Component', () => {
    test('render Navbar, header, and EventGrid correctly', () => {

        render(<EventView />);

        expect(screen.getByText('Mocked NavigationBar')).toBeInTheDocument();
        expect(screen.getByText('Event History')).toBeInTheDocument();
        expect(screen.getByText('Mocked EventGrid')).toBeInTheDocument();
    });

    test('renders the header text with correct styles', () => {

        render(<EventView />);

        const ViewTitle = screen.getByText('Event History');
        expect(ViewTitle).toHaveStyle({
            fontSize: 'clamp(1.5rem, 5vw, 2.4rem)',
            textAlign: 'center',
            marginTop: '64px', // 8*8px
            marginBottom: '24px', // 3*8px
        });
    });
});
