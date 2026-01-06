import { Session } from 'next-auth';
import { Order, OrderForm, OrderSortBy, OrderSortOrder } from '../../types/types';
import { DEFAULT_BACKEND_URL, PAGE_SIZE } from '../../utils/constants';
import { calculateTotalPages } from '../../utils/utils';
import { getAuthHeadersForFetch } from '../../utils/auth';

export interface FetchOrdersResponse {
  orders: Order[];
  totalPages: number;
}

/**
 * Fetches the list of orders with pagination and sorting.
 * @param session - Next-auth session object
 * @param page - Current page number
 * @param sortBy - Sorting field
 * @param order - Sorting order
 * @returns A promise resolving to the orders and total pages
 */
export const fetchOrders = async (
  session: Session | null,
  page: number,
  sortBy: OrderSortBy,
  order: OrderSortOrder
): Promise<FetchOrdersResponse> => {
  const headers = getAuthHeadersForFetch(session);
  const params = new URLSearchParams({
    offset: String((page - 1) * PAGE_SIZE),
    limit: String(PAGE_SIZE),
    sortBy,
    order,
  });

  const res = await fetch(`${DEFAULT_BACKEND_URL}/orders?${params.toString()}`, {
    method: 'GET',
    headers,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch orders: ${errorText}`);
  }

  const data = await res.json();
  return {
    orders: data.orders,
    totalPages: calculateTotalPages(data.total, PAGE_SIZE),
  };
};

/**
 * Creates a new order.
 * @param session - Next-auth session object
 * @param data - Order form data
 * @returns A promise resolving to the created order
 */
export const createOrder = async (session: Session | null, data: OrderForm): Promise<Order> => {
  const headers = getAuthHeadersForFetch(session);
  const res = await fetch(`${DEFAULT_BACKEND_URL}/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData?.message || 'Failed to create order');
  }
  return res.json();
};

/**
 * Updates an existing order.
 * @param session - Next-auth session object
 * @param id - Order ID
 * @param data - Order form data
 * @returns A promise resolving to the updated order
 */
export const updateOrder = async (session: Session | null, id: string, data: OrderForm): Promise<Order> => {
  const headers = getAuthHeadersForFetch(session);
  const res = await fetch(`${DEFAULT_BACKEND_URL}/orders/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData?.message || 'Failed to update order');
  }
  return res.json();
};

/**
 * Deletes an order by ID.
 * @param session - Next-auth session object
 * @param id - Order ID
 * @returns A promise resolving to void
 */
export const deleteOrder = async (session: Session | null, id: string): Promise<void> => {
  const headers = getAuthHeadersForFetch(session);
  const res = await fetch(`${DEFAULT_BACKEND_URL}/orders/${id}`, { 
    method: 'DELETE',
    headers 
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData?.message || 'Failed to delete order');
  }
};