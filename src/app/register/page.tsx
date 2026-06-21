'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterFormValues } from '@/shared'
import { useTranslations } from '@/hooks/useTranslations'
import { cn } from '@/lib/utils'
import { CheckCircle2, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
  const t = useTranslations()
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
          className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        {submitState === 'success' ? (
          <div className="text-center">
            <div className="bg-primary neo-border text-primary-foreground mb-6 inline-flex p-4">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h1 className="mb-4 text-2xl font-black uppercase tracking-wide">{t.admin.register.success}</h1>
            <Link
              href="/admin/login"
              className="neo-button neo-button-primary neo-shadow-sm inline-flex items-center gap-2 px-6 py-3 text-sm"
            >
              {t.admin.login.submit}
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-black uppercase tracking-wide">{t.admin.register.title}</h1>
              <p className="text-muted-foreground mt-2 text-sm font-bold uppercase tracking-wide">{t.admin.register.subtitle}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-black uppercase tracking-wide">
                  {t.admin.register.name} <span className="text-destructive">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder={t.admin.register.namePlaceholder}
                  {...register('name')}
                  className={cn(
                    'neo-input w-full px-4 py-2.5 text-sm font-bold uppercase tracking-wide',
                    errors.name ? 'border-destructive' : '',
                  )}
                />
                {errors.name && (
                  <p className="text-destructive mt-1.5 text-xs font-bold uppercase">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-black uppercase tracking-wide">
                  {t.admin.register.email} <span className="text-destructive">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder={t.admin.register.emailPlaceholder}
                  {...register('email')}
                  className={cn(
                    'neo-input w-full px-4 py-2.5 text-sm font-bold uppercase tracking-wide',
                    errors.email ? 'border-destructive' : '',
                  )}
                />
                {errors.email && (
                  <p className="text-destructive mt-1.5 text-xs font-bold uppercase">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-black uppercase tracking-wide">
                  {t.admin.register.password} <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t.admin.register.passwordPlaceholder}
                    {...register('password')}
                    className={cn(
                      'neo-input w-full px-4 py-2.5 pr-10 text-sm font-bold uppercase tracking-wide',
                      errors.password ? 'border-destructive' : '',
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-destructive mt-1.5 text-xs font-bold uppercase">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-black uppercase tracking-wide">
                  {t.admin.register.confirmPassword} <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={t.admin.register.confirmPasswordPlaceholder}
                    {...register('confirmPassword')}
                    className={cn(
                      'neo-input w-full px-4 py-2.5 pr-10 text-sm font-bold uppercase tracking-wide',
                      errors.confirmPassword ? 'border-destructive' : '',
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-destructive mt-1.5 text-xs font-bold uppercase">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {submitState === 'error' && (
                <div className="neo-border border-destructive bg-destructive/10 text-destructive flex items-start gap-2 p-3 text-sm font-bold">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitState === 'loading'}
                className={cn(
                  'neo-button neo-button-primary neo-shadow-sm w-full px-6 py-3 text-sm',
                  submitState === 'loading' ? 'cursor-not-allowed opacity-60' : '',
                )}
              >
                {submitState === 'loading' ? (
                  <span className="inline-flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin border-2 border-current border-t-transparent" />
                    {t.admin.register.submitting}
                  </span>
                ) : (
                  t.admin.register.submit
                )}
              </button>
            </form>

            <p className="text-muted-foreground mt-6 text-center text-sm font-bold uppercase tracking-wide">
              ¿Ya tienes cuenta?{' '}
              <Link
                href="/admin/login"
                className="text-primary hover:text-primary/80 font-black transition-colors"
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
