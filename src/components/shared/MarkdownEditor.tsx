'use client'

import dynamic from 'next/dynamic'
import type { MDEditorProps } from '@uiw/react-md-editor'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface MarkdownEditorProps extends Omit<MDEditorProps, 'onChange'> {
  value: string
  onChange: (value: string) => void
  minHeight?: number
  label?: string
}

export function MarkdownEditor({
  value,
  onChange,
  minHeight = 300,
  label,
  ...props
}: MarkdownEditorProps) {
  return (
    <div data-color-mode="dark">
      {label && (
        <label className="mb-2 block text-sm font-black uppercase tracking-wide">{label}</label>
      )}
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        minHeight={minHeight}
        preview="live"
        {...props}
      />
    </div>
  )
}
