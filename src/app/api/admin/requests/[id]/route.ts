import { NextRequest, NextResponse } from 'next/server'
import { prisma, RequestStatus, ResponseChannel } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { generateClientResponseLink } from '@/lib/whatsapp'
import { sendResponseEmail } from '@/lib/resend'
import { env } from '@/lib/env'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params

    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id },
      include: { responses: { orderBy: { createdAt: 'desc' } } },
    })

    if (!serviceRequest) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Solicitud no encontrada' } },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...serviceRequest,
        createdAt: serviceRequest.createdAt.toISOString(),
        updatedAt: serviceRequest.updatedAt.toISOString(),
        responses: serviceRequest.responses.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
        })),
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

    console.error('Admin request GET error:', error)
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

    const body = await request.json()
    const { status: newStatus } = body

    if (!newStatus || !['UNREAD', 'READ', 'ANSWERED'].includes(newStatus)) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Estado inválido' },
        },
        { status: 400 },
      )
    }

    const updated = await prisma.serviceRequest.update({
      where: { id },
      data: { status: newStatus as RequestStatus },
      include: { responses: { orderBy: { createdAt: 'desc' } } },
    })

    return NextResponse.json({
      success: true,
      data: {
        ...updated,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
        responses: updated.responses.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
        })),
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

    console.error('Admin request PATCH error:', error)
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Error al actualizar la solicitud' },
      },
      { status: 500 },
    )
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params

    const existing = await prisma.serviceRequest.findUnique({
      where: { id },
      select: { id: true },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Solicitud no encontrada' } },
        { status: 404 },
      )
    }

    await prisma.serviceRequest.delete({ where: { id } })

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

    console.error('Admin request DELETE error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Error al eliminar la solicitud' } },
      { status: 500 },
    )
  }
}
