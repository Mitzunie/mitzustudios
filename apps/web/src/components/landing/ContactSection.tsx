'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send, CheckCircle2, AlertCircle } from 'lucide-react'
import {
  contactSchema,
  PROJECT_TYPES,
  PROJECT_TYPE_LABELS,
  type ContactFormValues,
} from '@mitzustudios/shared'
import { useTranslations } from '@/hooks/useTranslations'
import { SectionAnimation } from '@/components/shared/SectionAnimation'
import { cn } from '@/lib/utils'

export function ContactSection() {
  const t = useTranslations()
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
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

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitState('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        if (res.status === 429) {
          setErrorMessage('Demasiadas solicitudes. Intenta de nuevo en un minuto.')
        } else {
          setErrorMessage(body.error?.message || t.contact.form.error)
        }
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
      setSubmitState('error')
    }
  }

  if (submitState === 'success') {
    return (
      <section id="contact" className="border-border/50 border-t py-24">
        <div className="container-custom mx-auto px-4">
          <SectionAnimation animation="fadeIn">
            <div className="mx-auto max-w-lg text-center">
              <div className="bg-primary/10 text-primary mb-6 inline-flex rounded-full p-4">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="mb-4 text-2xl font-bold">{t.contact.form.success}</h2>
              <p className="text-muted-foreground">{t.contact.form.quoteMessage}</p>
              <button
                onClick={() => setSubmitState('idle')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 mt-8 rounded-lg px-6 py-2 text-sm font-medium transition-colors"
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
    <section id="contact" className="border-border/50 border-t py-24">
      <div className="container-custom mx-auto px-4">
        <SectionAnimation animation="fadeIn">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{t.contact.title}</h2>
            <p className="text-muted-foreground text-lg">{t.contact.subtitle}</p>
          </div>
        </SectionAnimation>

        <SectionAnimation animation="fadeIn" threshold={0.3}>
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
                  'bg-card w-full rounded-lg border px-4 py-2.5 text-sm transition-colors',
                  'placeholder:text-muted-foreground/50',
                  'focus:ring-ring focus:outline-none focus:ring-2',
                  errors.clientName ? 'border-destructive' : 'border-input',
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
                  'bg-card w-full rounded-lg border px-4 py-2.5 text-sm transition-colors',
                  'placeholder:text-muted-foreground/50',
                  'focus:ring-ring focus:outline-none focus:ring-2',
                  errors.clientEmail ? 'border-destructive' : 'border-input',
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
                  'bg-card w-full rounded-lg border px-4 py-2.5 text-sm transition-colors',
                  'placeholder:text-muted-foreground/50',
                  'focus:ring-ring focus:outline-none focus:ring-2',
                  errors.clientPhone ? 'border-destructive' : 'border-input',
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
                  'bg-card w-full rounded-lg border px-4 py-2.5 text-sm transition-colors',
                  'focus:ring-ring focus:outline-none focus:ring-2',
                  errors.projectType ? 'border-destructive' : 'border-input',
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
                    'bg-card w-full rounded-lg border px-4 py-2.5 text-sm transition-colors',
                    'placeholder:text-muted-foreground/50',
                    'focus:ring-ring focus:outline-none focus:ring-2',
                    errors.otherType ? 'border-destructive' : 'border-input',
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
                  'bg-card w-full resize-y rounded-lg border px-4 py-2.5 text-sm transition-colors',
                  'placeholder:text-muted-foreground/50',
                  'focus:ring-ring focus:outline-none focus:ring-2',
                  errors.description ? 'border-destructive' : 'border-input',
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

            {/* Error message */}
            {submitState === 'error' && (
              <div className="border-destructive/50 bg-destructive/10 text-destructive flex items-start gap-2 rounded-lg border p-3 text-sm">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{errorMessage || t.contact.form.error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitState === 'loading'}
              className={cn(
                'inline-flex w-full items-center justify-center gap-2 rounded-lg px-8 py-3 text-base font-semibold transition-all',
                'focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2',
                submitState === 'loading'
                  ? 'bg-primary/50 cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/25 hover:shadow-lg',
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
