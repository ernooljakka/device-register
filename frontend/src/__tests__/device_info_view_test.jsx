import React from 'react';
import { render, screen } from '@testing-library/react';
import Device_info_view from '../views/device_info_view';
import '@testing-library/jest-dom';

jest.mock('../components/shared/navigation_bar', () => {
    const MockedNavigationBar = () => <div>Mocked NavigationBar</div>;
    MockedNavigationBar.displayName = 'MockedNavigationBar'; // eslint wants this.
    return MockedNavigationBar;
});

jest.mock('../components/device_info/device_info_grid', () => {
    const MockedDeviceGrid = () => <div>Mocked DeviceInfoGrid</div>;
    MockedDeviceGrid.displayName = 'MockedDeviceInfoGrid'; // eslint wants this.
    return MockedDeviceGrid;
});

describe('DeviceRegisterView Component', () => {
    test('render Navbar and DeviceInfoGrid correctly', () => {

        render(<Device_info_view />);

        expect(screen.getByText('Mocked NavigationBar')).toBeInTheDocument();
        expect(screen.getByText('Mocked DeviceInfoGrid')).toBeInTheDocument();
    });
});
