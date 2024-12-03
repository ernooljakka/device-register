import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/';
import NavigationBar from '../components/shared/navigation_bar';

describe("NavigationBar Component", () => {
  beforeEach(() => {
    // Mock localStorage methods
    Storage.prototype.getItem = jest.fn();  // eslint-disable-line no-undef
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Renders navigation bar with locked admin access when not authenticated", () => {
    localStorage.getItem.mockReturnValue(null); 

    render(<NavigationBar />);

    expect(screen.getByLabelText('Home')).toBeInTheDocument();
    expect(screen.getByLabelText('Admin Login')).toBeInTheDocument(); 
    expect(screen.queryByLabelText('Admin Panel')).not.toBeInTheDocument();
  });

  test("Renders navigation bar with open admin access when authenticated", () => {
    localStorage.getItem.mockReturnValue("fake_token"); 

    render(<NavigationBar />);

    expect(screen.getByLabelText('Home')).toBeInTheDocument();
    expect(screen.getByLabelText('Admin Panel')).toBeInTheDocument(); 
    expect(screen.queryByLabelText('Admin Login')).not.toBeInTheDocument();
  });
});
