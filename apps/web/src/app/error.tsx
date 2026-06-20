'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="gradient-text mb-4 text-6xl font-bold">500</h1>
      <h2 className="mb-2 text-2xl font-semibold">Error del servidor</h2>
      <p className="text-muted-foreground mb-8">
        Ocurrió un error inesperado. Por favor, intenta nuevamente más tarde.
      </p>
      <button
        onClick={reset}
        className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-colors"
      >
        Reintentar
      </button>
    </div>
  )
}
