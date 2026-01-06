'use client'

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useEffect } from "react"
import { Suspense } from 'react'
import OrdersPage from './pages/OrdersPage'
import { useUser } from './contexts/UserContext'

/**
 * HomePage component that handles authentication-based routing.
 * Redirects to login if user is not authenticated, otherwise shows users page.
 */
function AuthenticatedHome() {
  const { data: session, status } = useSession()
  const { user, loading: userLoading, error: userError } = useUser()

  useEffect(() => {
    if (status === 'loading') return // Still loading session
    
    if (!session) {
      redirect('/login')
    }
  }, [session, status])

  if (status === 'loading' || userLoading) {
    return (
      <div 
        role="status" 
        aria-live="polite"
        className="flex items-center justify-center min-h-screen"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          {status === 'loading' ? 'Loading...' : 'Setting up your account...'}
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to login
  }

  if (userError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 mb-4">Failed to load user data</div>
          <div className="text-sm text-gray-600">{userError}</div>
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={
      <div role="status" aria-live="polite" className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          Loading orders...
        </div>
      </div>
    }>
      <OrdersPage />
    </Suspense>
  )
}

/**
 * HomePage component serves as the root page for the application.
 * It handles authentication and renders the appropriate content.
 * 
 * @returns {JSX.Element} The rendered home page component.
 */
export default function HomePage() {
  return <AuthenticatedHome />
}