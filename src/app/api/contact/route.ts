import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { contactSchema } from '@/shared'
import { contactLimiter } from '@/lib/rate-limit'
import { sendNotificationEmail } from '@/lib/resend'
import { env } from '@/lib/env'

export async function POST(request: NextRequest) {
  try {
    // Rate limit check
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed, remaining, resetAt } = contactLimiter.check(`contact:${ip}`)

    if (!allowed) {
      const retryAfter = Math.ceil((resetAt - Date.now()) / 1000)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Demasiadas solicitudes. Intenta de nuevo en un minuto.',
          },
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Remaining': '0',
          },
        },
      )
    }

    const body = await request.json()
    const parsed = contactSchema.safeParse(body)

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

    const { clientName, clientEmail, clientPhone, projectType, otherType, description, turnstileToken } =
      parsed.data

    // Verify Turnstile token
    const turnstileFormData = new URLSearchParams()
    turnstileFormData.append('secret', env.TURNSTILE_SECRET_KEY)
    turnstileFormData.append('response', turnstileToken)

    const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: turnstileFormData,
    })

    const turnstileResult = await turnstileRes.json()

    if (!turnstileResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'CAPTCHA_FAILED',
            message: 'Verificación de seguridad fallida. Intenta nuevamente.',
          },
        },
        { status: 400 },
      )
    }

    // Save to database
    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        clientName,
        clientEmail,
        clientPhone,
        projectType,
        otherType: otherType || null,
        description,
      },
    })

    // Send notification email (non-blocking)
    sendNotificationEmail(clientName, clientEmail, clientPhone, projectType, description).catch(
      (err) => {
        console.error('Failed to send notification email:', err)
      },
    )

    return NextResponse.json(
      {
        success: true,
        data: { id: serviceRequest.id },
      },
      {
        status: 201,
        headers: {
          'X-RateLimit-Remaining': String(remaining),
        },
      },
    )
  } catch (error) {
    console.error('Contact error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Error interno del servidor',
        },
      },
      { status: 500 },
    )
  }
}
