import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@mitzustudios/db'
import { loginSchema } from '@mitzustudios/shared'
import { loginLimiter } from './rate-limit'

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')
      const isOnLogin = nextUrl.pathname === '/admin/login'

      // Verify the user's email is in ADMIN_EMAILS for admin routes (except login)
      if (isLoggedIn && isOnAdmin && !isOnLogin) {
        const adminEmails =
          process.env.ADMIN_EMAILS?.split(',').map((e) => e.trim().toLowerCase()) || []
        const userEmail = auth?.user?.email?.toLowerCase()
        if (userEmail && !adminEmails.includes(userEmail)) {
          return Response.redirect(new URL('/', nextUrl))
        }
      }

      if (isOnAdmin) {
        if (isOnLogin) {
          if (isLoggedIn) return Response.redirect(new URL('/admin/dashboard', nextUrl))
          return true
        }
        if (!isLoggedIn) return Response.redirect(new URL('/admin/login', nextUrl))
        return true
      }

      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
    },
  },
  providers: [
    Credentials({
      async authorize(credentials, request) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        // Extract real IP from request headers for rate limiting
        const forwardedFor = request?.headers?.get('x-forwarded-for')
        const realIp = request?.headers?.get('x-real-ip')
        const ip = forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown'

        const { allowed } = loginLimiter.check(`login:${ip}:${email}`)
        if (!allowed) return null

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
          select: { id: true, email: true, name: true, password: true },
        })

        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  trustHost: true,
}
