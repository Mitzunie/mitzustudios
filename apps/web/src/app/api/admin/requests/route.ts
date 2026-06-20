import { NextRequest, NextResponse } from 'next/server'
import { prisma, RequestStatus } from '@mitzustudios/db'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const statusParam = searchParams.get('status')
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const pageSize = 20

    const where: Record<string, unknown> = {}
    if (statusParam && ['UNREAD', 'READ', 'ANSWERED'].includes(statusParam)) {
      where.status = statusParam as RequestStatus
    }

    const [requests, total] = await Promise.all([
      prisma.serviceRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { responses: { orderBy: { createdAt: 'desc' } } },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.serviceRequest.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: requests.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
        responses: r.responses.map((resp) => ({
          ...resp,
          createdAt: resp.createdAt.toISOString(),
        })),
      })),
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
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

    console.error('Admin requests GET error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor' } },
      { status: 500 },
    )
  }
}
