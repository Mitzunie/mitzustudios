import { z } from 'zod'

export const PROJECT_TYPES = ['landing', 'ecommerce', 'webapp', 'api', 'redesign', 'other'] as const

export const PROJECT_TYPE_LABELS: Record<string, string> = {
  landing: 'Landing Page',
  ecommerce: 'Tienda / E-commerce',
  webapp: 'Web App / Aplicación Web',
  api: 'API / Backend',
  redesign: 'Rediseño / Mantenimiento',
  other: 'Otro',
}

export const contactSchema = z
  .object({
    clientName: z.string().min(1, 'El nombre es requerido').max(100),
    clientEmail: z.string().email('Email inválido'),
    clientPhone: z.string().min(7, 'Teléfono inválido').max(20, 'Teléfono inválido'),
    projectType: z.enum(PROJECT_TYPES, {
      errorMap: () => ({ message: 'Selecciona un tipo de proyecto' }),
    }),
    otherType: z.string().optional(),
    description: z
      .string()
      .min(10, 'Describe tu proyecto (mín. 10 caracteres)')
      .max(2000, 'Máximo 2000 caracteres'),
  })
  .refine((data) => data.projectType !== 'other' || (data.otherType && data.otherType.length > 0), {
    message: 'Describe el tipo de proyecto',
    path: ['otherType'],
  })

export type ContactFormValues = z.infer<typeof contactSchema>
