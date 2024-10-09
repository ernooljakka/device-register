import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/';
import Device_description from '../components/device_info/device_description';

describe('Device_description Component', () => {
  const deviceData = {
    devClass: 'Microscope',
    devComments: 'Broken',
    devManufacturer: 'TTY',
    devModel: '123',
  };

  test('renders the device description correctly', () => {
    render(<Device_description 
             devClass={deviceData.devClass} 
             devComments={deviceData.devComments} 
             devManufacturer={deviceData.devManufacturer} 
             devModel={deviceData.devModel} 
           />);

    expect(screen.getByText(/Device Class:/i)).toBeInTheDocument();
    expect(screen.getByText(deviceData.devClass)).toBeInTheDocument();

    expect(screen.getByText(/Manufacturer:/i)).toBeInTheDocument();
    expect(screen.getByText(deviceData.devManufacturer)).toBeInTheDocument();

    expect(screen.getByText(/Model:/i)).toBeInTheDocument();
    expect(screen.getByText(deviceData.devModel)).toBeInTheDocument();

    expect(screen.getByText(/Device Comments:/i)).toBeInTheDocument();
    expect(screen.getByText(deviceData.devComments)).toBeInTheDocument();
  });
});