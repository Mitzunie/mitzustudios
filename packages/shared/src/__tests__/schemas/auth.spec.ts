import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema } from '../../schemas/auth'

describe('loginSchema', () => {
  const validData = {
    email: 'admin@mitzustudios.com',
    password: 'securePassword123',
  }

  it('acepta credenciales válidas', () => {
    const result = loginSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('rechaza email inválido', () => {
    const result = loginSchema.safeParse({ ...validData, email: 'no-email' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toContain('Email inválido')
    }
  })

  it('rechaza email vacío', () => {
    const result = loginSchema.safeParse({ ...validData, email: '' })
    expect(result.success).toBe(false)
  })

  it('rechaza password vacío', () => {
    const result = loginSchema.safeParse({ ...validData, password: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toContain('Contraseña requerida')
    }
  })

  it('rechaza formulario vacío', () => {
    const result = loginSchema.safeParse({})
    expect(result.success).toBe(false)
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      expect(fieldErrors.email).toBeDefined()
      expect(fieldErrors.password).toBeDefined()
    }
  })
})

describe('registerSchema', () => {
  const validData = {
    name: 'Admin Test',
    email: 'admin@mitzustudios.com',
    password: 'securePassword123',
    confirmPassword: 'securePassword123',
  }

  it('acepta datos de registro válidos', () => {
    const result = registerSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('rechaza name vacío', () => {
    const result = registerSchema.safeParse({ ...validData, name: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toContain('El nombre es requerido')
    }
  })

  it('rechaza name con más de 100 caracteres', () => {
    const result = registerSchema.safeParse({
      ...validData,
      name: 'A'.repeat(101),
    })
    expect(result.success).toBe(false)
  })

  it('rechaza email inválido', () => {
    const result = registerSchema.safeParse({ ...validData, email: 'invalido' })
    expect(result.success).toBe(false)
  })

  it('rechaza password con menos de 8 caracteres', () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: '1234567',
      confirmPassword: '1234567',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toContain('Mínimo 8 caracteres')
    }
  })

  it('rechaza confirmPassword vacío', () => {
    const result = registerSchema.safeParse({ ...validData, confirmPassword: '' })
    expect(result.success).toBe(false)
  })

  it('rechaza cuando passwords no coinciden', () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: 'password123',
      confirmPassword: 'differentPassword',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.confirmPassword).toContain(
        'Las contraseñas no coinciden',
      )
    }
  })

  it('rechaza formulario vacío', () => {
    const result = registerSchema.safeParse({})
    expect(result.success).toBe(false)
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      expect(fieldErrors.name).toBeDefined()
      expect(fieldErrors.email).toBeDefined()
      expect(fieldErrors.password).toBeDefined()
      expect(fieldErrors.confirmPassword).toBeDefined()
    }
  })
})
