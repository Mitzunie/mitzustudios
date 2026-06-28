import { describe, it, expect } from 'vitest'
import { contactFormSchema, contactSchema, PROJECT_TYPES, PROJECT_TYPE_LABELS } from '../../schemas/contact'

describe('contactFormSchema', () => {
  const validData = {
    clientName: 'Juan Pérez',
    clientEmail: 'juan@example.com',
    clientPhone: '+56912345678',
    projectType: 'landing',
    description: 'Necesito una landing page para mi negocio de repostería.',
  }

  describe('campos requeridos', () => {
    it('acepta datos válidos completos', () => {
      const result = contactFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('rechaza clientName vacío', () => {
      const result = contactFormSchema.safeParse({ ...validData, clientName: '' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.clientName).toBeDefined()
      }
    })

    it('rechaza clientName con más de 100 caracteres', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        clientName: 'A'.repeat(101),
      })
      expect(result.success).toBe(false)
    })

    it('rechaza clientEmail inválido', () => {
      const result = contactFormSchema.safeParse({ ...validData, clientEmail: 'no-es-email' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.clientEmail).toContain('Email inválido')
      }
    })

    it('rechaza clientEmail vacío', () => {
      const result = contactFormSchema.safeParse({ ...validData, clientEmail: '' })
      expect(result.success).toBe(false)
    })

    it('rechaza clientPhone con menos de 7 caracteres', () => {
      const result = contactFormSchema.safeParse({ ...validData, clientPhone: '123' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.clientPhone).toBeDefined()
      }
    })

    it('rechaza clientPhone con más de 20 caracteres', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        clientPhone: '5'.repeat(21),
      })
      expect(result.success).toBe(false)
    })

    it('rechaza projectType inválido', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        projectType: 'invalid-type',
      })
      expect(result.success).toBe(false)
    })

    it('rechaza description con menos de 10 caracteres', () => {
      const result = contactFormSchema.safeParse({ ...validData, description: 'Corto' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.description).toContain(
          'Describe tu proyecto (mín. 10 caracteres)',
        )
      }
    })

    it('rechaza description con más de 2000 caracteres', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        description: 'X'.repeat(2001),
      })
      expect(result.success).toBe(false)
    })
  })

  describe('projectType = "other"', () => {
    it('requiere otherType cuando projectType es "other"', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        projectType: 'other',
        otherType: undefined,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.otherType).toBeDefined()
      }
    })

    it('acepta otherType cuando projectType es "other" y otherType tiene valor', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        projectType: 'other',
        otherType: 'Una aplicación de realidad aumentada',
      })
      expect(result.success).toBe(true)
    })

    it('rechaza otherType vacío cuando projectType es "other"', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        projectType: 'other',
        otherType: '',
      })
      expect(result.success).toBe(false)
    })

    it('acepta campos opcionales correctamente cuando projectType no es "other"', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        projectType: 'ecommerce',
        otherType: undefined,
      })
      expect(result.success).toBe(true)
    })
  })

  describe('project types constants', () => {
    it('PROJECT_TYPES tiene 6 opciones', () => {
      expect(PROJECT_TYPES).toHaveLength(6)
      expect(PROJECT_TYPES).toContain('landing')
      expect(PROJECT_TYPES).toContain('ecommerce')
      expect(PROJECT_TYPES).toContain('webapp')
      expect(PROJECT_TYPES).toContain('api')
      expect(PROJECT_TYPES).toContain('redesign')
      expect(PROJECT_TYPES).toContain('other')
    })

    it('PROJECT_TYPE_LABELS tiene labels para todos los tipos', () => {
      for (const type of PROJECT_TYPES) {
        expect(PROJECT_TYPE_LABELS[type]).toBeDefined()
        expect(typeof PROJECT_TYPE_LABELS[type]).toBe('string')
      }
    })
  })

  describe('CB-01: errores específicos por campo', () => {
    it('devuelve fieldErrors con mensajes específicos', () => {
      const result = contactFormSchema.safeParse({
        clientName: '',
        clientEmail: 'invalido',
        clientPhone: '12',
        projectType: 'invalid',
        description: 'x',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors
        expect(fieldErrors.clientName).toBeDefined()
        expect(fieldErrors.clientEmail).toBeDefined()
        expect(fieldErrors.clientPhone).toBeDefined()
        expect(fieldErrors.projectType).toBeDefined()
        expect(fieldErrors.description).toBeDefined()
      }
    })
  })

  describe('CB-02: formulario vacío', () => {
    it('rechaza objeto vacío con errores en todos los campos requeridos', () => {
      const result = contactFormSchema.safeParse({})
      expect(result.success).toBe(false)
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors
        expect(fieldErrors.clientName).toBeDefined()
        expect(fieldErrors.clientEmail).toBeDefined()
        expect(fieldErrors.clientPhone).toBeDefined()
        expect(fieldErrors.projectType).toBeDefined()
        expect(fieldErrors.description).toBeDefined()
      }
    })
  })
})

describe('contactSchema', () => {
  const validData = {
    clientName: 'Juan Pérez',
    clientEmail: 'juan@example.com',
    clientPhone: '+56912345678',
    projectType: 'landing',
    turnstileToken: '0xAAAA...',
    description: 'Necesito una landing page para mi negocio de repostería.',
  }

  it('rechaza turnstileToken vacío', () => {
    const result = contactSchema.safeParse({ ...validData, turnstileToken: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.turnstileToken).toBeDefined()
    }
  })
})
