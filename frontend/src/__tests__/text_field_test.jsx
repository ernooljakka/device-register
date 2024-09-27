import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/';
import Text_field from '../components/shared/text_field';

describe('Text_field', () => {
    test('renders with righ label', () => {
        render(<Text_field label="test-name" />);
        const label = screen.getByLabelText('test-name');
        expect(label).toBeInTheDocument();
    })
    
    test('sets value right', () => {
        render(<Text_field label="test-name" value="test-value" />);
        const value = screen.getByDisplayValue('test-value');
        expect(value).toBeInTheDocument();
    })
})