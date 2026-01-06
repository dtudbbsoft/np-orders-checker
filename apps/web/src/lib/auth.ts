import NextAuth, { NextAuthResult } from "next-auth"
import Google from "next-auth/providers/google"
 
const result: NextAuthResult = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      // Pass the access token to the session
      session.accessToken = token.accessToken as string
      return session
    },
    async jwt({ token, account, user }) {
      // Store the OAuth access_token in the JWT token
      if (account) {
        token.accessToken = account.id_token
      }
      return token
    },
  },
})

export const handlers: NextAuthResult['handlers'] = result.handlers;
export const auth: NextAuthResult['auth'] = result.auth;
export const signIn: NextAuthResult['signIn'] = result.signIn;
export const signOut: NextAuthResult['signOut'] = result.signOut;