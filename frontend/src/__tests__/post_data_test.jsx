import { renderHook, act } from '@testing-library/react';
import usePostData from '../components/shared/post_data';

global.fetch = jest.fn();

describe('usePostData Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('handles successful POST request', async () => {

    const mockResponseData = { message: 'Success' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponseData,
    });

    const { result } = renderHook(() => usePostData('test-endpoint'));
    await act(async () => {
      await result.current.postData({ name: 'Test Data' });
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.result).toEqual(mockResponseData);
    expect(result.current.error).toBe(null);
  });


  it('handles failed POST request', async () => {

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const { result } = renderHook(() => usePostData('test-endpoint'));
    await act(async () => {
      await result.current.postData({ name: 'Test Data' });
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.result).toBe(null);
    expect(result.current.error).toBe('Error: 500 Internal Server Error');
  });


  it('handles network error during POST request', async () => {

    fetch.mockRejectedValueOnce(new Error('Network Error'));

    const { result } = renderHook(() => usePostData('test-endpoint'));
    await act(async () => {
      await result.current.postData({ name: 'Test Data' });
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.result).toBe(null);
    expect(result.current.error).toBe('Network Error');
  });

});
