import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/';
import LinkButton from '../components/shared/link_button';
import { Checkbox } from '@mui/material';


const testHref = "/home";
const testText = "test";
const testIcon = <Checkbox data-testid="checkbox"/>;

describe("LinkButton Component", () => {

  test("Render text correctly", () => {
    
    render(<LinkButton href={testHref} text={testText} />);

    const textLinkButton = screen.getByText(testText);
    expect(textLinkButton).toBeInTheDocument();
    expect(textLinkButton.closest('a')).toHaveAttribute('href', testHref);
  });


  test("Render icon button correctly", () => {

    render(<LinkButton href={testHref} icon={testIcon}/>);

    const iconButton = screen.getByRole('button');
    expect(iconButton.closest('a')).toHaveAttribute('href', testHref);
    
    const checkboxIcon = screen.getByTestId('checkbox'); 
    expect(checkboxIcon).toBeInTheDocument();
  });

});