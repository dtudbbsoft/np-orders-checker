import { z } from 'zod';

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
