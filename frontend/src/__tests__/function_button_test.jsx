import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/';
import Function_button from '../components/shared/function_button';

describe('Text_field', () => {
    test('renders with correct text', () => {
        render(<Function-button text="test-text" onClick={() => {}} />);
        const button = screen.getByRole('button');
        expect(button).toHaveTextContent('test-text');
    })
    
    test('onclick works when clicked', () => {
        const handleClick = jest.fn();
        render(<Function_button text='test-text' onClick={handleClick} />);
        const button = screen.getByRole('button');

        //Simulates a click
        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    })
})