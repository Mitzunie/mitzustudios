'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import type { ServiceRequestDTO, ResponseDTO } from '@/shared'
import { useTranslations } from '@/hooks/useTranslations'
import { RequestDetailCard } from '@/components/admin/RequestDetailCard'
import { ResponseForm } from '@/components/admin/ResponseForm'
import { StatusBadge } from '@/components/admin/StatusBadge'

export default function AdminRequestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const t = useTranslations()
  const [request, setRequest] = useState<ServiceRequestDTO | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchRequest = async () => {
    try {
      const res = await fetch(`/api/admin/requests/${params.id}`)
      if (!res.ok) throw new Error('Not found')
      const data = await res.json()
      if (data.success) {
        setRequest(data.data)
      }
    } catch {
      // Handle error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequest()
  }, [params.id])

  const handleToggleStatus = async () => {
    if (!request) return
    const newStatus = request.status === 'UNREAD' ? 'READ' : 'UNREAD'
    try {
      const res = await fetch(`/api/admin/requests/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        fetchRequest()
      }
    } catch (error) {
      console.error('Error toggling status:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="neo-border border-primary h-8 w-8 animate-spin border-4 border-t-transparent bg-transparent" />
      </div>
    )
  }

  if (!request) {
    return <div className="text-muted-foreground py-20 text-center font-bold uppercase tracking-wide">Solicitud no encontrada</div>
  }

  return (
    <div>
      <button
        onClick={() => router.push('/admin/requests')}
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.admin.requests.title}
      </button>

      <h1 className="mb-6 text-2xl font-black uppercase tracking-wide">{t.admin.requests.detail.title}</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <RequestDetailCard request={request} onToggleStatus={handleToggleStatus} />

          {/* Previous responses */}
          {request.responses.length > 0 && (
            <div className="neo-card bg-card p-6">
              <h2 className="mb-4 text-lg font-black uppercase tracking-wide">{t.admin.requests.detail.responses}</h2>
              <div className="space-y-4">
                {request.responses.map((response: ResponseDTO) => (
                  <div
                    key={response.id}
                    className="neo-border bg-background p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <StatusBadge
                        status={response.channel === 'WHATSAPP' ? 'ANSWERED' : 'READ'}
                        variant="request"
                      />
                      <span className="text-muted-foreground text-xs font-bold">
                        {new Date(response.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm font-bold uppercase tracking-wide">{response.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {request.responses.length === 0 && (
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-wide">{t.admin.requests.detail.noResponses}</p>
          )}
        </div>

        {/* Response form */}
        <div>
          <ResponseForm
            requestId={request.id}
            clientPhone={request.clientPhone}
            clientEmail={request.clientEmail}
            onResponseSent={fetchRequest}
          />
        </div>
      </div>
    </div>
  )
}
