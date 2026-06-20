'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormValues } from '@mitzustudios/shared'
import { useTranslations } from '@/hooks/useTranslations'
import { cn } from '@/lib/utils'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function LoginForm() {
  const router = useRouter()
  const t = useTranslations()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
          className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.nav.hero}
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">{t.admin.login.title}</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              {t.admin.login.email}
            </label>
            <input
              id="email"
              type="email"
              placeholder={t.admin.login.emailPlaceholder}
              {...register('email')}
              className={cn(
                'bg-card w-full rounded-lg border px-4 py-2.5 text-sm transition-colors',
                'focus:ring-ring focus:outline-none focus:ring-2',
                errors.email ? 'border-destructive' : 'border-input',
              )}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-destructive mt-1.5 text-xs">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              {t.admin.login.password}
            </label>
            <input
              id="password"
              type="password"
              placeholder={t.admin.login.passwordPlaceholder}
              {...register('password')}
              className={cn(
                'bg-card w-full rounded-lg border px-4 py-2.5 text-sm transition-colors',
                'focus:ring-ring focus:outline-none focus:ring-2',
                errors.password ? 'border-destructive' : 'border-input',
              )}
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-destructive mt-1.5 text-xs">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <div className="border-destructive/50 bg-destructive/10 text-destructive flex items-start gap-2 rounded-lg border p-3 text-sm">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={cn(
              'w-full rounded-lg px-6 py-3 text-sm font-semibold transition-all',
              loading
                ? 'bg-primary/50 cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:bg-primary/90',
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
