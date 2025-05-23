import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const ConfirmDialog = ({ open, title, message, onConfirm, onCancel }) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
    >
      <DialogTitle>{title || 'Confirm'}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message || 'Are you sure you want to proceed?'}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="error">Cancel</Button>
        <Button onClick={onConfirm} sx={{ color: '#FF8C00' }}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;