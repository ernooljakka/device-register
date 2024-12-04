import { renderHook, act } from '@testing-library/react';
import usePatch from '../components/shared/patch_data';

global.fetch = jest.fn();
global.alert = jest.fn(); 

describe('usePatch Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles successful PATCH request', async () => {
    const mockResponseData = { message: 'Success' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponseData,
    });

    const { result } = renderHook(() => usePatch());
    await act(async () => {
      await result.current.patchData('test-endpoint', { name: 'Test Data' }, 'Update Action');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(global.alert).not.toHaveBeenCalled(); 
  });

  it('handles failed PATCH request with server error', async () => {
    const mockErrorData = { error: 'Something went wrong' };
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => mockErrorData,
    });

    const { result } = renderHook(() => usePatch());
    await act(async () => {
      await result.current.patchData('test-endpoint', { name: 'Test Data' }, 'Update Action');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual(mockErrorData);
    expect(global.alert).toHaveBeenCalledWith('Update Action failed: 500 Internal Server Error');
  });

  it('handles network error during PATCH request', async () => {
    fetch.mockRejectedValueOnce(new Error('Network Error'));

    const { result } = renderHook(() => usePatch());
    await act(async () => {
      await result.current.patchData('test-endpoint', { name: 'Test Data' }, 'Update Action');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual(new Error('Network Error'));
    expect(global.alert).toHaveBeenCalledWith('Update Action failed: Network Error');
  });

  it('does not show alert if actionErrorString is not provided', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: async () => ({ error: 'Invalid data' }),
    });

    const { result } = renderHook(() => usePatch());
    await act(async () => {
      await result.current.patchData('test-endpoint', { name: 'Test Data' }, '');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual({ error: 'Invalid data' }); 
  });
});

