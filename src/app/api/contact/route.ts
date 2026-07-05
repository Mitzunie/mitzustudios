import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { contactSchema } from '@/shared'
import { contactLimiter, zeroBounceLimiter } from '@/lib/rate-limit'
import { sendNotificationEmail } from '@/lib/resend'
import { env } from '@/lib/env'

async function verifyZeroBounce(email: string): Promise<{ valid: boolean; error?: string }> {
  const monthly = zeroBounceLimiter.check()
  if (!monthly.allowed) {
    return { valid: false, error: 'Límite mensual de verificaciones alcanzado. Intenta el próximo mes.' }
  }

  if (!env.ZEROBOUNCE_API_KEY) {
    return { valid: true }
  }

  try {
    const url = new URL('https://api.zerobounce.net/v2/validate')
    url.searchParams.set('api_key', env.ZEROBOUNCE_API_KEY)
    url.searchParams.set('email', email)

    const res = await fetch(url.toString(), { next: { revalidate: 0 } })
    if (!res.ok) {
      console.error('ZeroBounce API error:', res.status)
      return { valid: true }
    }

    const data = await res.json()
    if (data.status === 'Invalid') {
      return { valid: false, error: 'El correo electrónico no es válido o no existe.' }
    }

    return { valid: true }
  } catch (error) {
    console.error('ZeroBounce request failed:', error)
    return { valid: true }
  }
}

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

    // Verify email with ZeroBounce
    const zbResult = await verifyZeroBounce(clientEmail)

    if (!zbResult.valid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_EMAIL',
            message: zbResult.error || 'El correo electrónico no es válido.',
            field: 'clientEmail',
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
