import { describe, it, expect } from 'vitest'
import {
  technologySchema,
  createProjectSchema,
  updateProjectSchema,
} from '../../schemas/project'

describe('technologySchema', () => {
  it('acepta tecnología válida con url', () => {
    const result = technologySchema.safeParse({
      name: 'Next.js',
      icon: 'nextjs',
      url: 'https://nextjs.org',
    })
    expect(result.success).toBe(true)
  })

  it('acepta tecnología válida sin url', () => {
    const result = technologySchema.safeParse({
      name: 'React',
      icon: 'react',
    })
    expect(result.success).toBe(true)
  })

  it('acepta tecnología con url vacía (string vacío)', () => {
    const result = technologySchema.safeParse({
      name: 'React',
      icon: 'react',
      url: '',
    })
    expect(result.success).toBe(true)
  })

  it('rechaza tecnología sin nombre', () => {
    const result = technologySchema.safeParse({
      name: '',
      icon: 'react',
    })
    expect(result.success).toBe(false)
  })

  it('rechaza tecnología sin icono', () => {
    const result = technologySchema.safeParse({
      name: 'React',
      icon: '',
    })
    expect(result.success).toBe(false)
  })

  it('rechaza nombre con más de 50 caracteres', () => {
    const result = technologySchema.safeParse({
      name: 'A'.repeat(51),
      icon: 'react',
    })
    expect(result.success).toBe(false)
  })

  it('rechaza url inválida', () => {
    const result = technologySchema.safeParse({
      name: 'React',
      icon: 'react',
      url: 'not-a-url',
    })
    expect(result.success).toBe(false)
  })
})

describe('createProjectSchema', () => {
  const validData = {
    title: 'Mi Proyecto',
    description: 'Una descripción completa del proyecto para mostrar',
    technologies: [
      { name: 'Next.js', icon: 'nextjs', url: 'https://nextjs.org' },
      { name: 'React', icon: 'react' },
    ],
  }

  it('acepta proyecto válido', () => {
    const result = createProjectSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('establece status por defecto como DRAFT (RN-09)', () => {
    const result = createProjectSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.status).toBe('DRAFT')
    }
  })

  it('acepta status explícito', () => {
    const result = createProjectSchema.safeParse({
      ...validData,
      status: 'PUBLISHED',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.status).toBe('PUBLISHED')
    }
  })

  it('rechaza status inválido', () => {
    const result = createProjectSchema.safeParse({
      ...validData,
      status: 'INVALID',
    })
    expect(result.success).toBe(false)
  })

  it('rechaza título vacío', () => {
    const result = createProjectSchema.safeParse({ ...validData, title: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.title).toContain('Título requerido')
    }
  })

  it('rechaza título con más de 200 caracteres', () => {
    const result = createProjectSchema.safeParse({
      ...validData,
      title: 'A'.repeat(201),
    })
    expect(result.success).toBe(false)
  })

  it('rechaza descripción vacía', () => {
    const result = createProjectSchema.safeParse({ ...validData, description: '' })
    expect(result.success).toBe(false)
  })

  it('rechaza descripción con más de 5000 caracteres', () => {
    const result = createProjectSchema.safeParse({
      ...validData,
      description: 'A'.repeat(5001),
    })
    expect(result.success).toBe(false)
  })

  it('rechaza tecnologías vacías', () => {
    const result = createProjectSchema.safeParse({
      ...validData,
      technologies: [],
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.technologies).toContain('Al menos 1 tecnología')
    }
  })

  it('rechaza formulario vacío', () => {
    const result = createProjectSchema.safeParse({})
    expect(result.success).toBe(false)
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      expect(fieldErrors.title).toBeDefined()
      expect(fieldErrors.description).toBeDefined()
      expect(fieldErrors.technologies).toBeDefined()
    }
  })
})

describe('updateProjectSchema', () => {
  it('acepta actualización parcial (solo título)', () => {
    const result = updateProjectSchema.safeParse({ title: 'Nuevo Título' })
    expect(result.success).toBe(true)
  })

  it('acepta actualización parcial (solo status)', () => {
    const result = updateProjectSchema.safeParse({ status: 'PUBLISHED' })
    expect(result.success).toBe(true)
  })

  it('acepta actualización con imageUrl', () => {
    const result = updateProjectSchema.safeParse({
      title: 'Proyecto Editado',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/test.jpg',
    })
    expect(result.success).toBe(true)
  })

  it('acepta imageUrl como null (eliminar imagen)', () => {
    const result = updateProjectSchema.safeParse({
      imageUrl: null,
    })
    expect(result.success).toBe(true)
  })

  it('rechaza imageUrl inválida', () => {
    const result = updateProjectSchema.safeParse({
      imageUrl: 'no-es-una-url',
    })
    expect(result.success).toBe(false)
  })

  it('acepta objeto vacío (sin cambios)', () => {
    const result = updateProjectSchema.safeParse({})
    expect(result.success).toBe(true)
  })
})
