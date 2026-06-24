import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { generateQuotePdf } from '@/lib/pdf'

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

    const pdf = await generateQuotePdf({
      id: quote.id,
      clientName: quote.clientName,
      clientEmail: quote.clientEmail,
      concept: quote.concept,
      totalAmount: Number(quote.totalAmount),
      status: quote.status,
      createdAt: quote.createdAt.toISOString(),
      splits: quote.splits.map((s) => ({
        collaborator: s.collaborator,
        percentage: Number(s.percentage),
        amount: Number(quote.totalAmount) * Number(s.percentage) / 100,
      })),
    })

    const arrayBuffer = new Uint8Array(pdf).buffer.slice(0) as ArrayBuffer
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' })
    return new NextResponse(blob, {
      headers: {
        'Content-Disposition': `attachment; filename="cotizacion-${quote.id.slice(0, 8)}.pdf"`,
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
    console.error('Admin POS PDF error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR' } },
      { status: 500 },
    )
  }
}
