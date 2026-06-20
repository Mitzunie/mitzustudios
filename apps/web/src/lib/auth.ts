import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { env } from './env'

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error('Unauthorized')
  }

  const adminEmails = env.ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase())
  if (!adminEmails.includes(session.user.email.toLowerCase())) {
    throw new Error('Forbidden')
  }

  return session
}
