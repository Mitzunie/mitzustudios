import { NextRequest, NextResponse } from 'next/server'
import { prisma, ResponseChannel } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { generateClientResponseLink } from '@/lib/whatsapp'
import { sendResponseEmail } from '@/lib/resend'
import { env } from '@/lib/env'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params

    const body = await request.json()
    const { content, channel } = body

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'El contenido de la respuesta es requerido' },
        },
        { status: 400 },
      )
    }

    if (!channel || !['WHATSAPP', 'EMAIL'].includes(channel)) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Canal inválido' },
        },
        { status: 400 },
      )
    }

    // Get the service request
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id },
    })

    if (!serviceRequest) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Solicitud no encontrada' } },
        { status: 404 },
      )
    }

    // Create the response in DB
    const response = await prisma.response.create({
      data: {
        content: content.trim(),
        channel: channel as ResponseChannel,
        serviceRequestId: id,
      },
    })

    // Update request status to ANSWERED
    await prisma.serviceRequest.update({
      where: { id },
      data: { status: 'ANSWERED' },
    })

    let waLink: string | null = null
    let emailSent = false

    if (channel === 'WHATSAPP') {
      waLink = generateClientResponseLink(serviceRequest.clientPhone, content.trim())
    } else {
      const result = await sendResponseEmail(
        serviceRequest.clientEmail,
        `Respuesta de MitzuStudios - ${serviceRequest.clientName}`,
        content.trim(),
      )
      emailSent = result.success
    }

    return NextResponse.json({
      success: true,
      data: {
        id: response.id,
        content: response.content,
        channel: response.channel,
        createdAt: response.createdAt.toISOString(),
        waLink,
        emailSent,
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

    console.error('Admin request respond error:', error)
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Error al enviar la respuesta' },
      },
      { status: 500 },
    )
  }
}
