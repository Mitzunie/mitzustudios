'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormValues } from '@/shared'
import { useTranslations } from '@/hooks/useTranslations'
import { cn } from '@/lib/utils'
import { AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export function LoginForm() {
  const router = useRouter()
  const t = useTranslations()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError(t.admin.login.error)
        setLoading(false)
        return
      }

      router.push('/admin/dashboard')
      router.refresh()
    } catch {
      setError(t.admin.login.error)
      setLoading(false)
    }
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.nav.hero}
        </Link>

        <div className="neo-card bg-card mb-8 p-6 text-center">
          <h1 className="text-2xl font-black uppercase tracking-wide">{t.admin.login.title}</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-bold uppercase tracking-wide">
              {t.admin.login.email}
            </label>
            <input
              id="email"
              type="email"
              placeholder={t.admin.login.emailPlaceholder}
              {...register('email')}
              className={cn(
                'neo-input w-full px-4 py-2.5 text-sm font-bold uppercase tracking-wide',
                errors.email ? 'border-destructive' : '',
              )}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-destructive mt-1.5 text-xs font-bold uppercase">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-bold uppercase tracking-wide">
              {t.admin.login.password}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t.admin.login.passwordPlaceholder}
                {...register('password')}
                className={cn(
                  'neo-input w-full px-4 py-2.5 pr-10 text-sm font-bold uppercase tracking-wide',
                  errors.password ? 'border-destructive' : '',
                )}
                autoComplete="current-password"
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

          {error && (
            <div className="neo-border border-destructive bg-destructive/10 text-destructive flex items-start gap-2 p-3 text-sm font-bold">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={cn(
              'neo-button neo-button-primary neo-shadow-sm w-full px-6 py-3 text-sm',
              loading ? 'cursor-not-allowed opacity-60' : '',
            )}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {t.admin.login.submitting}
              </span>
            ) : (
              t.admin.login.submit
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
