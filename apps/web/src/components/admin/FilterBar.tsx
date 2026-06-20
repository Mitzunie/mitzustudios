'use client'

import { cn } from '@/lib/utils'

interface FilterOption {
  value: string
  label: string
}

interface FilterBarProps {
  options: FilterOption[]
  activeFilter: string
  onFilterChange: (value: string) => void
}

export function FilterBar({ options, activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onFilterChange(option.value)}
          className={cn(
            'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
            activeFilter === option.value
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
