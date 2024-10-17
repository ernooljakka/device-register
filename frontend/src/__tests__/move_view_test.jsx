// Move_view.test.jsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/';
import Move_view from '../views/move_view';
import { MemoryRouter } from 'react-router-dom';

test('renders Move Device heading', () => {
  render(
    //needs to be wrapped inside router because it uses useNavigate()
    <MemoryRouter>
      <Move_view />
    </MemoryRouter>);

  const headingElement = screen.getByText('Move Device');
  expect(headingElement).toBeInTheDocument();
});