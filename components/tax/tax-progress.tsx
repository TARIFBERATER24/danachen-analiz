import { Check, Cloud } from 'lucide-react'
import { ProgressBar } from './primitives'
import { TOTAL_STEPS } from '@/lib/tax/flow'

export function TaxProgress({
  step,
  stepLabel,
  percent,
}: {
  step: number
  stepLabel: string
  percent: number
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm font-medium">
          Стъпка {step} от {TOTAL_STEPS}
          <span className="ml-2 font-normal text-muted-foreground">{stepLabel}</span>
        </p>
        <p className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
          <Cloud className="size-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Отговорите се запазват</span>
          <span className="sm:hidden">Запазено</span>
          <Check className="size-3 text-success" strokeWidth={3} aria-hidden="true" />
        </p>
      </div>
      <ProgressBar value={percent} />
    </div>
  )
}
