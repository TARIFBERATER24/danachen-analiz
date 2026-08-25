'use client'

import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

const inputClasses =
  'h-13 w-full rounded-xl border border-input bg-card px-4 text-base outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/30'

export function Counter({
  value,
  onChange,
  min = 1,
  max = 10,
  label,
}: {
  value: number | undefined
  onChange: (value: number) => void
  min?: number
  max?: number
  label: string
}) {
  const current = value ?? min
  return (
    <div className="flex items-center gap-5 rounded-xl border border-border bg-card p-4">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, current - 1))}
        disabled={current <= min}
        aria-label="Намали"
        className="flex size-12 items-center justify-center rounded-xl border border-border bg-background transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40 disabled:opacity-40"
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <div className="flex flex-1 flex-col items-center">
        <span className="font-mono text-3xl font-semibold tabular" aria-live="polite">
          {value ?? '—'}
        </span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, (value ?? min - 1) + 1))}
        disabled={current >= max && value !== undefined}
        aria-label="Увеличи"
        className="flex size-12 items-center justify-center rounded-xl border border-border bg-background transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40 disabled:opacity-40"
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}

export function NumberField({
  id,
  value,
  onChange,
  unit,
  placeholder,
  min,
  max,
  label,
  error,
}: {
  id: string
  value: number | undefined
  onChange: (value: number | undefined) => void
  unit?: string
  placeholder?: string
  min?: number
  max?: number
  label?: string
  error?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          placeholder={placeholder}
          value={value ?? ''}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(event) => {
            const raw = event.target.value
            onChange(raw === '' ? undefined : Number(raw))
          }}
          className={cn(inputClasses, unit && 'pr-16', error && 'border-destructive')}
        />
        {unit && (
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-medium text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

export function TextField({
  id,
  value,
  onChange,
  placeholder,
  label,
}: {
  id: string
  value: string | undefined
  onChange: (value: string) => void
  placeholder?: string
  label: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={inputClasses}
      />
    </div>
  )
}
