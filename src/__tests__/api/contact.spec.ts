/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock Prisma
vi.mock('@/lib/db', () => ({
  prisma: {
    serviceRequest: {
      create: vi.fn(),
    },
  },
}))

// Mock rate limiter (controlable)
const mockCheck = vi.fn()
vi.mock('../../lib/rate-limit', () => ({
  contactLimiter: {
    check: (...args: any[]) => mockCheck(...args),
    reset: vi.fn(),
  },
}))

// Mock Resend
vi.mock('../../lib/resend', () => ({
  sendNotificationEmail: vi.fn().mockResolvedValue({ success: true }),
}))

// Mock env for Turnstile secret
vi.mock('../../lib/env', () => ({
  env: {
    TURNSTILE_SECRET_KEY: '0x4AAAAAA-test-secret',
  },
}))

// Mock global fetch for Turnstile verification
const mockTurnstileFetch = vi.fn()
global.fetch = mockTurnstileFetch

import { POST } from '../../app/api/contact/route'
import { prisma } from '@/lib/db'

function createRequest(body: unknown, ip?: string): NextRequest {
  const headers = new Headers()
  if (ip) {
    headers.set('x-forwarded-for', ip)
  }
  return new NextRequest('http://localhost:3000/api/contact', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
}

describe('POST /api/contact', () => {
  const validBody = {
    clientName: 'Juan Pérez',
    clientEmail: 'juan@example.com',
    clientPhone: '+56912345678',
    projectType: 'landing',
    turnstileToken: '0x4AAAAAA-test-token',
    description: 'Necesito una landing page para mi negocio de repostería.',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockCheck.mockReset()
    // Por defecto, rate limit permite
    mockCheck.mockReturnValue({
      allowed: true,
      remaining: 9,
      resetAt: Date.now() + 60000,
    })
    // Por defecto, Turnstile verification ok
    mockTurnstileFetch.mockResolvedValue({
      json: () => Promise.resolve({ success: true }),
    })
    // Mock Prisma create exitoso
    vi.mocked(prisma.serviceRequest.create).mockResolvedValue({
      id: 'req-123',
      clientName: 'Juan Pérez',
      clientEmail: 'juan@example.com',
      clientPhone: '+56912345678',
      projectType: 'landing',
      otherType: null,
      description: 'Necesito una landing page para mi negocio de repostería.',
      status: 'UNREAD',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any)
  })

  it('devuelve 201 con solicitud válida (SF-08)', async () => {
    const req = createRequest(validBody, '192.168.1.1')
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(201)
    expect(body.success).toBe(true)
    expect(body.data.id).toBe('req-123')
  })

  it('guarda la solicitud en DB (SF-08)', async () => {
    const req = createRequest(validBody, '192.168.1.1')
    await POST(req)

    expect(prisma.serviceRequest.create).toHaveBeenCalledWith({
      data: {
        clientName: 'Juan Pérez',
        clientEmail: 'juan@example.com',
        clientPhone: '+56912345678',
        projectType: 'landing',
        otherType: null,
        description: 'Necesito una landing page para mi negocio de repostería.',
      },
    })
  })

  it('devuelve 400 con body inválido (CB-01)', async () => {
    const req = createRequest({ clientName: '' }, '192.168.1.1')
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.success).toBe(false)
    expect(body.error.code).toBe('VALIDATION_ERROR')
    expect(body.error.fieldErrors).toBeDefined()
  })

  it('devuelve 400 con body vacío (CB-02)', async () => {
    const req = createRequest({}, '192.168.1.1')
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.success).toBe(false)
    expect(body.error.code).toBe('VALIDATION_ERROR')
  })

  it('devuelve 429 si rate limit excedido (CB-06, SF-10)', async () => {
    mockCheck.mockReturnValue({
      allowed: false,
      remaining: 0,
      resetAt: Date.now() + 60000,
    })

    const req = createRequest(validBody, '192.168.1.1')
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(429)
    expect(body.error.code).toBe('RATE_LIMIT_EXCEEDED')
    expect(res.headers.get('Retry-After')).toBeDefined()
  })

  it('incluye X-RateLimit-Remaining en respuesta exitosa', async () => {
    const req = createRequest(validBody, '192.168.1.1')
    const res = await POST(req)

    expect(res.headers.get('X-RateLimit-Remaining')).toBe('9')
  })

  it('usa la IP del header x-forwarded-for para rate limiting', async () => {
    const req = createRequest(validBody, '203.0.113.42')
    await POST(req)

    expect(mockCheck).toHaveBeenCalledWith(expect.stringContaining('203.0.113.42'))
  })

  it('devuelve 500 si Prisma falla', async () => {
    vi.mocked(prisma.serviceRequest.create).mockRejectedValue(new Error('DB connection failed'))

    const req = createRequest(validBody, '192.168.1.1')
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body.error.code).toBe('INTERNAL_ERROR')
  })

  it('devuelve 400 si captcha falla', async () => {
    mockTurnstileFetch.mockResolvedValue({
      json: () => Promise.resolve({ success: false }),
    })

    const req = createRequest(validBody, '192.168.1.1')
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.error.code).toBe('CAPTCHA_FAILED')
  })
})
