import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/';
import NavigationBar from '../components/shared/navigation_bar';

describe("LinkButton Component", () => {

  test("Render navigation bar correctly", () => {
    render(<NavigationBar />);

    expect(screen.getByLabelText('Events Log')).toBeInTheDocument();
    expect(screen.getByLabelText('Home')).toBeInTheDocument();
    expect(screen.getByLabelText('Admin Panel')).toBeInTheDocument();
  });

});