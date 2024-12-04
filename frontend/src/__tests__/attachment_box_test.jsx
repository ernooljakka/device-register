import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Attachment_box from '../components/device_info/attachment_box';
import useFetchData from '../components/shared/fetch_data';
import useDelete from '../components/shared/delete_data';
import { config } from '../utils/config';

jest.mock('../components/shared/fetch_data');
jest.mock('../components/shared/delete_data');
// TODO mock popup properly to test deleting things

describe('Attachment_box', () => {
  const mockFetchData = useFetchData;
  const mockDelete = useDelete;

  const mockAttachments = {
    files: [
      `${config.BACKEND_ADDR}/uploads/file1.pdf`,
      `${config.BACKEND_ADDR}/uploads/file2.png`,
    ],
  };

  beforeEach(() => {
    mockFetchData.mockReturnValue({ data: mockAttachments });
    mockDelete.mockReturnValue({ deleteData: jest.fn() });
  });

  it('renders the component without attachments', () => {
    mockFetchData.mockReturnValue({ data: { files: [] } });

    render(<Attachment_box id="123" modify={false} />);
    expect(screen.getByText(/attachments:/i)).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders the component with attachments', () => {
    render(<Attachment_box id="123" modify={false} />);

    expect(screen.getByText(/attachments:/i)).toBeInTheDocument();
    expect(screen.getByText('file1.pdf')).toBeInTheDocument();
    expect(screen.getByText('file2.png')).toBeInTheDocument();
  });

  it('shows delete button when modify is true', () => {
    render(<Attachment_box id="123" modify={true} />);
    const deleteButtons = screen.getAllByLabelText(/delete/i);
    expect(deleteButtons).toHaveLength(2);
  });

  it.skip('triggers the delete confirmation popup and calls deleteData', async () => {
    const { deleteData } = mockDelete();

    render(<Attachment_box id="123" modify={true} />);
    const deleteButtons = screen.getAllByLabelText(/delete/i);

    fireEvent.click(deleteButtons[0]);

    const confirmButtons = screen.getAllByText('Confirm');
    fireEvent.click(confirmButtons[0]);

    await waitFor(() => expect(deleteData).toHaveBeenCalled());
  });

  it.skip('uploads a file', async () => {
    const postFormDataMock = jest.fn();
    mockFetchData.mockReturnValue({
      data: mockAttachments,
      postFormData: postFormDataMock,
    });

    render(<Attachment_box id="123" modify={true} />);

    const fileInput = screen.getByLabelText("file_input");
    const uploadButton = screen.getByRole('button', { name: /upload/i });

    expect(uploadButton).toBeDisabled();

    const file = new File(['file content'], 'example.txt', { type: 'text/plain' }); // eslint-disable-line no-undef
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(uploadButton).toBeEnabled();

    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(postFormDataMock).toHaveBeenCalledWith(
        'attachments/upload/123',
        expect.any(FormData)
      );
    });
  });
});
