import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createPostSchema } from '@/shared'
import { requireAdmin } from '@/lib/auth'
import { uploadImage } from '@/lib/cloudinary'
import slugify from 'slugify'

function generateSlug(title: string): string {
  return slugify(title, { lower: true, strict: true, locale: 'es' })
}

async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug
  let counter = 1
  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`
    counter++
  }
  return slug
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const publishedParam = searchParams.get('published')
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const pageSize = 20

    const where: Record<string, unknown> = {}
    if (publishedParam === 'true') where.published = true
    if (publishedParam === 'false') where.published = false

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, name: true, image: true } },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.post.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: posts.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
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

    console.error('Admin posts GET error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor' } },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin()

    const formData = await request.formData()

    const title = formData.get('title') as string
    const excerpt = formData.get('excerpt') as string | null
    const content = formData.get('content') as string
    const published = formData.get('published') === 'true'
    const locale = (formData.get('locale') as string) || 'es'
    const imageFile = formData.get('image') as File | null

    const parsed = createPostSchema.safeParse({
      title,
      excerpt: excerpt || undefined,
      content,
      published,
      locale,
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

    const slug = await ensureUniqueSlug(generateSlug(parsed.data.title))

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

    const post = await prisma.post.create({
      data: {
        title: parsed.data.title,
        slug,
        excerpt: parsed.data.excerpt || null,
        content: parsed.data.content,
        published: parsed.data.published,
        locale: parsed.data.locale,
        imageUrl,
        authorId: session.user.id,
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          ...post,
          createdAt: post.createdAt.toISOString(),
          updatedAt: post.updatedAt.toISOString(),
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

    console.error('Admin posts POST error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Error al crear el artículo' } },
      { status: 500 },
    )
  }
}
