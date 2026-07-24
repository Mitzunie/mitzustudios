type DataLayerEvent = {
  event: string
  [key: string]: unknown
}

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[]
  }
}

/**
 * Pushes a custom event to the GTM dataLayer so it can be read by any
 * GTM trigger/tag. Use this instead of calling `window.gtag(...)` directly.
 */
export function trackEvent(name: string, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event: name, ...properties })
}
