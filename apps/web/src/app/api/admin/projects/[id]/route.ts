import { NextRequest, NextResponse } from 'next/server'
import { prisma, ProjectStatus } from '@/lib/db'
import { updateProjectSchema, getTechIcon } from '@/shared'
import { requireAdmin } from '@/lib/auth'
import { uploadImage, deleteImage, extractPublicId } from '@/lib/cloudinary'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params

    const project = await prisma.project.findUnique({
      where: { id },
      include: { technologies: true },
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Proyecto no encontrado' } },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...project,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        technologies: project.technologies.map((t) => ({ ...t, url: t.url })),
      },
    })
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

    console.error('Admin project GET error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor' } },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params

    const existing = await prisma.project.findUnique({
      where: { id },
      include: { technologies: true },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Proyecto no encontrado' } },
        { status: 404 },
      )
    }

    const formData = await request.formData()

    const title = formData.get('title') as string | null
    const description = formData.get('description') as string | null
    const technologiesRaw = formData.get('technologies') as string | null
    const status = formData.get('status') as string | null
    const imageFile = formData.get('image') as File | null
    const removeImage = formData.get('removeImage') as string | null

    const updateData: Record<string, unknown> = {}
    if (title) updateData.title = title
    if (description) updateData.description = description
    if (status && ['PUBLISHED', 'HIDDEN', 'DRAFT'].includes(status)) {
      updateData.status = status as ProjectStatus
    }

    // Handle image
    if (removeImage === 'true' && existing.imageUrl) {
      const publicId = extractPublicId(existing.imageUrl)
      if (publicId) {
        deleteImage(publicId).catch(() => {})
      }
      updateData.imageUrl = null
    } else if (imageFile && imageFile.size > 0) {
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
      updateData.imageUrl = uploadResult.url

      // Delete old image
      if (existing.imageUrl) {
        const publicId = extractPublicId(existing.imageUrl)
        if (publicId) {
          deleteImage(publicId).catch(() => {})
        }
      }
    }

    // Handle technologies
    let technologies: { name: string; icon: string; url?: string }[] | null = null
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

    // Validate if we have update data
    if (Object.keys(updateData).length === 0 && !technologies) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'No hay datos para actualizar' },
        },
        { status: 400 },
      )
    }

    // Update project
    const project = await prisma.project.update({
      where: { id },
      data: {
        ...updateData,
        ...(technologies
          ? {
              technologies: {
                deleteMany: {},
                create: technologies.map((t) => ({
                  name: t.name,
                  icon: t.icon || getTechIcon(t.name),
                  url: t.url || null,
                })),
              },
            }
          : {}),
      },
      include: { technologies: true },
    })

    return NextResponse.json({
      success: true,
      data: {
        ...project,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        technologies: project.technologies.map((t) => ({ ...t, url: t.url })),
      },
    })
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === 'Unauthorized' || error.message === 'Forbidden')
    ) {
      const status = error.message === 'Unauthorized' ? 401 : 403
      return NextResponse.json(
        {
          success: false,
          error: { code: status === 401 ? 'UNAUTHORIZED' : 'FORBIDDEN' },
        },
        { status },
      )
    }

    console.error('Admin project PATCH error:', error)
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Error al actualizar el proyecto' },
      },
      { status: 500 },
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin()
    const { id } = await params

    const existing = await prisma.project.findUnique({
      where: { id },
      select: { id: true, imageUrl: true },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Proyecto no encontrado' } },
        { status: 404 },
      )
    }

    // Delete image from Cloudinary
    if (existing.imageUrl) {
      const publicId = extractPublicId(existing.imageUrl)
      if (publicId) {
        deleteImage(publicId).catch(() => {})
      }
    }

    await prisma.project.delete({ where: { id } })

    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === 'Unauthorized' || error.message === 'Forbidden')
    ) {
      const status = error.message === 'Unauthorized' ? 401 : 403
      return NextResponse.json(
        {
          success: false,
          error: { code: status === 401 ? 'UNAUTHORIZED' : 'FORBIDDEN' },
        },
        { status },
      )
    }

    console.error('Admin project DELETE error:', error)
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Error al eliminar el proyecto' },
      },
      { status: 500 },
    )
  }
}
