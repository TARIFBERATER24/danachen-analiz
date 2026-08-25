'use client'

import { useEffect, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProgressBar } from './primitives'

const STEPS = [
  'Проверяваме отговорите ти',
  'Подреждаме потенциално релевантните разходи',
  'Проверяваме какви документи може да липсват',
  'Подготвяме следващите стъпки',
]

export function AnalysisLoader({ onDone }: { onDone: () => void }) {
  const [done, setDone] = useState(0)

  useEffect(() => {
    if (done >= STEPS.length) {
      const finish = setTimeout(onDone, 550)
      return () => clearTimeout(finish)
    }
    const timer = setTimeout(() => setDone((value) => value + 1), 700)
    return () => clearTimeout(timer)
  }, [done, onDone])

  return (
    <div className="flex min-h-[70svh] flex-col justify-center gap-8 py-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          Подготвяме твоя данъчен анализ
        </h1>
        <p className="leading-relaxed text-muted-foreground">
          Отнема само няколко секунди. Моля, не затваряй страницата.
        </p>
      </div>

      <ProgressBar value={(done / STEPS.length) * 100} />

      <ul className="flex flex-col gap-3" aria-live="polite">
        {STEPS.map((step, index) => {
          const isDone = index < done
          const isActive = index === done
          return (
            <li
              key={step}
              className={cn(
                'flex items-center gap-3 rounded-xl border bg-card px-4 py-3.5 transition-all duration-300',
                isDone ? 'border-border' : isActive ? 'border-primary/40' : 'border-border opacity-45',
              )}
            >
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full',
                  isDone ? 'bg-success-muted' : 'bg-muted',
                )}
              >
                {isDone ? (
                  <Check className="size-3.5 text-success" strokeWidth={3} aria-hidden="true" />
                ) : isActive ? (
                  <Loader2 className="size-3.5 animate-spin text-primary" aria-hidden="true" />
                ) : null}
              </span>
              <span className={cn('text-sm leading-relaxed', isDone && 'font-medium')}>{step}</span>
            </li>
          )
        })}
      </ul>

      <p className="text-sm leading-relaxed text-muted-foreground">
        Това е първоначална ориентация, а не точно данъчно изчисление.
      </p>
    </div>
  )
}
