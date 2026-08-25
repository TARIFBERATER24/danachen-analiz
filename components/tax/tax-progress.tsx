import { Check, Cloud } from 'lucide-react'
import { ProgressBar } from './primitives'

export function TaxProgress({
  step,
  stepLabel,
  percent,
  total = 8,
}: {
  step: number
  stepLabel: string
  percent: number
  total?: number
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm font-medium">
          Въпрос {step} от {total}
          <span className="ml-2 font-normal text-muted-foreground">{stepLabel}</span>
        </p>
        <p className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
          <Cloud className="size-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Запазено на това устройство</span>
          <span className="sm:hidden">Запазено</span>
          <Check className="size-3 text-success" strokeWidth={3} aria-hidden="true" />
        </p>
      </div>
      <ProgressBar value={percent} />
    </div>
  )
}

