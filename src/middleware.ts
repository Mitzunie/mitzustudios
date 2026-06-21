import NextAuth from 'next-auth'
import { authMiddlewareConfig } from '@/lib/auth.middleware.config'

export default NextAuth(authMiddlewareConfig).auth

export const config = {
  matcher: ['/admin/:path*'],
}
