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

import { UserForm, UserDialogMode } from '../../types/types';

interface UserDialogProps {
  open: boolean;
  mode: UserDialogMode;
  form: UseFormReturn<UserForm>;
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

const UserDialog: React.FC<UserDialogProps> = ({ open, mode, form, loading, error, onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = form;

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="user-dialog-title">
      <DialogTitle id="user-dialog-title">
        {mode === 'add' ? 'Add New User' : 'Edit User'}
      </DialogTitle>
      <DialogContent>
        <form id="user-form" onSubmit={handleSubmit(onSubmit)} aria-label="User form">
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
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
            label="Phone"
            fullWidth
            margin="normal"
            multiline
            minRows={2}
            {...register('phone')}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />
          {error && <Alert severity="error" sx={styles.alert}>{error}</Alert>}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button
          type="submit"
          form="user-form"
          variant="contained"
          color="primary"
          disabled={loading}
          aria-label={mode === 'add' ? 'Submit new user' : 'Save changes'}
        >
          {loading ? <CircularProgress size={20} /> : mode === 'add' ? 'Add' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDialog;