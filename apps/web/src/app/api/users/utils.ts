import { z } from 'zod';
import { UsersApiResponse } from './types';

/**
 * Logs errors for monitoring.
 * @param error - The error to log
 */
export function logError(error: unknown): void {
  console.error('[API /users] Error:', error);
}

/**
 * Backend response validation schema.
 */
export const backendResponseSchema = z.object({
  users: z.array(
    z.object({
      id: z.string(),
      email: z.string(),
      isActive: z.boolean(),
      name: z.string().optional(),
      phone: z.string().optional(),
      createdAt: z.string(),
      updatedAt: z.string().optional(),
    })
  ),
  total: z.number(),
});

/**
 * Query params validation schema.
 */
export const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['createdAt', 'isActive']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Zod schema for creating a user.
 */
export const createUserSchema = z.object({
  email: z.email(),
  name: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
});

/**
 * Fetches users from the backend API.
 * @param params - Query parameters for pagination and sorting
 * @returns UsersApiResponse
 * @throws Error if backend responds with non-OK status or invalid data
 */
export async function fetchUsersFromBackend(params: z.infer<typeof querySchema>): Promise<UsersApiResponse> {
  const url = new URL('api/v1/users', process.env.API_URL ?? 'http://localhost:8000');
  url.searchParams.set('page', String(params.page));
  url.searchParams.set('pageSize', String(params.pageSize));
  url.searchParams.set('sortBy', params.sortBy);
  url.searchParams.set('order', params.order);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorText = await response.text();
    logError(`[API /users] Backend error: ${response.status} ${response.statusText} - ${errorText}`);
    throw new Error(`Backend responded with status ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const parsed = backendResponseSchema.safeParse(data);
  if (!parsed.success) {
    logError(parsed.error);
    throw new Error('Invalid backend response format');
  }
  return parsed.data;
}