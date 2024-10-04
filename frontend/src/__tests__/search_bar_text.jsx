import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Search_bar from '../components/shared/search_bar';
import '@testing-library/jest-dom';

describe('Search_bar Component', () => {
    let setQuickFilterTextMock;

    beforeEach(() => {
        setQuickFilterTextMock = jest.fn();
    });

    test('renders search bar with initial props', () => {
        render(
            <Search_bar 
                quickFilterText="" 
                setQuickFilterText={setQuickFilterTextMock} 
            />
        );

        const input = screen.getByLabelText(/search/i);
        expect(input).toBeInTheDocument();
        expect(input.value).toBe('');
    });

    test('calls setQuickFilterText on input change', () => {
        render(
            <Search_bar 
                quickFilterText="" 
                setQuickFilterText={setQuickFilterTextMock} 
            />
        );

        const input = screen.getByLabelText(/search/i);
        fireEvent.change(input, { target: { value: 'test' } });

        expect(setQuickFilterTextMock).toHaveBeenCalledTimes(1);
        expect(setQuickFilterTextMock).toHaveBeenCalledWith('test');
    });
});