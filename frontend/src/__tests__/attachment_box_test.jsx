import React from 'react';
import { render, screen } from '@testing-library/react';
import Attachment_box from "../components/device_info/attachment_box";
import '@testing-library/jest-dom';


// Mock the useFetchData hook to control its return values
jest.mock('../components/shared/fetch_data', () => ({
    __esModule: true,
    default: jest.fn(),
}));

import useFetchData from '../components/shared/fetch_data';

describe('Attachment box', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Shows all components expect delete when not in modify view', () => {
        const Id = '1';
        const Modify = false;
        useFetchData.mockReturnValue({ data: {"files": ["/static/attachments/1/image.jpg"],"message": "Files retrieved successfully"}  });

        render(<Attachment_box id={Id} modify={Modify} />);

        expect(screen.getByText('Attachments:')).toBeInTheDocument();
        expect(screen.getByText('image.jpg')).toBeInTheDocument();

        const deleteButtons = screen.queryAllByText('Delete');
        expect(deleteButtons.length).toBe(0);
    });



    test('Shows delete button in modify view', () => {
        const Id = '1';
        const Modify = true;
        useFetchData.mockReturnValue({ data: {"files": ["/static/attachments/1/image.jpg"], "message": "Files retrieved successfully"}  });

        render(<Attachment_box id={Id} modify={Modify} />);
        
        const deleteButtons = screen.queryAllByText('Delete');
        expect(deleteButtons.length).toBe(1);
    });
});
