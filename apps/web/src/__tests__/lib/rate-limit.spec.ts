import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { contactLimiter, loginLimiter } from '../../lib/rate-limit'

describe('RateLimiter', () => {
  // Limpiamos los limiters entre tests para evitar interferencias
  afterEach(() => {
    // Limpiamos solo las keys usadas en este archivo
    const testKeys = [
      'test:ip-1',
      'test:burst',
      'test:remaining',
      'test:independent-a',
      'test:independent-b',
      'test:reset',
      'test:reset-a',
      'test:reset-b',
      'test:retry-after',
      'login:test',
    ]
    for (const key of testKeys) {
      contactLimiter.reset(key)
      loginLimiter.reset(key)
    }
  })

  describe('contactLimiter (default: 10/min)', () => {
    it('permite la primera solicitud', () => {
      const result = contactLimiter.check('test:ip-1')
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(9)
      expect(result.resetAt).toBeGreaterThan(Date.now())
    })

    it('permite hasta max solicitudes', () => {
      const key = 'test:burst'
      // Usar las 10 solicitudes
      for (let i = 0; i < 10; i++) {
        const result = contactLimiter.check(key)
        if (i < 10) {
          expect(result.allowed).toBe(true)
        }
      }
      // La 11° debería ser rechazada
      const result = contactLimiter.check(key)
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('disminuye remaining correctamente', () => {
      const key = 'test:remaining'
      const r1 = contactLimiter.check(key)
      expect(r1.remaining).toBe(9)

      const r2 = contactLimiter.check(key)
      expect(r2.remaining).toBe(8)

      const r3 = contactLimiter.check(key)
      expect(r3.remaining).toBe(7)
    })

    it('maneja diferentes keys de forma independiente', () => {
      const r1 = contactLimiter.check('test:independent-a')
      const r2 = contactLimiter.check('test:independent-b')
      expect(r1.allowed).toBe(true)
      expect(r2.allowed).toBe(true)
      expect(r1.remaining).toBe(9)
      expect(r2.remaining).toBe(9)
    })
  })

  describe('loginLimiter (5/min)', () => {
    it('permite hasta 5 intentos', () => {
      const key = 'login:test'
      for (let i = 0; i < 5; i++) {
        const result = loginLimiter.check(key)
        expect(result.allowed).toBe(true)
      }
      const result = loginLimiter.check(key)
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
    })
  })
})

describe('RateLimiter.reset', () => {
  it('reinicia el contador para una key específica', () => {
    // Llenar hasta el límite
    const key = 'test:reset'
    for (let i = 0; i < 10; i++) {
      contactLimiter.check(key)
    }
    expect(contactLimiter.check(key).allowed).toBe(false)

    // Reiniciar
    contactLimiter.reset(key)
    const result = contactLimiter.check(key)
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(9)
  })

  it('no afecta otras keys al resetear', () => {
    const keyA = 'test:reset-a'
    const keyB = 'test:reset-b'

    // Llenar keyA
    for (let i = 0; i < 10; i++) {
      contactLimiter.check(keyA)
    }

    // Reset keyB (no afectada)
    contactLimiter.reset(keyB)
    expect(contactLimiter.check(keyA).allowed).toBe(false)
  })
})

describe('CB-06: Rate limit responde 429 con Retry-After', () => {
  it('el header Retry-After se calcula correctamente', () => {
    const key = 'test:retry-after'
    // Llenar
    for (let i = 0; i < 10; i++) {
      contactLimiter.check(key)
    }
    const result = contactLimiter.check(key)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
    expect(result.resetAt).toBeGreaterThan(Date.now())

    const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000)
    expect(retryAfter).toBeGreaterThan(0)
    expect(retryAfter).toBeLessThanOrEqual(60) // máximo 1 minuto
  })
})
