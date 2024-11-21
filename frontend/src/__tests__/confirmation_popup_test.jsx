import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ConfirmationPopup from '../components/device_manager/confirmation_popup';
import '@testing-library/jest-dom'; 

describe('ConfirmationPopup', () => {
  let onConfirmMock;

  beforeEach(() => {
    onConfirmMock = jest.fn();
  });


  test('renders button and opens dialog on click', async () => {
    render(
      <ConfirmationPopup
        renderTrigger={({ onClick }) => <button onClick={onClick}>Delete</button>}
        onConfirm={onConfirmMock}
        dialogTitle="Confirm Deletion"
        dialogText="Are you sure you want to delete this device?"
      />
    );

    const triggerButton = screen.getByText(/delete/i);
    expect(triggerButton).toBeInTheDocument();

    fireEvent.click(triggerButton);

    await waitFor(() => {
      const dialogTitle = screen.getByText(/confirm deletion/i);
      const dialogText = screen.getByText(/are you sure you want to delete this device/i);
      expect(dialogTitle).toBeInTheDocument();
      expect(dialogText).toBeInTheDocument();
    });
  });


  test('calls onConfirm and closes dialog on "Yes" button click', async () => {
    render(
      <ConfirmationPopup
        renderTrigger={({ onClick }) => <button onClick={onClick}>Delete</button>}
        onConfirm={onConfirmMock}
        dialogTitle="Confirm Deletion"
        dialogText="Are you sure you want to delete this device?"
      />
    );

    const triggerButton = screen.getByText(/delete/i);
    fireEvent.click(triggerButton);

    const confirmButton = screen.getByText(/yes/i);
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(onConfirmMock).toHaveBeenCalledTimes(1);
    });
  });


  test('closes dialog without calling onConfirm on "No" button click', async () => {
    render(
      <ConfirmationPopup
        renderTrigger={({ onClick }) => <button onClick={onClick}>Delete</button>}
        onConfirm={onConfirmMock}
        dialogTitle="Confirm Deletion"
        dialogText="Are you sure you want to delete this device?"
      />
    );

    const triggerButton = screen.getByText(/delete/i);
    fireEvent.click(triggerButton);

    const noButton = screen.getByText(/no/i);
    fireEvent.click(noButton);

    await waitFor(() => {
      expect(onConfirmMock).not.toHaveBeenCalled();
    });
  });


  test('renders dialog title and text correctly', () => {
    render(
      <ConfirmationPopup
        renderTrigger={({ onClick }) => <button onClick={onClick}>Delete</button>}
        onConfirm={onConfirmMock}
        dialogTitle="Are you sure?"
        dialogText="This action cannot be undone."
      />
    );

    fireEvent.click(screen.getByText(/delete/i));

    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
  });

});
