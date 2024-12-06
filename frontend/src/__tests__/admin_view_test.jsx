import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminView from '../views/admin_view';
import '@testing-library/jest-dom';

jest.mock('../components/shared/navigation_bar', () => {
  const MockedNavigationBar = () => <div>Mocked NavigationBar</div>;
  MockedNavigationBar.displayName = 'MockedNavigationBar';
  return MockedNavigationBar;
});

jest.mock('../components/shared/sign_out_button', () => {
  const MockedSignoutButton = () => <div>Mocked Signout Button</div>;
  MockedSignoutButton.displayName = 'MockedSignoutButton';
  return MockedSignoutButton;
});

jest.mock('../components/shared/fetch_data', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../components/shared/link_button', () => {
  const MockedLinkButton = ({text }) => <div>{text}</div>; // eslint-disable-line 
  MockedLinkButton.displayName = 'MockedLinkButton';
  return MockedLinkButton;
});


import useFetchData from '../components/shared/fetch_data';

describe('AdminView Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Navbar and header correctly when authenticated', () => {
    useFetchData.mockReturnValue({ data: { msg: 'Authorized' }, loading: false, error: null });

    render(<AdminView />);

    expect(screen.getByText('Mocked NavigationBar')).toBeInTheDocument();
    expect(screen.getByText('Management pages')).toBeInTheDocument();
    expect(screen.getByText('Devices')).toBeInTheDocument();
    expect(screen.getByText('Events')).toBeInTheDocument();
    expect(screen.getByText('Classes')).toBeInTheDocument();
  });

  test('shows login required message when not authenticated', () => {
    useFetchData.mockReturnValue({ data: { msg: 'No token' }, loading: false, error: null });

    render(<AdminView />);

    expect(screen.getByText('Mocked NavigationBar')).toBeInTheDocument();
    expect(screen.getByText('You must be logged in to view this content.')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('shows loading indicator when loading', () => {
    useFetchData.mockReturnValue({ data: null, loading: true, error: null });

    render(<AdminView />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('handles export button click', async () => {
    useFetchData.mockReturnValue({ data: { msg: 'Authorized' }, loading: false, error: null });
    global.fetch = jest.fn().mockResolvedValue({ 
      ok: true,
      blob: async () => new Blob(['mockCSVContent']), // eslint-disable-line 
    });

    render(<AdminView />);

    const exportButton = screen.getByText('Export CSV');
    fireEvent.click(exportButton);

    expect(exportButton).toHaveTextContent('Exporting...');

    await waitFor(() => expect(exportButton).toHaveTextContent('Export CSV'));
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/devices/export/'), expect.any(Object));
  });

  test('handles import button click with valid file', async () => {
    useFetchData.mockReturnValue({ data: { msg: 'Authorized' }, loading: false, error: null });
  
    // Mock the successful import response
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Import successful' }),
    });
  
    render(<AdminView />);
  
    const importButton = screen.getByText('Import CSV');
    fireEvent.click(importButton);
    const fileInput = document.getElementById('csv-import');
    
    const file = new File(['mockCSVContent'], 'mockfile.csv', { type: 'text/csv' }); // eslint-disable-line 
    fireEvent.change(fileInput, { target: { files: [file] } });
  
    expect(importButton).toHaveTextContent('Importing...');
    await waitFor(() => expect(importButton).toHaveTextContent('Import CSV'));
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/devices/import/'), expect.any(Object));
  });
  
  test('disables the Export and Import CSV button after selecting a file', async () => {
    useFetchData.mockReturnValue({ data: { msg: 'Authorized' }, loading: false, error: null });

    render(<AdminView />);
    const exportButton = screen.getByText('Export CSV');
    const importButton = screen.getByText('Import CSV');

    fireEvent.click(exportButton);
    expect(exportButton).toBeDisabled();

    fireEvent.click(importButton);
    const fileInput = document.getElementById('csv-import');

    const file = new File(['mockCSVContent'], 'mockfile.csv', { type: 'text/csv' }); // eslint-disable-line 
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => expect(importButton).toBeDisabled());
  });
  
});
