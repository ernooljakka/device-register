import React from 'react';
import { render, screen} from '@testing-library/react';
import Edit_View from "../views/edit_view";
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../components/shared/navigation_bar', () => {
    const MockedNavigationBar = () => <div>Mocked NavigationBar</div>;
    MockedNavigationBar.displayName = 'MockedNavigationBar';
    return MockedNavigationBar;
});


describe('EditView Component', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    //todo: find out how to pass authorization fetch to test in addition to class fetch
    test.skip('renders Navbar and rest of components', () => {
        jest.mock('../components/shared/fetch_data', () => {
            return jest.fn(() => ({
              data: [
                { class_id: '1', class_name: 'Kamera'},
              ],
              loading: false,
              error: null,
            }));
        });

        //needs to be wrapped inside router because it uses useNavigate()
        render(<MemoryRouter>
         <Edit_View />
        </MemoryRouter>);

        expect(screen.getByText('Mocked NavigationBar')).toBeInTheDocument();
        expect(screen.getByText('Edit Device')).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /Device name/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /Device model/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /Device manufacturer/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /Comment/i })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: /Device Class/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });

});
