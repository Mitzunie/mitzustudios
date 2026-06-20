import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { uploadImage } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'No se recibió ningún archivo',
          },
        },
        { status: 400 },
      )
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
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

    const result = await uploadImage(file)

    return NextResponse.json({
      success: true,
      data: { url: result.url },
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'No autenticado' },
        },
        { status: 401 },
      )
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'FORBIDDEN', message: 'No autorizado' },
        },
        { status: 403 },
      )
    }

    console.error('Upload error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Error al subir la imagen',
        },
      },
      { status: 500 },
    )
  }
}
