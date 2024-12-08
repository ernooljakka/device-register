import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, useParams } from 'react-router-dom';
import Move_view from '../views/move_view';
import useFetchData from '../components/shared/fetch_data';
import usePostData from '../components/shared/post_data';


// Mock the hooks and components
jest.mock('../components/shared/fetch_data', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('../components/shared/post_data', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

describe('Move_view Component', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading state while fetching device data', () => {
    useParams.mockReturnValue({ id: '1' });
    useFetchData.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    const mockPostData = jest.fn();
    usePostData.mockReturnValue({
      result: { message: 'Event created successfully' },
      postData: mockPostData,
    });

    render(
      <MemoryRouter>
        <Move_view />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading device data.../i)).toBeInTheDocument();
  });

  it('displays device data after loading',  () => {
    useParams.mockReturnValue({ id: '1' });
    useFetchData.mockReturnValue({
      data: { dev_name: 'Device 1', dev_id: 1 },
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <Move_view />
      </MemoryRouter>
    );

    expect(screen.getByText('Device 1')).toBeInTheDocument();
    expect(screen.getByText(/ID: 1/i)).toBeInTheDocument();
  });

  it('shows error message when device is not found', () => {
    useParams.mockReturnValue({ id: '1' });
    useFetchData.mockReturnValue({
      data: null,
      loading: false,
      error: true,
    });

    render(
      <MemoryRouter>
        <Move_view />
      </MemoryRouter>
    );

    
    expect(screen.getByText(/Device not found!/i)).toBeInTheDocument();
    
  });

  it('submits form with valid data',  () => {
    useParams.mockReturnValue({ id: '1' });
    useFetchData.mockReturnValue({
      data: { dev_name: 'Device 1', dev_id: 1 },
      loading: false,
      error: null,
    });

    const mockPostData = jest.fn();
    usePostData.mockReturnValue({
      result: { message: 'Event created successfully' },
      postData: mockPostData,
    });


    render(
      <MemoryRouter>
        <Move_view />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'New Location' } });
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Company/i), { target: { value: 'Test Corp' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john.doe@example.com' } });

    fireEvent.click(screen.getByRole('button', { name: /Move/i }));


      expect(mockPostData).toHaveBeenCalledTimes(1);
 

  });

  it('doesnt submit form with missing data',  () => {
    useParams.mockReturnValue({ id: '1' });
    useFetchData.mockReturnValue({
      data: { dev_name: 'Device 1', dev_id: 1 },
      loading: false,
      error: null,
    });

    const mockPostData = jest.fn();
    usePostData.mockReturnValue({
      result: { message: 'Event created successfully' },
      postData: mockPostData,
    });



    render(
      <MemoryRouter>
        <Move_view />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'New Location' } });
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Company/i), { target: { value: 'Test Corp' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /Move/i }));


      expect(mockPostData).toHaveBeenCalledTimes(0);
 

  });
});