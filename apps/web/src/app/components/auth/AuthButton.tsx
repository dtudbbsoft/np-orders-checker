'use client'

import { signIn, signOut } from "next-auth/react"
import { Button } from "@mui/material"
import { useSession } from "next-auth/react"

export function SignInButton() {
  return (
    <Button 
      onClick={() => signIn('google')}
      variant="contained"
      color="primary"
    >
      Sign in with Google
    </Button>
  )
}

export function SignOutButton() {
  return (
    <Button 
      onClick={() => signOut()}
      variant="outlined"
      color="secondary"
    >
      Sign out
    </Button>
  )
}

export function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <Button disabled>Loading...</Button>
  }

  if (session) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span>Signed in as {session.user?.email}</span>
        <SignOutButton />
      </div>
    )
  }

  return <SignInButton />
}