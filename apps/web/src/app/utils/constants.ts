/** Dialog modes for user operations */
export const USER_DIALOG_MODES = ['add', 'edit'] as const;

/** Sorting options for users */
export const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Created Date' },
  { value: 'id', label: 'ID' },
] as const;

/** Sorting order options */
export const ORDER_OPTIONS = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
] as const;

/** Number of users per page */
export const PAGE_SIZE = 10;

export const DEFAULT_BACKEND_URL = `${process.env.API_URL ?? 'http://localhost:8000'}/api/v1`;
