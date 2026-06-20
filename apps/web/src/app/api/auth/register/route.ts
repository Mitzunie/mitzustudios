import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@mitzustudios/db'
import { registerSchema } from '@mitzustudios/shared'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)

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

    const { name, email, password } = parsed.data
    const normalizedEmail = email.toLowerCase().trim()

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'CONFLICT',
            message: 'Ya existe una cuenta con este email',
          },
        },
        { status: 409 },
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: passwordHash,
      },
    })

    return NextResponse.json({ success: true, data: null }, { status: 201 })
  } catch (error) {
    console.error('Register error:', error)
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
