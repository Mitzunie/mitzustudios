import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { updatePostSchema } from '@/shared'
import { requireAdmin } from '@/lib/auth'
import { uploadImage, deleteImage, extractPublicId } from '@/lib/cloudinary'
import slugify from 'slugify'

function generateSlug(title: string): string {
  return slugify(title, { lower: true, strict: true, locale: 'es' })
}

async function ensureUniqueSlug(baseSlug: string, excludeId: string): Promise<string> {
  let slug = baseSlug
  let counter = 1
  while (true) {
    const existing = await prisma.post.findUnique({ where: { slug } })
    if (!existing || existing.id === excludeId) break
    slug = `${baseSlug}-${counter}`
    counter++
  }
  return slug
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
    })

    if (!post) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Artículo no encontrado' } },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
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

    console.error('Admin post GET error:', error)
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

    const existing = await prisma.post.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Artículo no encontrado' } },
        { status: 404 },
      )
    }

    const formData = await request.formData()

    const title = formData.get('title') as string | null
    const excerpt = formData.get('excerpt') as string | null
    const content = formData.get('content') as string | null
    const published = formData.get('published') as string | null
    const locale = formData.get('locale') as string | null
    const imageFile = formData.get('image') as File | null
    const removeImage = formData.get('removeImage') as string | null

    const updateData: Record<string, unknown> = {}
    if (title) {
      updateData.title = title
      updateData.slug = await ensureUniqueSlug(generateSlug(title), id)
    }
    if (excerpt !== null) updateData.excerpt = excerpt || null
    if (content) updateData.content = content
    if (published !== null) updateData.published = published === 'true'
    if (locale !== null) updateData.locale = locale

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

      if (existing.imageUrl) {
        const publicId = extractPublicId(existing.imageUrl)
        if (publicId) {
          deleteImage(publicId).catch(() => {})
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'No hay datos para actualizar' },
        },
        { status: 400 },
      )
    }

    const post = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
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

    console.error('Admin post PATCH error:', error)
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Error al actualizar el artículo' },
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

    const existing = await prisma.post.findUnique({
      where: { id },
      select: { id: true, imageUrl: true },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Artículo no encontrado' } },
        { status: 404 },
      )
    }

    if (existing.imageUrl) {
      const publicId = extractPublicId(existing.imageUrl)
      if (publicId) {
        deleteImage(publicId).catch(() => {})
      }
    }

    await prisma.post.delete({ where: { id } })

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

    console.error('Admin post DELETE error:', error)
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Error al eliminar el artículo' },
      },
      { status: 500 },
    )
  }
}
