import { Session } from 'next-auth';
import { User, UserForm } from '../../types/types';
import { DEFAULT_BACKEND_URL } from '../../utils/constants';
import { getAuthHeadersForFetch } from '../../utils/auth';

export interface FetchUsersResponse {
  users: User[];
  totalPages: number;
}

/**
 * Gets the current user profile
 * @param session - Next-auth session object
 * @returns A promise resolving to the current user
 */
export const getCurrentUser = async (session: Session | null): Promise<User> => {
  const headers = getAuthHeadersForFetch(session);
  const res = await fetch(`${DEFAULT_BACKEND_URL}/users/me`, {
    method: 'GET',
    headers,
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData?.message || 'Failed to fetch current user');
  }
  return res.json();
};

/**
 * Creates a new user.
 * @param session - Next-auth session object
 * @param data - User form data
 * @returns A promise resolving to the created user
 */
export const createUser = async (session: Session | null, data: UserForm): Promise<User> => {
  const headers = getAuthHeadersForFetch(session);
  const res = await fetch(`${DEFAULT_BACKEND_URL}/users`, {
    method: 'POST',
    headers,
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
 * @param session - Next-auth session object
 * @param id - User ID
 * @param data - User form data
 * @returns A promise resolving to the updated user
 */
export const updateUser = async (session: Session | null, id: string, data: UserForm): Promise<User> => {
  const headers = getAuthHeadersForFetch(session);
  const res = await fetch(`${DEFAULT_BACKEND_URL}/users/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData?.message || 'Failed to update user');
  }
  return res.json();
};

/**
 * Updates the current user's profile.
 * @param session - Next-auth session object
 * @param data - User form data (excluding email)
 * @returns A promise resolving to the updated user
 */
export const updateCurrentUser = async (session: Session | null, data: Omit<UserForm, 'email'>): Promise<User> => {
  const headers = getAuthHeadersForFetch(session);
  const res = await fetch(`${DEFAULT_BACKEND_URL}/users/me`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData?.message || 'Failed to update profile');
  }
  return res.json();
};

/**
 * Deletes a user by ID.
 * @param session - Next-auth session object
 * @param id - User ID
 * @returns A promise resolving to void
 */
export const deleteUser = async (session: Session | null, id: string): Promise<void> => {
  const headers = getAuthHeadersForFetch(session);
  const res = await fetch(`${DEFAULT_BACKEND_URL}/users/${id}`, { 
    method: 'DELETE',
    headers 
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData?.message || 'Failed to delete user');
  }
};

/**
 * Deletes the current user's account.
 * @param session - Next-auth session object
 * @returns A promise resolving to void
 */
export const deleteCurrentUser = async (session: Session | null): Promise<void> => {
  const headers = getAuthHeadersForFetch(session);
  const res = await fetch(`${DEFAULT_BACKEND_URL}/users/me`, { 
    method: 'DELETE',
    headers 
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData?.message || 'Failed to delete account');
  }
};
