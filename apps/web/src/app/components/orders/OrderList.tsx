'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { List } from '@mui/material';
import { useSession } from 'next-auth/react';

import OrderListItem from './OrderListItem';
import { Order, OrderSortBy, OrderSortOrder } from '../../types/types';
import { fetchOrders } from '../../api/orders/client';

/**
 * Props for OrderList component.
 */
interface OrderListProps {
  sortBy: OrderSortBy;
  order: OrderSortOrder;
  page: number;
  onTotalPagesChange: (totalPages: number) => void;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
}

/**
 * OrderList component displays a paginated, sortable list of orders.
 *
 * @param props - OrderListProps
 * @returns JSX.Element
 */
const OrderList: React.FC<OrderListProps> = ({
  sortBy,
  order,
  page,
  onTotalPagesChange,
  onEdit,
  onDelete,
}) => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async (): Promise<void> => {
    if (!session) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { orders, totalPages } = await fetchOrders(session, page, sortBy, order);
      setOrders(orders);
      onTotalPagesChange(totalPages);
    } catch (err) {
      console.error('[OrderList] fetchOrders error:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [session, page, sortBy, order, onTotalPagesChange]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const renderedOrders = useMemo(
    () =>
      orders.map((order) => (
        <OrderListItem key={order.id} order={order} onEdit={onEdit} onDelete={onDelete} />
      )),
    [orders, onEdit, onDelete]
  );

  if (loading) {
    return <div role="status" aria-live="polite">Loading orders...</div>;
  }

  if (error) {
    return <div role="alert" aria-live="assertive">Error: {error}</div>;
  }

  return (
    <List aria-live="polite" aria-label="Order list">
      {renderedOrders}
    </List>
  );
};

export default OrderList;