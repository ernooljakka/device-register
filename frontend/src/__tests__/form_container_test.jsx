//HTMLFormElement.prototype.requestSubmit = jest.fn();

import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/';
import Form_container from '../components/shared/form_container';
import Function_button from '../components/shared/function_button';




describe('Form_container', () => {
    test('renders children', () => {
      render(<Form_container onSubmit={() => {}}>
                <div>children</div>
            </Form_container>
      );
      expect(screen.getByText('children')).toBeInTheDocument();
    });
  
    test('sx is applied', () => {
      
      render(<Form_container onSubmit={() => {}} sx={{ padding: 5 }}>
                <div>children</div>
            </Form_container>
      );
      expect(screen.getByText('children')).toHaveStyle('padding: 5');
    });
  
    test.skip('onSubmit when clicked', () => {
      const handleSubmit = jest.fn();
      
      render(<Form_container onSubmit={handleSubmit}>
                <Function_button text="Submit" type="input"/>
            </Form_container>
      );
      //Simulates a click
      fireEvent.click(screen.getByText('Submit'));
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });