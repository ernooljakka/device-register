import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Function_button from '../shared/function_button';

export default function ConfirmationPopup({ renderTrigger, onConfirm, dialogTitle, dialogText }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <>
      {renderTrigger({ onClick: handleClickOpen })}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ textAlign: 'center' }}>
          {dialogTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ textAlign: 'center' }}
          >
            {dialogText}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Function_button
            onClick={handleConfirm}
            autoFocus
            size="medium"
            text="Yes"
            color="error"
          />
          <Function_button onClick={handleClose} size="medium" text="No" />
        </DialogActions>
      </Dialog>
    </>
  );
}

ConfirmationPopup.propTypes = {
  renderTrigger: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  dialogTitle: PropTypes.string.isRequired,
  dialogText: PropTypes.string
};
