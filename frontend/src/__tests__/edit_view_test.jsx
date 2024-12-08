import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Edit_view from '../views/edit_view';
import useFetchData from '../components/shared/fetch_data';
import usePatch from '../components/shared/patch_data';

// Mock the hooks and components
jest.mock('../components/shared/fetch_data', () => ({
    __esModule: true,
    default: jest.fn(),
}));
jest.mock('../components/shared/patch_data', () => ({
    __esModule: true,
    default: jest.fn(),
}));



describe('Edit_view Component', () => {

  const mockPatchData = jest.fn();
    usePatch.mockReturnValue({ patchData: mockPatchData });


  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a loading state initially', () => {
    useFetchData.mockReturnValue({ loading: true, data: { "msg": "Authorized" }, error: null });
    render(
      <MemoryRouter>
        <Edit_view />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading class data/i)).toBeInTheDocument();
  });

  it('renders an authorization error if the user is not authorized', () => {
    useFetchData.mockReturnValue({ data: { "msg": "No token" }, error: null }); // auth/admin
    render(
      <MemoryRouter>
        <Edit_view />
      </MemoryRouter>
    );

    expect(screen.getByText(/you must be logged in to view this content/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('renders the edit form when the user is authorized', () => {
    useFetchData
      .mockReturnValue({ data: {"msg": "Authorized"}, error: null}) 
      const deviceClasses = [
        { class_id: 1, class_name: 'Class A' },
        { class_id: 2, class_name: 'Class B' },
      ];
      const device = {
        class_name: 'Class A',
        dev_comments: 'Test Comment',
        dev_manufacturer: 'Manufacturer',
        dev_home: "Place",
        dev_model: 'Model 1',
        dev_name: 'Device 1',
      };
  
      // Mock the return values for the hook
      useFetchData.mockImplementation((url) => {
        if (url === 'classes/') {
          return { data: deviceClasses, loading: false };
        }
        if (url.startsWith('devices/')) {
          return { data: device, loading: false };
        }
        return { data: {"msg": "Authorized"}, error: null };
      });

    render(
      <MemoryRouter>
        <Edit_view />
      </MemoryRouter>
    );

    
    expect(screen.getByLabelText(/Device name/i)).toHaveValue('Device 1');
    expect(screen.getByDisplayValue('Model 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Manufacturer')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Place')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Comment')).toBeInTheDocument();

    expect(screen.getByText('Edit Device')).toBeInTheDocument();
  });

  it('validates and submits updated data', () => {
    useFetchData
      .mockReturnValue({ data: {"msg": "Authorized"}, error: null}) 
      const deviceClasses = [
        { class_id: 1, class_name: 'Class A' },
        { class_id: 2, class_name: 'Class B' },
      ];
      const device = {
        class_name: 'Class A',
        dev_comments: 'Test Comment',
        dev_manufacturer: 'Manufacturer',
        dev_home: "Place",
        dev_model: 'Model 1',
        dev_name: 'Device 1',
      };
  
      // Mock the return values for the hook
      useFetchData.mockImplementation((url) => {
        if (url === 'classes/') {
          return { data: deviceClasses, loading: false };
        }
        if (url.startsWith('devices/')) {
          return { data: device, loading: false };
        }
        return { data: {"msg": "Authorized"}, error: null };
      });

    render(
      <MemoryRouter>
        <Edit_view />
      </MemoryRouter>
    );

    /*await waitFor(() => {
      expect(screen.getByDisplayValue('Device 1')).toBeInTheDocument();
    });*/

    fireEvent.change(screen.getByLabelText(/Device name/i), {
      target: { value: 'Updated Device' },
    });
    fireEvent.change(screen.getByLabelText(/Device model/i), {
      target: { value: 'Updated Model' },
    });
    fireEvent.change(screen.getByLabelText(/Device manufacturer/i), {
      target: { value: 'Updated Manufacturer' },
    });

    fireEvent.change(screen.getByLabelText(/Home Location/i), {
      target: { value: 'New Place' },
    });

    fireEvent.mouseDown(screen.getByLabelText(/Device Class/i));
    fireEvent.click(screen.getByText(/Class B/));

    fireEvent.submit(screen.getByText('Edit'));

    
      expect(mockPatchData).toHaveBeenCalledWith(
        "devices/undefined",
        {
          class_id: 2,
          dev_comments: 'Test Comment',
          dev_manufacturer: 'Updated Manufacturer',
          dev_home: "New Place",
          dev_model: 'Updated Model',
          dev_name: 'Updated Device',
        },
        "Editing device"
      );
  });

  
});