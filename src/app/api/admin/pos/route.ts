import { NextRequest, NextResponse } from 'next/server'
import { prisma, QuoteStatus } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { sendQuoteEmail } from '@/lib/resend'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const statusParam = searchParams.get('status')
    const search = searchParams.get('search')?.trim()
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const pageSize = 50

    const where: Record<string, unknown> = {}
    if (statusParam && ['PENDING', 'APPROVED', 'PAID', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(statusParam)) {
      where.status = statusParam as QuoteStatus
    }
    if (search) {
      where.OR = [
        { id: { contains: search } },
        { clientName: { contains: search, mode: 'insensitive' } },
        { clientEmail: { contains: search, mode: 'insensitive' } },
        { concept: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { splits: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.quote.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: quotes.map((q) => ({
        id: q.id,
        clientName: q.clientName,
        clientEmail: q.clientEmail,
        concept: q.concept,
        totalAmount: Number(q.totalAmount),
        status: q.status,
        splits: q.splits.map((s) => ({
          id: s.id,
          collaborator: s.collaborator,
          percentage: Number(s.percentage),
          amount: Number(q.totalAmount) * Number(s.percentage) / 100,
        })),
        createdAt: q.createdAt.toISOString(),
        updatedAt: q.updatedAt.toISOString(),
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
        { success: false, error: { code: 'UNAUTHORIZED' } },
        { status: 401 },
      )
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN' } },
        { status: 403 },
      )
    }
    console.error('Admin POS GET error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR' } },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const { clientName, clientEmail, concept, totalAmount, status, splits } = body

    if (!clientName || !clientEmail || !concept || totalAmount == null || !splits?.length) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Faltan campos requeridos' } },
        { status: 400 },
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Email inválido' } },
        { status: 400 },
      )
    }

    const totalPct = splits.reduce((sum: number, s: { percentage: number }) => sum + Number(s.percentage), 0)
    if (Math.abs(totalPct - 100) > 0.01) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Los porcentajes deben sumar 100%' } },
        { status: 400 },
      )
    }

    const quote = await prisma.quote.create({
      data: {
        clientName,
        clientEmail,
        concept,
        totalAmount,
        status: (status as QuoteStatus) || 'PENDING',
        splits: {
          create: splits.map((s: { collaborator: string; percentage: number }) => ({
            collaborator: s.collaborator,
            percentage: s.percentage,
          })),
        },
      },
      include: { splits: true },
    })

    const splitsWithAmount = quote.splits.map((s) => ({
      collaborator: s.collaborator,
      percentage: Number(s.percentage),
      amount: Number(quote.totalAmount) * Number(s.percentage) / 100,
    }))

    const emailResult = await sendQuoteEmail(clientEmail, clientName, {
      concept,
      totalAmount: Number(quote.totalAmount),
      status: quote.status,
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          id: quote.id,
          clientName: quote.clientName,
          clientEmail: quote.clientEmail,
          concept: quote.concept,
          totalAmount: Number(quote.totalAmount),
          status: quote.status,
          splits: splitsWithAmount,
          emailSent: emailResult.success,
          createdAt: quote.createdAt.toISOString(),
          updatedAt: quote.updatedAt.toISOString(),
        },
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message === 'Forbidden')) {
      const status = error.message === 'Unauthorized' ? 401 : 403
      return NextResponse.json(
        { success: false, error: { code: status === 401 ? 'UNAUTHORIZED' : 'FORBIDDEN' } },
        { status },
      )
    }
    console.error('Admin POS POST error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR' } },
      { status: 500 },
    )
  }
}
