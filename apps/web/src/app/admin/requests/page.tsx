'use client'

import { useTranslations } from '@/hooks/useTranslations'
import { RequestsList } from '@/components/admin/RequestsList'

export default function AdminRequestsPage() {
  const t = useTranslations()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-black uppercase tracking-wide">{t.admin.requests.title}</h1>
      <RequestsList />
    </div>
  )
}
