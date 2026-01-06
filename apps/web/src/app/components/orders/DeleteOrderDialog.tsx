import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { Order } from '../../types/types';

interface DeleteOrderDialogProps {
  open: boolean;
  order: Order | null;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * DeleteOrderDialog component for confirming order deletion.
 *
 * @param props - DeleteOrderDialogProps
 * @returns JSX.Element
 */
const DeleteOrderDialog: React.FC<DeleteOrderDialogProps> = ({ open, order, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
      <DialogContent>
        <Typography id="delete-dialog-description">
          Are you sure you want to delete the order{' '}
          <strong>{order?.name || order?.externalId || 'this order'}</strong>? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteOrderDialog;