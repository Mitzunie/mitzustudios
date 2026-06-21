/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock bcryptjs
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('$2a$12$hashedpassword'),
  },
  hash: vi.fn().mockResolvedValue('$2a$12$hashedpassword'),
}))

// Mock Prisma
vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}))

import { POST } from '../../app/api/auth/register/route'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

function createRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost:3000/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

describe('POST /api/auth/register', () => {
  const validBody = {
    name: 'Admin User',
    email: 'admin@mitzustudios.com',
    password: 'securePassword123',
    confirmPassword: 'securePassword123',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@mitzustudios.com',
      password: '$2a$12$hashedpassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any)
  })

  it('devuelve 201 con datos válidos', async () => {
    const req = createRequest(validBody)
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(201)
    expect(body.success).toBe(true)
  })

  it('crea el usuario en la DB con email normalizado', async () => {
    const req = createRequest(validBody)
    await POST(req)

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: 'Admin User',
        email: 'admin@mitzustudios.com',
        password: expect.any(String),
      }),
    })
  })

  it('normaliza email a minúsculas', async () => {
    const req = createRequest({
      ...validBody,
      email: 'Admin@MitzuStudios.com',
    })
    await POST(req)

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: 'admin@mitzustudios.com',
      }),
    })
  })

  it('hashea la password con bcrypt', async () => {
    const req = createRequest(validBody)
    await POST(req)

    expect(bcrypt.hash).toHaveBeenCalledWith('securePassword123', 12)
  })

  it('devuelve 409 si el email ya existe', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'existing-user',
      email: 'admin@mitzustudios.com',
    } as any)

    const req = createRequest(validBody)
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(409)
    expect(body.error.code).toBe('CONFLICT')
  })

  it('devuelve 400 con datos inválidos', async () => {
    const req = createRequest({
      name: '',
      email: 'invalido',
      password: '123',
      confirmPassword: '456',
    })
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.error.code).toBe('VALIDATION_ERROR')
    expect(body.error.fieldErrors).toBeDefined()
  })

  it('devuelve 201 aunque no se envíe confirmPassword', async () => {
    const req = createRequest({
      name: 'Admin User',
      email: 'admin@mitzustudios.com',
      password: 'securePassword123',
    })
    const res = await POST(req)

    expect(res.status).toBe(201)
  })

  it('devuelve 500 si Prisma falla', async () => {
    vi.mocked(prisma.user.create).mockRejectedValue(new Error('DB error'))

    const req = createRequest(validBody)
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body.error.code).toBe('INTERNAL_ERROR')
  })
})
