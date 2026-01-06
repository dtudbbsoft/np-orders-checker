import { Session } from "next-auth"

/**
 * Gets the authorization headers with the access token
 */
export function getAuthHeaders(session: Session | null): Record<string, string> {
  if (!session?.accessToken) {
    throw new Error('No access token available')
  }

  return {
    'Authorization': `Bearer ${session.accessToken}`,
    'Content-Type': 'application/json'
  }
}

/**
 * Gets authorization headers for fetch requests
 */
export function getAuthHeadersForFetch(session: Session | null): HeadersInit {
  if (!session?.accessToken) {
    throw new Error('No access token available')
  }

  return {
    'Authorization': `Bearer ${session.accessToken}`,
    'Content-Type': 'application/json'
  }
}