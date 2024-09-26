// App.test.jsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/';
import App from '../app';

test('Renders move device heading', () => {
  render(<App />);
  
  const headingElement = screen.getByText(/Move Device/i);
  
  expect(headingElement).toBeInTheDocument();
});