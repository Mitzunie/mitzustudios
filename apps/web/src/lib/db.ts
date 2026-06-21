import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export type {
  Project,
  Technology,
  ServiceRequest,
  Response,
  User,
  Account,
  Session,
  VerificationToken,
} from '@prisma/client'

export { ProjectStatus, RequestStatus, ResponseChannel } from '@prisma/client'
