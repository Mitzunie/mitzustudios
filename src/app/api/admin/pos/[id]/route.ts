import { NextRequest, NextResponse } from 'next/server'
import { prisma, QuoteStatus } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { resend } from '@/lib/resend'

const VALID_STATUSES = ['PENDING', 'APPROVED', 'PAID', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: { splits: true },
    })

    if (!quote) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND' } },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: quote.id,
        clientName: quote.clientName,
        clientEmail: quote.clientEmail,
        concept: quote.concept,
        totalAmount: Number(quote.totalAmount),
        status: quote.status,
        splits: quote.splits.map((s) => ({
          id: s.id,
          collaborator: s.collaborator,
          percentage: Number(s.percentage),
          amount: Number(quote.totalAmount) * Number(s.percentage) / 100,
        })),
        createdAt: quote.createdAt.toISOString(),
        updatedAt: quote.updatedAt.toISOString(),
      },
    })
  } catch (error) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message === 'Forbidden')) {
      const status = error.message === 'Unauthorized' ? 401 : 403
      return NextResponse.json(
        { success: false, error: { code: status === 401 ? 'UNAUTHORIZED' : 'FORBIDDEN' } },
        { status },
      )
    }
    console.error('Admin POS GET error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR' } },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params

    const existing = await prisma.quote.findUnique({ where: { id }, include: { splits: true } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND' } },
        { status: 404 },
      )
    }

    if (existing.status === 'COMPLETED') {
      return NextResponse.json(
        { success: false, error: { code: 'QUOTE_COMPLETED', message: 'La cotización ya está finalizada y no puede ser modificada' } },
        { status: 400 },
      )
    }

    const body = await request.json()
    const { clientName, clientEmail, concept, totalAmount, status, splits } = body

    if (splits) {
      const totalPct = splits.reduce((sum: number, s: { percentage: number }) => sum + Number(s.percentage), 0)
      if (Math.abs(totalPct - 100) > 0.01) {
        return NextResponse.json(
          { success: false, error: { code: 'VALIDATION_ERROR', message: 'Los porcentajes deben sumar 100%' } },
          { status: 400 },
        )
      }
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Estado inválido' } },
        { status: 400 },
      )
    }

    const updateData: Record<string, unknown> = {}
    if (clientName !== undefined) updateData.clientName = clientName
    if (clientEmail !== undefined) updateData.clientEmail = clientEmail
    if (concept !== undefined) updateData.concept = concept
    if (totalAmount !== undefined) updateData.totalAmount = totalAmount
    if (status !== undefined) updateData.status = status as QuoteStatus

    if (splits) {
      await prisma.quoteSplit.deleteMany({ where: { quoteId: id } })
      await prisma.quoteSplit.createMany({
        data: splits.map((s: { collaborator: string; percentage: number }) => ({
          quoteId: id,
          collaborator: s.collaborator,
          percentage: s.percentage,
        })),
      })
    }

    const quote = await prisma.quote.update({
      where: { id },
      data: updateData,
      include: { splits: true },
    })

    const splitsWithAmount = quote.splits.map((s) => ({
      collaborator: s.collaborator,
      percentage: Number(s.percentage),
      amount: Number(quote.totalAmount) * Number(s.percentage) / 100,
    }))

    let emailSent = false

    if (quote.status === 'PAID' && existing.status !== 'PAID') {
      try {
        await resend.emails.send({
          from: 'MitzuStudios <notificaciones@mitzustudios.online>',
          to: quote.clientEmail,
          subject: `Comprobante de pago - ${quote.concept}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #4A0E8F; font-size: 24px; margin: 0;">MitzuStudios</h1>
                <p style="color: #6b7280; font-size: 14px;">Desarrollo Web Profesional</p>
              </div>
              <h2 style="color: #111827;">Hola ${quote.clientName},</h2>
              <p>Hemos recibido tu pago. Aquí está tu comprobante:</p>
              <div style="background: #f3eefb; border: 1px solid #4A0E8F; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <p style="font-size: 12px; color: #4A0E8F; font-weight: bold; margin: 0 0 4px;">ESTADO: PAGADA - PENDIENTE DE DESARROLLO</p>
                <h3 style="margin: 0 0 8px; color: #111827;">${quote.concept}</h3>
                <p style="font-size: 28px; font-weight: bold; margin: 0; color: #111827;">
                  $${Number(quote.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                </p>
              </div>
              <p style="color: #6b7280; font-size: 13px;">
                Pronto nos pondremos en contacto para comenzar con el desarrollo.
                Si tienes alguna duda, responde a este correo o escríbenos a
                <a href="mailto:team@mitzustudios.online" style="color: #4A0E8F; font-weight: bold;">team@mitzustudios.online</a>.
              </p>
              <hr style="border: 1px solid #e5e7eb; margin: 24px 0;" />
              <p style="color: #6b7280; font-size: 12px; text-align: center;">
                MitzuStudios &mdash; De tu idea a tu próxima web
              </p>
            </div>
          `,
        })
        emailSent = true
      } catch (err) {
        console.error('Error sending paid receipt email:', err)
      }
    }

    if (quote.status === 'COMPLETED') {
      try {
        await resend.emails.send({
          from: 'MitzuStudios <notificaciones@mitzustudios.online>',
          to: quote.clientEmail,
          subject: `Proyecto finalizado - ${quote.concept}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #4A0E8F; font-size: 24px; margin: 0;">MitzuStudios</h1>
                <p style="color: #6b7280; font-size: 14px;">Desarrollo Web Profesional</p>
              </div>
              <h2 style="color: #111827;">Hola ${quote.clientName},</h2>
              <p>¡Tu proyecto ha sido completado con éxito!</p>
              <div style="background: #f3eefb; border: 1px solid #4A0E8F; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <p style="font-size: 12px; color: #4A0E8F; font-weight: bold; margin: 0 0 4px;">ESTADO: FINALIZADO - COMPLETADO</p>
                <h3 style="margin: 0 0 8px; color: #111827;">${quote.concept}</h3>
                <p style="font-size: 18px; font-weight: bold; margin: 0; color: #111827;">
                  Total: $${Number(quote.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                </p>
              </div>
              <p style="color: #6b7280; font-size: 13px;">
                Gracias por confiar en nosotros. Esperamos que el resultado sea de tu agrado.
                Si tienes alguna duda o necesitas soporte adicional, responde a este correo o escríbenos a
                <a href="mailto:team@mitzustudios.online" style="color: #4A0E8F; font-weight: bold;">team@mitzustudios.online</a>.
              </p>
              <hr style="border: 1px solid #e5e7eb; margin: 24px 0;" />
              <p style="color: #6b7280; font-size: 12px; text-align: center;">
                MitzuStudios &mdash; De tu idea a tu próxima web
              </p>
            </div>
          `,
        })
        emailSent = true
      } catch (err) {
        console.error('Error sending completed email:', err)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: quote.id,
        clientName: quote.clientName,
        clientEmail: quote.clientEmail,
        concept: quote.concept,
        totalAmount: Number(quote.totalAmount),
        status: quote.status,
        splits: splitsWithAmount,
        emailSent,
        createdAt: quote.createdAt.toISOString(),
        updatedAt: quote.updatedAt.toISOString(),
      },
    })
  } catch (error) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message === 'Forbidden')) {
      const status = error.message === 'Unauthorized' ? 401 : 403
      return NextResponse.json(
        { success: false, error: { code: status === 401 ? 'UNAUTHORIZED' : 'FORBIDDEN' } },
        { status },
      )
    }
    console.error('Admin POS PATCH error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR' } },
      { status: 500 },
    )
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params

    const existing = await prisma.quote.findUnique({ where: { id }, select: { id: true } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND' } },
        { status: 404 },
      )
    }

    await prisma.quote.delete({ where: { id } })

    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message === 'Forbidden')) {
      const status = error.message === 'Unauthorized' ? 401 : 403
      return NextResponse.json(
        { success: false, error: { code: status === 401 ? 'UNAUTHORIZED' : 'FORBIDDEN' } },
        { status },
      )
    }
    console.error('Admin POS DELETE error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR' } },
      { status: 500 },
    )
  }
}
