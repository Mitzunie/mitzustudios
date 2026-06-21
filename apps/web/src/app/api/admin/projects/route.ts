import { NextRequest, NextResponse } from 'next/server'
import { prisma, ProjectStatus } from '@/lib/db'
import { createProjectSchema, getTechIcon } from '@/shared'
import { requireAdmin } from '@/lib/auth'
import { uploadImage } from '@/lib/cloudinary'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const statusParam = searchParams.get('status')
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const pageSize = 20

    const where: Record<string, unknown> = {}
    if (statusParam && ['PUBLISHED', 'HIDDEN', 'DRAFT'].includes(statusParam)) {
      where.status = statusParam as ProjectStatus
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { technologies: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.project.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: projects.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        technologies: p.technologies.map((t) => ({ ...t, url: t.url })),
      })),
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'No autenticado' } },
        { status: 401 },
      )
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'No autorizado' } },
        { status: 403 },
      )
    }

    console.error('Admin projects GET error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor' } },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const formData = await request.formData()

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const technologiesRaw = formData.get('technologies') as string
    const status = (formData.get('status') as string) || 'DRAFT'
    const imageFile = formData.get('image') as File | null

    let technologies: { name: string; icon: string; url?: string }[] = []
    if (technologiesRaw) {
      try {
        technologies = JSON.parse(technologiesRaw)
      } catch {
        return NextResponse.json(
          {
            success: false,
            error: { code: 'VALIDATION_ERROR', message: 'Formato de tecnologías inválido' },
          },
          { status: 400 },
        )
      }
    }

    const parsed = createProjectSchema.safeParse({
      title,
      description,
      technologies,
      status,
    })

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Datos inválidos',
            fieldErrors: parsed.error.flatten().fieldErrors,
          },
        },
        { status: 400 },
      )
    }

    let imageUrl: string | null = null

    if (imageFile && imageFile.size > 0) {
      const maxSize = 10 * 1024 * 1024
      if (imageFile.size > maxSize) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'La imagen supera el tamaño máximo de 10MB',
            },
          },
          { status: 400 },
        )
      }

      const uploadResult = await uploadImage(imageFile)
      imageUrl = uploadResult.url
    }

    const project = await prisma.project.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        status: parsed.data.status as ProjectStatus,
        imageUrl,
        technologies: {
          create: parsed.data.technologies.map((t) => ({
            name: t.name,
            icon: t.icon || getTechIcon(t.name),
            url: t.url || null,
          })),
        },
      },
      include: { technologies: true },
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          ...project,
          createdAt: project.createdAt.toISOString(),
          updatedAt: project.updatedAt.toISOString(),
          technologies: project.technologies.map((t) => ({ ...t, url: t.url })),
        },
      },
      { status: 201 },
    )
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === 'Unauthorized' || error.message === 'Forbidden')
    ) {
      const status = error.message === 'Unauthorized' ? 401 : 403
      return NextResponse.json(
        {
          success: false,
          error: {
            code: status === 401 ? 'UNAUTHORIZED' : 'FORBIDDEN',
            message: status === 401 ? 'No autenticado' : 'No autorizado',
          },
        },
        { status },
      )
    }

    console.error('Admin projects POST error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Error al crear el proyecto' } },
      { status: 500 },
    )
  }
}
