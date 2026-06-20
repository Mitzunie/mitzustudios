'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterFormValues } from '@mitzustudios/shared'
import { useTranslations } from '@/hooks/useTranslations'
import { cn } from '@/lib/utils'
import { CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
  const t = useTranslations()
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setSubmitState('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      })

      const body = await res.json()

      if (!res.ok) {
        setErrorMessage(body.error?.message || t.admin.register.error)
        setSubmitState('error')
        return
      }

      setSubmitState('success')
    } catch {
      setErrorMessage(t.admin.register.error)
      setSubmitState('error')
    }
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        {submitState === 'success' ? (
          <div className="text-center">
            <div className="bg-primary/10 text-primary mb-6 inline-flex rounded-full p-4">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h1 className="mb-4 text-2xl font-bold">{t.admin.register.success}</h1>
            <Link
              href="/admin/login"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-colors"
            >
              {t.admin.login.submit}
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold">{t.admin.register.title}</h1>
              <p className="text-muted-foreground mt-2 text-sm">{t.admin.register.subtitle}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                  {t.admin.register.name} <span className="text-destructive">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder={t.admin.register.namePlaceholder}
                  {...register('name')}
                  className={cn(
                    'bg-card w-full rounded-lg border px-4 py-2.5 text-sm transition-colors',
                    'focus:ring-ring focus:outline-none focus:ring-2',
                    errors.name ? 'border-destructive' : 'border-input',
                  )}
                />
                {errors.name && (
                  <p className="text-destructive mt-1.5 text-xs">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium">
                  {t.admin.register.email} <span className="text-destructive">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder={t.admin.register.emailPlaceholder}
                  {...register('email')}
                  className={cn(
                    'bg-card w-full rounded-lg border px-4 py-2.5 text-sm transition-colors',
                    'focus:ring-ring focus:outline-none focus:ring-2',
                    errors.email ? 'border-destructive' : 'border-input',
                  )}
                />
                {errors.email && (
                  <p className="text-destructive mt-1.5 text-xs">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium">
                  {t.admin.register.password} <span className="text-destructive">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder={t.admin.register.passwordPlaceholder}
                  {...register('password')}
                  className={cn(
                    'bg-card w-full rounded-lg border px-4 py-2.5 text-sm transition-colors',
                    'focus:ring-ring focus:outline-none focus:ring-2',
                    errors.password ? 'border-destructive' : 'border-input',
                  )}
                />
                {errors.password && (
                  <p className="text-destructive mt-1.5 text-xs">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium">
                  {t.admin.register.confirmPassword} <span className="text-destructive">*</span>
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder={t.admin.register.confirmPasswordPlaceholder}
                  {...register('confirmPassword')}
                  className={cn(
                    'bg-card w-full rounded-lg border px-4 py-2.5 text-sm transition-colors',
                    'focus:ring-ring focus:outline-none focus:ring-2',
                    errors.confirmPassword ? 'border-destructive' : 'border-input',
                  )}
                />
                {errors.confirmPassword && (
                  <p className="text-destructive mt-1.5 text-xs">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {submitState === 'error' && (
                <div className="border-destructive/50 bg-destructive/10 text-destructive flex items-start gap-2 rounded-lg border p-3 text-sm">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitState === 'loading'}
                className={cn(
                  'w-full rounded-lg px-6 py-3 text-sm font-semibold transition-all',
                  submitState === 'loading'
                    ? 'bg-primary/50 cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90',
                )}
              >
                {submitState === 'loading' ? (
                  <span className="inline-flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {t.admin.register.submitting}
                  </span>
                ) : (
                  t.admin.register.submit
                )}
              </button>
            </form>

            <p className="text-muted-foreground mt-6 text-center text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link
                href="/admin/login"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {t.admin.login.submit}
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
