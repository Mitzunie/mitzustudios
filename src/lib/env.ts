import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    AUTH_SECRET: z.string().min(32),
    ADMIN_EMAILS: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    NOTIFICATION_EMAIL: z.string().email(),
    CLOUDINARY_CLOUD_NAME: z.string().min(1),
    CLOUDINARY_API_KEY: z.string().min(1),
    CLOUDINARY_API_SECRET: z.string().min(1),
    WHATSAPP_PYME_NUMBER: z.string().min(8),
    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60000),
  },
  client: {
    NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
    NEXT_PUBLIC_CONTACT_EMAIL: z.string().optional(),
    NEXT_PUBLIC_SITE_LOGO_URL: z.string().optional(),
  },
  runtimeEnv: process.env as Record<string, string | undefined>,
})
