'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ChoiceOption } from '@/lib/tax/types'

export function ChoiceCard({
  option,
  selected,
  multi = false,
  onSelect,
  name,
}: {
  option: ChoiceOption
  selected: boolean
  multi?: boolean
  onSelect: (value: string) => void
  name: string
}) {
  return (
    <label
      className={cn(
        'group relative flex cursor-pointer items-start gap-3 rounded-xl border bg-card p-4 transition-all',
        'hover:border-border-strong hover:shadow-card',
        'has-focus-visible:ring-3 has-focus-visible:ring-ring/40',
        selected ? 'border-primary bg-accent/60 shadow-card' : 'border-border',
      )}
    >
      <input
        type={multi ? 'checkbox' : 'radio'}
        name={name}
        value={option.value}
        checked={selected}
        onChange={() => onSelect(option.value)}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          'mt-0.5 flex size-5 shrink-0 items-center justify-center border transition-colors',
          multi ? 'rounded-md' : 'rounded-full',
          selected ? 'border-primary bg-primary' : 'border-border-strong bg-background',
        )}
      >
        {selected &&
          (multi ? (
            <Check className="size-3.5 text-primary-foreground" strokeWidth={3} />
          ) : (
            <span className="size-2 rounded-full bg-primary-foreground" />
          ))}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="leading-6 font-medium text-pretty">{option.label}</span>
        {option.german && <span className="text-sm text-muted-foreground">{option.german}</span>}
        {option.hint && (
          <span className="text-sm leading-relaxed text-muted-foreground text-pretty">
            {option.hint}
          </span>
        )}
      </span>
    </label>
  )
}

export function MultiChoiceGrid({
  options,
  values,
  onToggle,
  name,
}: {
  options: ChoiceOption[]
  values: string[]
  onToggle: (value: string) => void
  name: string
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => (
        <ChoiceCard
          key={option.value}
          option={option}
          multi
          name={name}
          selected={values.includes(option.value)}
          onSelect={onToggle}
        />
      ))}
    </div>
  )
}

export function SingleChoiceList({
  options,
  value,
  onSelect,
  name,
}: {
  options: ChoiceOption[]
  value?: string
  onSelect: (value: string) => void
  name: string
}) {
  return (
    <div className="grid gap-3">
      {options.map((option) => (
        <ChoiceCard
          key={option.value}
          option={option}
          name={name}
          selected={value === option.value}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
