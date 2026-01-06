'use client'

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react"
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getCurrentUser, updateCurrentUser, deleteCurrentUser } from '../api/users/client';
import { User } from '../types/types';

const profileFormSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { data: session } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { name: '', phone: '' },
  });

  useEffect(() => {
    if (session) {
      loadUserData()
    }
  }, [session])

  const loadUserData = async () => {
    if (!session) return
    
    try {
      setLoading(true)
      const userData = await getCurrentUser(session)
      setUser(userData)
      form.setValue('name', userData.name || '')
      form.setValue('phone', userData.phone || '')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: ProfileForm) => {
    if (!user || !session) return

    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      
      const updatedUser = await updateCurrentUser(session, data)
      setUser(updatedUser)
      setSuccess('Profile updated successfully!')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!session) return
    
    try {
      setDeleting(true)
      await deleteCurrentUser(session)
      
      // Sign out and redirect after successful deletion
      await signOut({ callbackUrl: '/login' })
    } catch (err) {
      setError((err as Error).message)
      setDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  if (loading) {
    return (
      <Container maxWidth="md" className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </Container>
    )
  }

  if (!user) {
    return (
      <Container maxWidth="md">
        <Alert severity="error">Failed to load user data</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Profile
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={form.handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <TextField
            label="Email"
            value={user.email}
            fullWidth
            margin="normal"
            disabled
            helperText="Email cannot be changed"
          />

          <TextField
            label="Name"
            fullWidth
            margin="normal"
            {...form.register('name')}
            error={!!form.formState.errors.name}
            helperText={form.formState.errors.name?.message}
          />

          <TextField
            label="Phone"
            fullWidth
            margin="normal"
            {...form.register('phone')}
            error={!!form.formState.errors.phone}
            helperText={form.formState.errors.phone?.message}
          />

          <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={saving}
              sx={{ minWidth: 120 }}
            >
              {saving ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Account
            </Button>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          Account created: {new Date(user.createdAt).toLocaleDateString()}
        </Typography>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Account
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be undone.
            You will be logged out and all your data will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteAccount} 
            color="error" 
            variant="contained"
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={20} /> : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}