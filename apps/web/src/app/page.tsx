import { JSX, Suspense } from 'react';
import UsersPage from './pages/UsersPage';

/**
 * HomePage component serves as the root page for the application.
 * It renders the UsersPage with proper loading and error handling.
 * 
 * @returns {JSX.Element} The rendered home page component.
 */
export default function HomePage(): JSX.Element {
  return (
    <Suspense fallback={<div role="status" aria-live="polite">Loading users...</div>}>
      <UsersPage />
    </Suspense>
  );
}