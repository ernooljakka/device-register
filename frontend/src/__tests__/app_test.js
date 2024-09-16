// App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../app';

test('Renders move device heading', () => {
  render(<App />);
  
  const headingElement = screen.getByText(/Move Device/i);
  
  expect(headingElement).toBeInTheDocument();
});