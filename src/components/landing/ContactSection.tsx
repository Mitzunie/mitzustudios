'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { Send, CheckCircle2, AlertCircle } from 'lucide-react'
import {
  contactFormSchema,
  PROJECT_TYPES,
  PROJECT_TYPE_LABELS,
  type ContactFormValues,
} from '@/shared'
import { useTranslations } from '@/hooks/useTranslations'
import { SectionAnimation } from '@/components/shared/SectionAnimation'
import { cn } from '@/lib/utils'

export function ContactSection() {
  const t = useTranslations()
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileRef, setTurnstileRef] = useState<TurnstileInstance | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      projectType: 'landing',
      otherType: '',
      description: '',
    },
  })

  const selectedType = watch('projectType')

  const handleTurnstileSuccess = useCallback((token: string) => {
    setTurnstileToken(token)
  }, [])

  const handleTurnstileRef = useCallback((ref: TurnstileInstance | null) => {
    setTurnstileRef(ref)
  }, [])

  const onSubmit = async (data: ContactFormValues) => {
    if (!turnstileToken) {
      setErrorMessage('Completa la verificación de seguridad.')
      return
    }

    setSubmitState('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, turnstileToken }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        if (res.status === 429) {
          setErrorMessage('Demasiadas solicitudes. Intenta de nuevo en un minuto.')
        } else {
          setErrorMessage(body.error?.message || t.contact.form.error)
        }
        turnstileRef?.reset()
        setTurnstileToken(null)
        setSubmitState('error')
        return
      }

      setSubmitState('success')
      reset()

      // GA4 event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        ;(window as any).gtag('event', 'contact_form_submit', {
          project_type: data.projectType,
        })
      }
    } catch {
      setErrorMessage(t.contact.form.error)
      turnstileRef?.reset()
      setTurnstileToken(null)
      setSubmitState('error')
    }
  }

  if (submitState === 'success') {
    return (
      <section id="contact" className="neo-border py-24">
        <div className="container-custom mx-auto px-4">
          <SectionAnimation animation="fadeIn">
            <div className="mx-auto max-w-lg text-center">
              <div className="bg-primary text-primary-foreground neo-border mx-auto mb-6 inline-flex p-4">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="mb-4 text-2xl font-black tracking-wide uppercase">
                {t.contact.form.success}
              </h2>
              <p className="text-muted-foreground font-bold tracking-wide uppercase">
                {t.contact.form.quoteMessage}
              </p>
              <button
                onClick={() => setSubmitState('idle')}
                className="neo-button neo-button-primary neo-shadow-sm mt-8 px-6 py-2 text-sm"
              >
                Enviar otra solicitud
              </button>
            </div>
          </SectionAnimation>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="neo-border py-24">
      <div className="container-custom mx-auto px-4">
        <SectionAnimation animation="fadeIn">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="neo-section-title mb-4">{t.contact.title}</h2>
            <p className="text-muted-foreground text-lg font-bold tracking-wide uppercase">
              {t.contact.subtitle}
            </p>
          </div>
        </SectionAnimation>

        <SectionAnimation animation="fadeIn" threshold={0.3} delay={0.1}>
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-xl space-y-6" noValidate>
            {/* Name */}
            <div>
              <label htmlFor="clientName" className="mb-2 block text-sm font-medium">
                {t.contact.form.name} <span className="text-destructive">*</span>
              </label>
              <input
                id="clientName"
                type="text"
                placeholder={t.contact.form.namePlaceholder}
                {...register('clientName')}
                className={cn(
                  'neo-input w-full px-4 py-2.5 text-sm font-bold tracking-wide uppercase',
                  'placeholder:text-muted-foreground/50',
                  errors.clientName ? 'border-destructive' : '',
                )}
                aria-invalid={!!errors.clientName}
                aria-describedby={errors.clientName ? 'clientName-error' : undefined}
              />
              {errors.clientName && (
                <p id="clientName-error" className="text-destructive mt-1.5 text-xs">
                  {errors.clientName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="clientEmail" className="mb-2 block text-sm font-medium">
                {t.contact.form.email} <span className="text-destructive">*</span>
              </label>
              <input
                id="clientEmail"
                type="email"
                placeholder={t.contact.form.emailPlaceholder}
                {...register('clientEmail')}
                className={cn(
                  'neo-input w-full px-4 py-2.5 text-sm font-bold tracking-wide uppercase',
                  'placeholder:text-muted-foreground/50',
                  errors.clientEmail ? 'border-destructive' : '',
                )}
                aria-invalid={!!errors.clientEmail}
                aria-describedby={errors.clientEmail ? 'clientEmail-error' : undefined}
              />
              {errors.clientEmail && (
                <p id="clientEmail-error" className="text-destructive mt-1.5 text-xs">
                  {errors.clientEmail.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="clientPhone" className="mb-2 block text-sm font-medium">
                {t.contact.form.phone} <span className="text-destructive">*</span>
              </label>
              <input
                id="clientPhone"
                type="tel"
                placeholder={t.contact.form.phonePlaceholder}
                {...register('clientPhone')}
                className={cn(
                  'neo-input w-full px-4 py-2.5 text-sm font-bold tracking-wide uppercase',
                  'placeholder:text-muted-foreground/50',
                  errors.clientPhone ? 'border-destructive' : '',
                )}
                aria-invalid={!!errors.clientPhone}
                aria-describedby={errors.clientPhone ? 'clientPhone-error' : undefined}
              />
              {errors.clientPhone && (
                <p id="clientPhone-error" className="text-destructive mt-1.5 text-xs">
                  {errors.clientPhone.message}
                </p>
              )}
            </div>

            {/* Project Type */}
            <div>
              <label htmlFor="projectType" className="mb-2 block text-sm font-medium">
                {t.contact.form.projectType} <span className="text-destructive">*</span>
              </label>
              <select
                id="projectType"
                {...register('projectType')}
                className={cn(
                  'neo-input w-full px-4 py-2.5 text-sm font-bold tracking-wide uppercase',
                  errors.projectType ? 'border-destructive' : '',
                )}
                aria-invalid={!!errors.projectType}
              >
                {PROJECT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {PROJECT_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
              {errors.projectType && (
                <p className="text-destructive mt-1.5 text-xs">{errors.projectType.message}</p>
              )}
            </div>

            {/* Other type (conditional) */}
            {selectedType === 'other' && (
              <div>
                <label htmlFor="otherType" className="mb-2 block text-sm font-medium">
                  {t.contact.form.otherType} <span className="text-destructive">*</span>
                </label>
                <input
                  id="otherType"
                  type="text"
                  placeholder={t.contact.form.otherTypePlaceholder}
                  {...register('otherType')}
                  className={cn(
                    'neo-input w-full px-4 py-2.5 text-sm font-bold tracking-wide uppercase',
                    'placeholder:text-muted-foreground/50',
                    errors.otherType ? 'border-destructive' : '',
                  )}
                  aria-invalid={!!errors.otherType}
                />
                {errors.otherType && (
                  <p className="text-destructive mt-1.5 text-xs">{errors.otherType.message}</p>
                )}
              </div>
            )}

            {/* Description */}
            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-medium">
                {t.contact.form.description} <span className="text-destructive">*</span>
              </label>
              <textarea
                id="description"
                rows={5}
                placeholder={t.contact.form.descriptionPlaceholder}
                {...register('description')}
                className={cn(
                  'neo-input w-full resize-y px-4 py-2.5 text-sm font-bold tracking-wide uppercase',
                  'placeholder:text-muted-foreground/50',
                  errors.description ? 'border-destructive' : '',
                )}
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? 'description-error' : undefined}
              />
              {errors.description && (
                <p id="description-error" className="text-destructive mt-1.5 text-xs">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Turnstile */}
            <div className="flex justify-center">
              <Turnstile
                ref={handleTurnstileRef}
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                onSuccess={handleTurnstileSuccess}
                options={{
                  theme: 'light',
                }}
              />
            </div>

            {/* Error message */}
            {submitState === 'error' && (
              <div className="neo-border border-destructive bg-destructive/10 text-destructive flex items-start gap-2 p-3 text-sm font-bold">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{errorMessage || t.contact.form.error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitState === 'loading'}
              className={cn(
                'neo-button neo-button-primary neo-shadow-sm inline-flex w-full items-center justify-center gap-2 px-8 py-3 text-base',
                submitState === 'loading' ? 'cursor-not-allowed opacity-60' : '',
              )}
            >
              {submitState === 'loading' ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {t.contact.form.submitting}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {t.contact.form.submit}
                </>
              )}
            </button>
          </form>
        </SectionAnimation>
      </div>
    </section>
  )
}
