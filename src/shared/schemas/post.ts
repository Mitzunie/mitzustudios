import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string().min(1, 'Título requerido').max(200),
  excerpt: z.string().max(500).optional().or(z.literal('')),
  content: z.string().min(1, 'Contenido requerido'),
  published: z.boolean().default(false),
})

export const updatePostSchema = createPostSchema.partial().extend({
  imageUrl: z.string().url('URL inválida').nullable().optional(),
})

export type CreatePostFormValues = z.infer<typeof createPostSchema>
export type UpdatePostFormValues = z.infer<typeof updatePostSchema>
