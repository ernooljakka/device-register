import { renderHook, waitFor } from '@testing-library/react';
import useFetchData from '../components/shared/fetch_data';
import '@testing-library/jest-dom';

global.fetch = jest.fn();

describe('useFetchData Hook', () => {
  afterEach(() => {
    fetch.mockClear();
  });

  test('return data successfully', async () => {
    const mockData = { name: 'Test User' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useFetchData('test/'));
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test('error in retrieving data', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Failed to fetch',
    });

    const { result } = renderHook(() => useFetchData('test/'));
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual(new Error('Failed to fetch'));
  });
});
