import { renderHook, act } from '@testing-library/react';
import useDelete from '../components/shared/delete_data';
import { config } from '../utils/config';

describe('useDelete', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'mock_access_token'),
      },
      writable: true,
    });

    global.alert = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('if DELETE request gets successful response, loading is set false and errors null', async () => {
    const mockUrl = `${config.BACKEND_ADDR}/test-endpoint`;
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn(),
    });

    const { result } = renderHook(() => useDelete());

    await act(async () => {
      await result.current.deleteData('test-endpoint', { id: 1 });
    });

    expect(fetch).toHaveBeenCalledWith(mockUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock_access_token',
      },
      body: JSON.stringify({ id: 1 }),
    });

    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(global.alert).not.toHaveBeenCalled();  
  });

  it('if DELETE request fails with an error response, alert is called with the error message', async () => {
    const mockUrl = `${config.BACKEND_ADDR}/test-endpoint`;
    const errorMsg = 'Delete Data failed: 500 Internal Server Error';
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: jest.fn().mockResolvedValueOnce({ message: 'Internal Server Error' }),
    });

    const { result } = renderHook(() => useDelete());

    await act(async () => {
      await result.current.deleteData('test-endpoint', { id: 1 }, 'Delete Data');
    });

    expect(fetch).toHaveBeenCalledWith(mockUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock_access_token',
      },
      body: JSON.stringify({ id: 1 }),
    });

    expect(result.current.error).toBe(errorMsg);
    expect(result.current.loading).toBe(false);
    expect(global.alert).toHaveBeenCalledWith(errorMsg); 
  });

  it('if DELETE request fails due to network error, alert is called with the error message', async () => {
    const errorMsg = 'Delete Data failed: Network Error';
    global.fetch.mockRejectedValueOnce(new Error('Network Error'));

    const { result } = renderHook(() => useDelete());

    await act(async () => {
      await result.current.deleteData('test-endpoint', { id: 1 }, 'Delete Data');
    });

    expect(result.current.error).toBe(errorMsg);
    expect(result.current.loading).toBe(false);
    expect(global.alert).toHaveBeenCalledWith(errorMsg); 
  });
});
