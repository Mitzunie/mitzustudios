import { z } from 'zod'

export const technologySchema = z.object({
  name: z.string().min(1, 'Nombre requerido').max(50),
  icon: z.string().max(50).optional().or(z.literal('')),
  url: z.string().url('URL inválida').optional().or(z.literal('')),
})

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Título requerido').max(200),
  description: z.string().min(1, 'Descripción requerida').max(5000),
  technologies: z.array(technologySchema).min(1, 'Al menos 1 tecnología'),
  status: z.enum(['PUBLISHED', 'HIDDEN', 'DRAFT']).default('DRAFT'),
})

export const updateProjectSchema = createProjectSchema.partial().extend({
  imageUrl: z.string().url('URL inválida').nullable().optional(),
})

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>
export type UpdateProjectFormValues = z.infer<typeof updateProjectSchema>
