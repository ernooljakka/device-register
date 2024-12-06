import React from 'react';
import { render, screen } from '@testing-library/react';
import ClassView from "../views/class_view";
import '@testing-library/jest-dom';

// Mock components to avoid rendering actual components
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

// Mock the useFetchData, usePostData, and useDelete hooks here
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
    useFetchData.mockReturnValue({ data: { "msg": "Authorized" }, loading: false, error: null });

    render(<ClassView />);

    expect(screen.getByText('Mocked NavigationBar')).toBeInTheDocument();
    expect(screen.getByText('Edit Classes')).toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument(); // No delete button when no classes
  });

  test('shows login required message when not authenticated', () => {
    useFetchData.mockReturnValue({ data: { "msg": "No token" }, loading: false, error: null });

    render(<ClassView />);

    expect(screen.getByText('You must be logged in to view this content.')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('displays loading message when data is loading', () => {
    useFetchData.mockReturnValue({ data: null, loading: true, error: null });

    render(<ClassView />);

    expect(screen.getByText('Loading class data...')).toBeInTheDocument();
  });


  test('does not display delete button if no classes are available', () => {
    useFetchData.mockReturnValueOnce({ data: { "msg": "Authorized" }, loading: false, error: null });

    useFetchData.mockReturnValueOnce({
      data: [],
      loading: false,
      error: null
    });

    render(<ClassView />);

    // Ensure the delete button is not rendered when there are no classes
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });


});
