'use client'

import { useSession, signIn } from "next-auth/react"
import { redirect } from "next/navigation"
import { useEffect } from "react"
import { Button, Container, Typography, Box, Paper } from "@mui/material"

/**
 * Login page component that handles user authentication.
 * Redirects to home page if user is already authenticated.
 */
export default function LoginPage() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'loading') return // Still loading
    
    if (session) {
      redirect('/')
    }
  }, [session, status])

  if (status === 'loading') {
    return (
      <Container maxWidth="sm" className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          Loading...
        </div>
      </Container>
    )
  }

  if (session) {
    return null // Will redirect to home
  }

  return (
    <Container maxWidth="sm" className="flex items-center justify-center min-h-screen">
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 4, 
          textAlign: 'center', 
          borderRadius: 2,
          width: '100%' 
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom color="primary">
            Welcome to NP Orders Checker
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Please sign in to access your user management dashboard
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => signIn('google')}
            sx={{ 
              mt: 2,
              py: 1.5,
              px: 4,
              fontSize: '1.1rem',
              textTransform: 'none'
            }}
            fullWidth
          >
            Sign in with Google
          </Button>

          <Typography variant="caption" display="block" sx={{ mt: 3 }} color="text.secondary">
            Secure authentication powered by Google OAuth
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}