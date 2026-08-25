'use client'

import { useState } from 'react'
import { ArrowRight, Check, ChevronRight, Lock, ShieldCheck, Sparkle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AreaIcon, Badge, ProgressBar } from './primitives'
import type { DocumentItem, RelevantArea } from '@/lib/tax/analysis'

export function TaxResultHero({ areaCount }: { areaCount: number }) {
  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
      <Badge tone="accent">
        <Sparkle className="size-3" aria-hidden="true" />
        Първоначална ориентация • 2025
      </Badge>
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl leading-snug font-semibold tracking-tight text-balance sm:text-3xl">
          Има признаци, че подаването на данъчна декларация може да си струва.
        </h2>
        <p className="max-w-2xl leading-relaxed text-muted-foreground text-pretty">
          Открихме няколко области, които могат да повлияят на крайния ти данъчен резултат.
        </p>
      </div>
      <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-5">
        <div className="flex flex-col">
          <span className="font-mono text-2xl font-semibold tabular">{areaCount}</span>
          <span className="text-sm text-muted-foreground">области за проверка</span>
        </div>
        <div className="flex flex-col">
          <span className="font-mono text-2xl font-semibold tabular">2025</span>
          <span className="text-sm text-muted-foreground">данъчна година</span>
        </div>
        <div className="flex flex-col">
          <span className="font-mono text-2xl font-semibold tabular">8/8</span>
          <span className="text-sm text-muted-foreground">попълнени стъпки</span>
        </div>
      </div>
    </section>
  )
}

export function PotentialRefundCard() {
  const [showDemo, setShowDemo] = useState(false)

  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight">Потенциал за възстановяване</h3>
        <Badge>
          <Lock className="size-3" aria-hidden="true" />
          Заключено
        </Badge>
      </div>

      {showDemo ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-end gap-3">
            <span className="font-mono text-4xl font-semibold tracking-tight tabular text-foreground/70">
              640 – 1 180 €
            </span>
          </div>
          <Badge tone="demo">Демо пример — не е реално изчисление</Badge>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Тази стойност е поставена само за да покаже как ще изглежда интерфейсът. Тя не се
            основава на твоите отговори.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <span className="font-mono text-4xl font-semibold tracking-tight text-foreground/25">
            •  •  •  €
          </span>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground text-pretty">
            Изчислението ще бъде налично след обработване на необходимите данни. В момента липсват
            част от документите и потвърждения, които влияят на резултата.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
        <button
          type="button"
          onClick={() => setShowDemo((value) => !value)}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          {showDemo ? 'Скрий демо примера' : 'Покажи демо пример'}
        </button>
        <p className="text-xs text-muted-foreground">
          Не даваме обещания за размер на възстановяване.
        </p>
      </div>
    </section>
  )
}

export function RelevantAreaCard({ area }: { area: RelevantArea }) {
  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent">
          <AreaIcon icon={area.icon} />
        </span>
        <div className="flex min-w-0 flex-col">
          <h4 className="leading-6 font-semibold text-pretty">{area.title}</h4>
          {area.german && <p className="text-sm text-muted-foreground">{area.german}</p>}
        </div>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{area.description}</p>
      <Badge className="w-fit">За допълнителна проверка</Badge>
    </li>
  )
}

export function DocumentReadiness({
  available,
  missing,
  onAddMissing,
}: {
  available: DocumentItem[]
  missing: DocumentItem[]
  onAddMissing: () => void
}) {
  const total = available.length + missing.length
  const percent = total === 0 ? 0 : (available.length / total) * 100

  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight">Готовност на документите</h3>
        <p className="font-mono text-sm tabular text-muted-foreground">
          {available.length} / {total} документа
        </p>
      </div>

      <ProgressBar value={percent} />

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium">Налични</p>
          <ul className="flex flex-col gap-2">
            {available.map((item) => (
              <li key={item.id} className="flex items-start gap-2.5 text-sm">
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-success-muted">
                  <Check className="size-2.5 text-success" strokeWidth={3} aria-hidden="true" />
                </span>
                <span className="flex flex-col">
                  <span className="leading-5">{item.label}</span>
                  {item.german && (
                    <span className="text-xs text-muted-foreground">{item.german}</span>
                  )}
                </span>
              </li>
            ))}
            {available.length === 0 && (
              <li className="text-sm text-muted-foreground">Все още няма налични документи.</li>
            )}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium">Липсват</p>
          <ul className="flex flex-col gap-2">
            {missing.map((item) => (
              <li key={item.id} className="flex items-start gap-2.5 text-sm">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-border-strong" />
                <span className="flex flex-col">
                  <span className="leading-5">{item.label}</span>
                  {item.german && (
                    <span className="text-xs text-muted-foreground">{item.german}</span>
                  )}
                </span>
              </li>
            ))}
            {missing.length === 0 && (
              <li className="text-sm text-muted-foreground">Няма липсващи позиции.</li>
            )}
          </ul>
        </div>
      </div>

      <button
        type="button"
        onClick={onAddMissing}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors outline-none hover:bg-primary-strong focus-visible:ring-3 focus-visible:ring-ring/40 sm:w-fit"
      >
        Добави липсващите документи
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>
    </section>
  )
}

export type NextStep = {
  id: string
  title: string
  description: string
  cta: string
  trustLabel?: string
  featured?: boolean
}

export function NextStepCard({
  step,
  selected,
  onSelect,
}: {
  step: NextStep
  selected: boolean
  onSelect: () => void
}) {
  return (
    <li
      className={cn(
        'flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-card transition-colors',
        step.featured ? 'border-primary/50' : 'border-border',
        selected && 'ring-3 ring-ring/25',
      )}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-base leading-6 font-semibold text-pretty">{step.title}</h4>
          {step.featured && <Badge tone="accent">Препоръчано</Badge>}
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
          {step.description}
        </p>
      </div>

      {step.trustLabel && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 text-success" aria-hidden="true" />
          {step.trustLabel}
        </p>
      )}

      <button
        type="button"
        onClick={onSelect}
        className={cn(
          'mt-auto inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40',
          step.featured
            ? 'bg-primary text-primary-foreground hover:bg-primary-strong'
            : 'border border-border bg-card hover:bg-muted',
        )}
      >
        {selected ? 'Избрано' : step.cta}
        {selected ? (
          <Check className="size-4" aria-hidden="true" strokeWidth={3} />
        ) : (
          <ChevronRight className="size-4" aria-hidden="true" />
        )}
      </button>
    </li>
  )
}
