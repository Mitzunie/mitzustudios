import { Suspense } from 'react'
import Link from 'next/link'

function NotFoundContent() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="gradient-text mb-4 text-6xl font-bold">404</h1>
      <h2 className="mb-2 text-2xl font-semibold">Página no encontrada</h2>
      <p className="text-muted-foreground mb-8">La página que buscas no existe o fue movida.</p>
      <Link
        href="/"
        className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  )
}

export default function NotFound() {
  return (
    <Suspense fallback={<div className="bg-background flex min-h-screen items-center justify-center"><div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" /></div>}>
      <NotFoundContent />
    </Suspense>
  )
}
