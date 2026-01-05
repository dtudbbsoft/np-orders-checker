/** Dialog modes for user operations */
export type UserDialogMode = 'add' | 'edit';

/** Sorting fields for users */
export type UserSortBy = 'createdAt' | 'email';

/** Sorting order */
export type UserSortOrder = 'asc' | 'desc';

/** User interface */
export interface User {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  name?: string;
  phone?: string;
}

/** User form interface */
export interface UserForm {
  email: string;
  name?: string;
  phone?: string;
}
