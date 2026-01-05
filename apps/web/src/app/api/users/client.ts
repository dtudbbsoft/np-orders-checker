import { User, UserForm, UserSortBy, UserSortOrder } from '../../types/types';
import { DEFAULT_BACKEND_URL, PAGE_SIZE } from '../../utils/constants';
import { calculateTotalPages } from '../../utils/utils';

export interface FetchUsersResponse {
  users: User[];
  totalPages: number;
}

/**
 * Fetches the list of users with pagination and sorting.
 * @param page - Current page number
 * @param sortBy - Sorting field
 * @param order - Sorting order
 * @returns A promise resolving to the users and total pages
 */
export const fetchUsers = async (
  page: number,
  sortBy: UserSortBy,
  order: UserSortOrder
): Promise<FetchUsersResponse> => {
  const params = new URLSearchParams({
    offset: String((page - 1) * PAGE_SIZE),
    limit: String(PAGE_SIZE),
    sortBy,
    order,
  });

  const res = await fetch(`${DEFAULT_BACKEND_URL}/users?${params.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch users: ${errorText}`);
  }

  const data = await res.json();
  return {
    users: data.users,
    totalPages: calculateTotalPages(data.total, PAGE_SIZE),
  };
};

/**
 * Creates a new user.
 * @param data - User form data
 * @returns A promise resolving to the created user
 */
export const createUser = async (data: UserForm): Promise<User> => {
  const res = await fetch(`${DEFAULT_BACKEND_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData?.message || 'Failed to create user');
  }
  return res.json();
};

/**
 * Updates an existing user.
 * @param id - User ID
 * @param data - User form data
 * @returns A promise resolving to the updated user
 */
export const updateUser = async (id: string, data: UserForm): Promise<User> => {
  const res = await fetch(`${DEFAULT_BACKEND_URL}/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData?.message || 'Failed to update user');
  }
  return res.json();
};

/**
 * Deletes a user by ID.
 * @param id - User ID
 * @returns A promise resolving to void
 */
export const deleteUser = async (id: string): Promise<void> => {
  const res = await fetch(`${DEFAULT_BACKEND_URL}/users/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData?.message || 'Failed to delete user');
  }
};
