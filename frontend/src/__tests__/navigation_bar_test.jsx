import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/';
import NavigationBar from '../components/shared/navigation_bar';

describe("NavigationBar Component", () => {

  test("Renders navigation bar with locked admin access when not authorized", () => {
    const mockAuth = { msg: "Unauthorized" };

    render(<NavigationBar auth={mockAuth} />);

    expect(screen.getByLabelText('Home')).toBeInTheDocument();
    expect(screen.getByLabelText('Admin Login')).toBeInTheDocument();
  });

  test("Renders navigation bar with open admin access when authorized", () => {
    const mockAuth = { msg: "Authorized" };

    render(<NavigationBar auth={mockAuth} />);

    expect(screen.getByLabelText('Home')).toBeInTheDocument();
    expect(screen.getByLabelText('Admin Panel')).toBeInTheDocument();
  });

});
