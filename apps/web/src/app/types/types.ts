/** Dialog modes for order operations */
export type OrderDialogMode = 'add' | 'edit';

/** Dialog modes for user operations */
export type UserDialogMode = 'add' | 'edit';

/** Sorting fields for orders */
export type OrderSortBy = 'createdAt' | 'name' | 'status';

/** Sorting order */
export type OrderSortOrder = 'asc' | 'desc';

/** Order interface */
export interface Order {
  id: string;
  externalId: string;
  createdAt: string;
  updatedAt?: string;
  name?: string;
  status?: string;
  description?: string;
}

/** Order form interface */
export interface OrderForm {
  externalId: string;
  name?: string;
  status?: string;
  description?: string;
}

/** User interface */
export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
  name?: string;
  phone?: string;
}

export interface UserForm {
  email: string;
  name?: string;
  phone?: string;
}
