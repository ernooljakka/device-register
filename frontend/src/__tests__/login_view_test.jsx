import React from 'react';
import { render, screen } from '@testing-library/react';
import Login_View from "../views/login_view";
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../components/shared/navigation_bar', () => {
    const MockedNavigationBar = () => <div>Mocked NavigationBar</div>;
    MockedNavigationBar.displayName = 'MockedNavigationBar';
    return MockedNavigationBar;
});


describe('LoginView Component', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders Navbar and login button correctly', () => {
        //needs to be wrapped inside router because it uses useNavigate()
        render(<MemoryRouter>
         <Login_View />
        </MemoryRouter>);

        expect(screen.getByText('Mocked NavigationBar')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });
});
