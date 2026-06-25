'use client'

import dynamic from 'next/dynamic'

const MDPreview = dynamic(() => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown), {
  ssr: false,
  loading: () => <div className="animate-pulse h-40 bg-muted rounded" />,
})

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div data-color-mode="dark" className="md-renderer">
      <MDPreview source={content} />
    </div>
  )
}
