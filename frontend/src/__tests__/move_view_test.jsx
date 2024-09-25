// Move_view.test.jsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/';
import Move_view from '../views/move_view';

test('renders Move Device heading', () => {
  render(<Move_view />);

  const headingElement = screen.getByText(/Move Device/i);
  expect(headingElement).toBeInTheDocument();
});