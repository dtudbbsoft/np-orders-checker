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
import { useSession } from 'next-auth/react';

import OrderDialog from '../components/orders/OrderDialog';
import OrderList from '../components/orders/OrderList';
import SortControls from '../components/orders/SortControls';
import DeleteOrderDialog from '../components/orders/DeleteOrderDialog';
import { makeSxStyles } from '../styles/styles';
import { Order, OrderForm, OrderDialogMode, OrderSortBy, OrderSortOrder } from '../types/types';
import { orderFormSchema } from '../utils/utils';
import { createOrder, updateOrder, deleteOrder } from '../api/orders/client';

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

const OrdersPageComponent: FC = () => {
  const { data: session } = useSession();
  const [refreshKey, setRefreshKey] = useState(0);
  const [sortBy, setSortBy] = useState<OrderSortBy>('createdAt');
  const [order, setOrder] = useState<OrderSortOrder>('asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<OrderDialogMode>('add');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const form = useForm<OrderForm>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: { externalId: '', name: '', description: '' },
  });

  const openDialog = useCallback(
    (mode: OrderDialogMode, order?: Order) => {
      setDialogMode(mode);
      setDialogOpen(true);
      setFormError(null);
      setFormLoading(false);

      if (mode === 'edit' && order) {
        setSelectedOrder(order);
        form.setValue('externalId', order.externalId);
        form.setValue('name', order.name ?? '');
        form.setValue('description', order.description ?? '');
      } else {
        setSelectedOrder(null);
        form.reset({ externalId: '', name: '', description: '' });
      }
    },
    [form]
  );

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    setSelectedOrder(null);
    setFormError(null);
    setFormLoading(false);
    form.reset();
  }, [form]);

  const onSubmit = async (data: OrderForm): Promise<void> => {
    if (!session) {
      setFormError('No active session');
      return;
    }

    setFormLoading(true);
    setFormError(null);
    try {
      if (dialogMode === 'add') {
        await createOrder(session, data);
      } else if (selectedOrder) {
        await updateOrder(session, selectedOrder.id, data);
      }
      setDialogOpen(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setFormLoading(false);
    }
  };

  const openDeleteDialog = (order: Order) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setOrderToDelete(null);
    setDeleteDialogOpen(false);
  };

  const confirmDelete = async () => {
    if (!orderToDelete || !session) return;

    try {
      await deleteOrder(session, orderToDelete.id);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('[OrdersPage] Delete order error:', err);
      alert((err as Error).message);
    } finally {
      closeDeleteDialog();
    }
  };

  const handleSortChange = (newSortBy: OrderSortBy, newOrder: OrderSortOrder) => {
    setSortBy(newSortBy);
    setOrder(newOrder);
  };

  return (
    <Container maxWidth="lg" sx={styles.container}>
      <Typography variant="h4" component="h1" id="orders-heading" gutterBottom>
        Orders
      </Typography>

      <Box sx={styles.controlsBar}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => openDialog('add')}
          aria-label="Add a new order"
          sx={styles.addButton}
        >
          Add Order
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
          aria-label="Order list pagination"
        />
      </Box>

      <OrderList
        key={`${refreshKey}-${sortBy}-${order}-${page}`}
        sortBy={sortBy}
        order={order}
        page={page}
        onTotalPagesChange={setTotalPages}
        onEdit={(order: Order) => openDialog('edit', order)}
        onDelete={(order: Order) => openDeleteDialog(order)}
      />

      <OrderDialog
        open={dialogOpen}
        mode={dialogMode}
        form={form}
        loading={formLoading}
        error={formError}
        onClose={closeDialog}
        onSubmit={form.handleSubmit(onSubmit)}
      />

      <DeleteOrderDialog
        open={deleteDialogOpen}
        order={orderToDelete}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
      />
    </Container>
  );
};

export default dynamic(() => Promise.resolve(OrdersPageComponent), { ssr: false });