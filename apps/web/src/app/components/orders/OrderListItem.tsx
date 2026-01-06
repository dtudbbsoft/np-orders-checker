'use client';

import React from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';

import { Order } from '../../types/types';
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

interface OrderListItemProps {
  order: Order;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
}

const OrderListItem: React.FC<OrderListItemProps> = ({ order, onEdit, onDelete }) => {
  const formattedDate = formatDate(order.createdAt);

  return (
    <Paper
      sx={styles.paper}
      role="article"
      aria-labelledby={`order-title-${order.id}`}
      aria-describedby={`order-description-${order.id}`}
    >
      <Box>
        <Box sx={styles.boxContainer}>
          <Typography variant="body2" id={`order-title-${order.id}`} sx={styles.title}>
            {order.externalId}
          </Typography>
        </Box>

        {order.name && (
          <Typography variant="caption" color="textSecondary" id={`order-name-${order.id}`} sx={styles.description}>
            {order.name}
          </Typography>
        )}

        {order.description && (
          <Typography variant="caption" color="textSecondary" id={`order-description-${order.id}`} sx={styles.description}>
            {order.description}
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
              onClick={() => onEdit(order)}
              aria-label={`Edit order: ${order.name || order.externalId}`}
              sx={styles.button}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => onDelete(order)}
              aria-label={`Delete order: ${order.name || order.externalId}`}
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

export default OrderListItem;