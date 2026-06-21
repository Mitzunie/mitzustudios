/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
const mockRequireAdmin = vi.fn()
vi.mock('../../lib/auth', () => ({
  requireAdmin: (...args: any[]) => mockRequireAdmin(...args),
}))

// Mock Prisma
const mockProjectFindMany = vi.fn()
const mockProjectCount = vi.fn()
const mockProjectCreate = vi.fn()
const mockProjectFindUnique = vi.fn()
const mockProjectUpdate = vi.fn()
const mockProjectDelete = vi.fn()

vi.mock('@/lib/db', () => ({
  prisma: {
    project: {
      findMany: (...args: any[]) => mockProjectFindMany(...args),
      count: (...args: any[]) => mockProjectCount(...args),
      create: (...args: any[]) => mockProjectCreate(...args),
      findUnique: (...args: any[]) => mockProjectFindUnique(...args),
      update: (...args: any[]) => mockProjectUpdate(...args),
      delete: (...args: any[]) => mockProjectDelete(...args),
    },
  },
  ProjectStatus: {
    PUBLISHED: 'PUBLISHED',
    HIDDEN: 'HIDDEN',
    DRAFT: 'DRAFT',
  },
}))

// Mock Cloudinary
vi.mock('../../lib/cloudinary', () => ({
  uploadImage: vi.fn().mockResolvedValue({
    url: 'https://res.cloudinary.com/demo/image/upload/v1/test.jpg',
    publicId: 'mitzustudios/projects/test',
  }),
  deleteImage: vi.fn().mockResolvedValue(undefined),
  extractPublicId: vi.fn().mockReturnValue('mitzustudios/projects/test'),
}))

import { GET, POST } from '../../app/api/admin/projects/route'

function createJsonRequest(body: unknown, method = 'GET'): NextRequest {
  return new NextRequest('http://localhost:3000/api/admin/projects', {
    method,
    headers: { 'content-type': 'application/json' },
    body: method !== 'GET' ? JSON.stringify(body) : undefined,
  })
}

function createFormRequest(formData: Record<string, string | Blob>, method = 'POST'): NextRequest {
  const fd = new FormData()
  for (const [key, value] of Object.entries(formData)) {
    fd.append(key, value)
  }
  return new NextRequest('http://localhost:3000/api/admin/projects', {
    method,
    body: fd,
  })
}

describe('GET /api/admin/projects', () => {
  const mockProjects = [
    {
      id: 'proj-1',
      title: 'Proyecto 1',
      description: 'Descripción 1',
      imageUrl: null,
      status: 'PUBLISHED',
      createdAt: new Date('2026-06-01'),
      updatedAt: new Date('2026-06-01'),
      technologies: [
        { id: 'tech-1', name: 'Next.js', icon: 'nextjs', url: 'https://nextjs.org' },
      ],
    },
    {
      id: 'proj-2',
      title: 'Proyecto 2',
      description: 'Descripción 2',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/proj2.jpg',
      status: 'DRAFT',
      createdAt: new Date('2026-06-15'),
      updatedAt: new Date('2026-06-15'),
      technologies: [],
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockRequireAdmin.mockResolvedValue({ user: { email: 'admin@test.com' } })
    mockProjectFindMany.mockResolvedValue(mockProjects)
    mockProjectCount.mockResolvedValue(2)
  })

  it('devuelve lista paginada de proyectos (SF-26)', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/projects')
    const res = await GET(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.success).toBe(true)
    expect(body.data).toHaveLength(2)
    expect(body.pagination.total).toBe(2)
  })

  it('ordena por createdAt descendente (SF-12, SF-26)', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/projects')
    await GET(req)

    expect(mockProjectFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { createdAt: 'desc' },
      }),
    )
  })

  it('filtra por status cuando se pasa query param (SF-40)', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/projects?status=PUBLISHED')
    await GET(req)

    expect(mockProjectFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: 'PUBLISHED' },
      }),
    )
  })

  it('no filtra si status es inválido', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/projects?status=INVALID')
    await GET(req)

    expect(mockProjectFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {},
      }),
    )
  })

  it('devuelve 401 si no hay sesión (CB-05)', async () => {
    mockRequireAdmin.mockRejectedValue(new Error('Unauthorized'))

    const req = new NextRequest('http://localhost:3000/api/admin/projects')
    const res = await GET(req)
    const body = await res.json()

    expect(res.status).toBe(401)
    expect(body.error.code).toBe('UNAUTHORIZED')
  })

  it('devuelve 403 si el email no es admin', async () => {
    mockRequireAdmin.mockRejectedValue(new Error('Forbidden'))

    const req = new NextRequest('http://localhost:3000/api/admin/projects')
    const res = await GET(req)
    const body = await res.json()

    expect(res.status).toBe(403)
    expect(body.error.code).toBe('FORBIDDEN')
  })
})

describe('POST /api/admin/projects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRequireAdmin.mockResolvedValue({ user: { email: 'admin@test.com' } })
    mockProjectCreate.mockResolvedValue({
      id: 'new-proj',
      title: 'Nuevo Proyecto',
      description: 'Descripción',
      imageUrl: null,
      status: 'DRAFT',
      createdAt: new Date(),
      updatedAt: new Date(),
      technologies: [{ id: 'tech-1', name: 'Next.js', icon: 'nextjs', url: null }],
    })
  })

  it('crea proyecto exitosamente (SF-22)', async () => {
    const req = createFormRequest({
      title: 'Nuevo Proyecto',
      description: 'Descripción completa del proyecto',
      technologies: JSON.stringify([{ name: 'Next.js', icon: 'nextjs' }]),
      status: 'DRAFT',
    })
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(201)
    expect(body.success).toBe(true)
    expect(body.data.title).toBe('Nuevo Proyecto')
  })

  it('crea proyecto con status DRAFT por defecto (SF-38, RN-09)', async () => {
    const req = createFormRequest({
      title: 'Proyecto en Borrador',
      description: 'Descripción',
      technologies: JSON.stringify([{ name: 'React', icon: 'react' }]),
    })
    await POST(req)

    expect(mockProjectCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'DRAFT',
        }),
      }),
    )
  })

  it('crea proyecto con tecnologías anidadas', async () => {
    const req = createFormRequest({
      title: 'Proyecto Tech',
      description: 'Descripción',
      technologies: JSON.stringify([
        { name: 'Next.js', icon: 'nextjs', url: 'https://nextjs.org' },
        { name: 'React', icon: 'react' },
      ]),
    })
    await POST(req)

    expect(mockProjectCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          technologies: expect.objectContaining({
            create: expect.arrayContaining([
              expect.objectContaining({ name: 'Next.js' }),
              expect.objectContaining({ name: 'React' }),
            ]),
          }),
        }),
      }),
    )
  })

  it('devuelve 400 con datos inválidos', async () => {
    const req = createFormRequest({
      title: '',
      description: '',
      technologies: '[]',
    })
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.error.code).toBe('VALIDATION_ERROR')
  })

  it('devuelve 400 con tecnologías en formato inválido', async () => {
    const req = createFormRequest({
      title: 'Proyecto',
      description: 'Descripción',
      technologies: 'no-es-json',
    })
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.error.code).toBe('VALIDATION_ERROR')
  })

  it('crea proyecto sin imagen (RN-02, CB-11)', async () => {
    const req = createFormRequest({
      title: 'Proyecto Sin Imagen',
      description: 'Descripción del proyecto sin imagen',
      technologies: JSON.stringify([{ name: 'Node.js', icon: 'nodejs' }]),
    })
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(201)
    expect(body.success).toBe(true)
  })
})
