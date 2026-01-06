'use client';

import React, { useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import { UseFormReturn } from 'react-hook-form';

import { OrderForm, OrderDialogMode } from '../../types/types';

interface OrderDialogProps {
  open: boolean;
  mode: OrderDialogMode;
  form: UseFormReturn<OrderForm>;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: () => void;
}

const styles = {
  formControl: {
    marginTop: 2,
    marginBottom: 2,
  },
  alert: {
    marginTop: 2,
  },
};

const OrderDialog: React.FC<OrderDialogProps> = ({ open, mode, form, loading, error, onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = form;

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="order-dialog-title">
      <DialogTitle id="order-dialog-title">
        {mode === 'add' ? 'Add New Order' : 'Edit Order'}
      </DialogTitle>
      <DialogContent>
        <form id="order-form" onSubmit={handleSubmit(onSubmit)} aria-label="Order form">
          <TextField
            label="Parcel ID"
            fullWidth
            margin="normal"
            {...register('externalId', { required: 'Your parcel ID is required' })}
            error={!!errors.externalId}
            helperText={errors.externalId?.message}
            required
          />
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            multiline
            minRows={2}
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            minRows={2}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
          {error && <Alert severity="error" sx={styles.alert}>{error}</Alert>}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button
          type="submit"
          form="order-form"
          variant="contained"
          color="primary"
          disabled={loading}
          aria-label={mode === 'add' ? 'Submit new order' : 'Save changes'}
        >
          {loading ? <CircularProgress size={20} /> : mode === 'add' ? 'Add' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDialog;