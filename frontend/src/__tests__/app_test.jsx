import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../app';
import { isJwtValid } from '../utils/jwt_utils';

jest.mock('../views/device_register_view', () => () => <div>RegisterView</div>); // eslint-disable-line 
jest.mock('../utils/jwt_utils');

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('renders routes after JWT validation', async () => {
    isJwtValid.mockImplementation(() => true);  // Simulate valid JWT
    render(<App />);
    
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    expect(screen.getByText('RegisterView')).toBeInTheDocument();
  });


});
