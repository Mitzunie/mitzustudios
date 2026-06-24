import type { NextAuthConfig } from 'next-auth'

export const authMiddlewareConfig: NextAuthConfig = {
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')
      const isOnLogin = nextUrl.pathname === '/admin/login'

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
      if (token.email) {
        const adminEmails =
          process.env.ADMIN_EMAILS?.split(',').map((e) => e.trim().toLowerCase()) || []
        token.role = adminEmails.includes(token.email.toLowerCase()) ? 'admin' : undefined
      }
      return token
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.role = token.role as string | undefined
      }
      return session
    },
  },
  providers: [],
  session: {
    strategy: 'jwt',
  },
  trustHost: true,
}
