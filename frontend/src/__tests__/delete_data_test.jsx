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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('if DELETE request gets succesful response, loading is set false and errors null', async () => {
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
  });
});