'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { List } from '@mui/material';

import UserListItem from './UserListItem';
import { User, UserSortBy, UserSortOrder } from '../../types/types';
import { fetchUsers } from '../../api/users/client';

/**
 * Props for UserList component.
 */
interface UserListProps {
  sortBy: UserSortBy;
  order: UserSortOrder;
  page: number;
  onTotalPagesChange: (totalPages: number) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

/**
 * UserList component displays a paginated, sortable list of users.
 *
 * @param props - UserListProps
 * @returns JSX.Element
 */
const UserList: React.FC<UserListProps> = ({
  sortBy,
  order,
  page,
  onTotalPagesChange,
  onEdit,
  onDelete,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const { users, totalPages } = await fetchUsers(page, sortBy, order);
      setUsers(users);
      onTotalPagesChange(totalPages);
    } catch (err) {
      console.error('[UserList] fetchUsers error:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, order, onTotalPagesChange]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const renderedUsers = useMemo(
    () =>
      users.map((user) => (
        <UserListItem key={user.id} user={user} onEdit={onEdit} onDelete={onDelete} />
      )),
    [users, onEdit, onDelete]
  );

  if (loading) {
    return <div role="status" aria-live="polite">Loading users...</div>;
  }

  if (error) {
    return <div role="alert" aria-live="assertive">Error: {error}</div>;
  }

  return (
    <List aria-live="polite" aria-label="User list">
      {renderedUsers}
    </List>
  );
};

export default UserList;