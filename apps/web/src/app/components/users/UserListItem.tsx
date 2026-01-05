'use client';

import React from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';

import { User } from '../../types/types';
import { formatDate } from '../../utils/utils';
import { makeSxStyles } from '../../styles/styles';

const styles = makeSxStyles({
  paper: {
    mb: 2,
    p: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: '0.875rem',
  },
  priority: {
    fontSize: '0.75rem',
  },
  description: {
    mb: 0.25,
    fontSize: '0.75rem',
  },
  createdAt: {
    fontSize: '0.75rem',
  },
  button: {
    fontSize: '0.75rem',
    padding: '2px 8px',
  },
  boxContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 0.25,
  },
  buttonGroup: {
    display: 'flex',
    gap: 0.25,
  },
});

interface UserListItemProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserListItem: React.FC<UserListItemProps> = ({ user, onEdit, onDelete }) => {
  const formattedDate = formatDate(user.createdAt);

  return (
    <Paper
      sx={styles.paper}
      role="article"
      aria-labelledby={`user-title-${user.id}`}
      aria-describedby={`user-description-${user.id}`}
    >
      <Box>
        <Box sx={styles.boxContainer}>
          <Typography variant="body2" id={`user-title-${user.id}`} sx={styles.title}>
            {user.email}
          </Typography>
        </Box>

        {user.name && (
          <Typography variant="caption" color="textSecondary" id={`user-name-${user.id}`} sx={styles.description}>
            {user.name}
          </Typography>
        )}

        {user.phone && (
          <Typography variant="caption" color="textSecondary" id={`user-phone-${user.id}`} sx={styles.description}>
            {user.phone}
          </Typography>
        )}

        <Box sx={styles.boxContainer}>
          <Typography variant="caption" color="textSecondary" sx={styles.createdAt} suppressHydrationWarning>
            Created: {formattedDate}
          </Typography>
          <Box sx={styles.buttonGroup}>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={() => onEdit(user)}
              aria-label={`Edit user: ${user.email}`}
              sx={styles.button}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => onDelete(user)}
              aria-label={`Delete user: ${user.email}`}
              sx={styles.button}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default UserListItem;