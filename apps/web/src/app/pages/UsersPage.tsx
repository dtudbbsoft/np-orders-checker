'use client';

import React, { useState, useCallback, FC } from 'react';
import dynamic from 'next/dynamic';
import {
  Container,
  Typography,
  Button,
  Box,
  Pagination,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import UserDialog from '../components/users/UserDialog';
import UserList from '../components/users/UserList';
import SortControls from '../components/users/SortControls';
import DeleteUserDialog from '../components/users/DeleteUserDialog';
import { makeSxStyles } from '../styles/styles';
import { User, UserForm, UserDialogMode, UserSortBy, UserSortOrder } from '../types/types';
import { userFormSchema } from '../utils/utils';
import { createUser, updateUser, deleteUser } from '../api/users/client';

const styles = makeSxStyles({
  container: {
    py: 4,
  },
  controlsBar: {
    display: 'flex',
    gap: 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
    mb: 2,
    flexWrap: 'wrap',
  },
  addButton: {
    minWidth: '120px',
    height: '40px',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    mb: 2,
  },
});

const UsersPageComponent: FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [sortBy, setSortBy] = useState<UserSortBy>('createdAt');
  const [order, setOrder] = useState<UserSortOrder>('asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<UserDialogMode>('add');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const form = useForm<UserForm>({
    resolver: zodResolver(userFormSchema),
    defaultValues: { email: '', name: '', phone: '' },
  });

  const openDialog = useCallback(
    (mode: UserDialogMode, user?: User) => {
      setDialogMode(mode);
      setDialogOpen(true);
      setFormError(null);
      setFormLoading(false);

      if (mode === 'edit' && user) {
        setSelectedUser(user);
        form.setValue('email', user.email);
        form.setValue('name', user.name ?? '');
        form.setValue('phone', user.phone ?? '');
      } else {
        setSelectedUser(null);
        form.reset({ email: '', name: '', phone: '' });
      }
    },
    [form]
  );

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    setSelectedUser(null);
    setFormError(null);
    setFormLoading(false);
    form.reset();
  }, [form]);

  const onSubmit = async (data: UserForm): Promise<void> => {
    setFormLoading(true);
    setFormError(null);
    try {
      if (dialogMode === 'add') {
        await createUser(data);
      } else if (selectedUser) {
        await updateUser(selectedUser.id, data);
      }
      setDialogOpen(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setFormLoading(false);
    }
  };

  const openDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setUserToDelete(null);
    setDeleteDialogOpen(false);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete.id);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('[UsersPage] Delete user error:', err);
      alert((err as Error).message);
    } finally {
      closeDeleteDialog();
    }
  };

  const handleSortChange = (newSortBy: UserSortBy, newOrder: UserSortOrder) => {
    setSortBy(newSortBy);
    setOrder(newOrder);
  };

  return (
    <Container maxWidth="lg" sx={styles.container}>
      <Typography variant="h4" component="h1" id="users-heading" gutterBottom>
        Users
      </Typography>

      <Box sx={styles.controlsBar}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => openDialog('add')}
          aria-label="Add a new user"
          sx={styles.addButton}
        >
          Add User
        </Button>
        <SortControls sortBy={sortBy} order={order} onChange={handleSortChange} />
      </Box>

      <Box sx={styles.pagination}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
          shape="rounded"
          showFirstButton
          showLastButton
          aria-label="User list pagination"
        />
      </Box>

      <UserList
        key={`${refreshKey}-${sortBy}-${order}-${page}`}
        sortBy={sortBy}
        order={order}
        page={page}
        onTotalPagesChange={setTotalPages}
        onEdit={(user: User) => openDialog('edit', user)}
        onDelete={(user: User) => openDeleteDialog(user)}
      />

      <UserDialog
        open={dialogOpen}
        mode={dialogMode}
        form={form}
        loading={formLoading}
        error={formError}
        onClose={closeDialog}
        onSubmit={form.handleSubmit(onSubmit)}
      />

      <DeleteUserDialog
        open={deleteDialogOpen}
        user={userToDelete}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
      />
    </Container>
  );
};

export default dynamic(() => Promise.resolve(UsersPageComponent), { ssr: false });