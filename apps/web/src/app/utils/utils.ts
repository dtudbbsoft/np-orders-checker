import { z } from 'zod';

/** Zod schema for order form validation */
export const orderFormSchema = z.object({
  externalId: z.string().min(1, 'Your parcel ID is required'),
  name: z.string().optional(),
  description: z.string().optional(),
});

export type OrderForm = z.infer<typeof orderFormSchema>;

/**
 * Calculate the total number of pages based on the total items and page size.
 *
 * @param totalItems - The total number of items.
 * @param pageSize - The number of items per page.
 * @returns The total number of pages (minimum 1).
 */
export const calculateTotalPages = (totalItems: number, pageSize: number): number => {
  return Math.max(1, Math.ceil(totalItems / pageSize));
};

/**
 * Formats a date string into a human-readable format.
 *
 * @param dateString - The date string to format.
 * @returns The formatted date string.
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};