'use client'

import { Info } from 'lucide-react'
import { MultiChoiceGrid, SingleChoiceList } from './choice-card'
import { Counter, NumberField, TextField } from './conditional-field'
import type { QuestionScreen, TaxAnswers } from '@/lib/tax/types'

type Props = {
  screen: QuestionScreen
  answers: TaxAnswers
  onChange: (patch: Partial<TaxAnswers>) => void
  /** invoked when a single-choice answer is picked, so the flow can auto-advance */
  onQuickAdvance?: () => void
}

export function TaxQuestion({ screen, answers, onChange, onQuickAdvance }: Props) {
  return (
    <div key={screen.id} className="animate-rise flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl leading-snug font-semibold tracking-tight text-balance sm:text-3xl">
          {screen.question}
        </h1>
        {screen.german && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground/75">{screen.german.split(' — ')[0]}</span>
            {screen.german.includes(' — ') && ` — ${screen.german.split(' — ')[1]}`}
          </p>
        )}
        {screen.helper && (
          <p className="flex items-start gap-2 rounded-xl bg-secondary px-3.5 py-3 text-sm leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            {screen.helper}
          </p>
        )}
      </div>

      {screen.kind === 'single' && screen.options && (
        <SingleChoiceList
          name={screen.id}
          options={screen.options}
          value={answers[screen.field] as string | undefined}
          onSelect={(value) => {
            onChange({ [screen.field]: value } as Partial<TaxAnswers>)
            onQuickAdvance?.()
          }}
        />
      )}

      {screen.kind === 'multi' && screen.options && (
        <MultiChoiceGrid
          name={screen.id}
          options={screen.options}
          values={(answers[screen.field] as string[] | undefined) ?? []}
          onToggle={(value) => {
            const current = ((answers[screen.field] as string[] | undefined) ?? []).slice()
            let next: string[]
            if (value === 'none') {
              next = current.includes('none') ? [] : ['none']
            } else {
              next = current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current.filter((item) => item !== 'none'), value]
            }
            onChange({ [screen.field]: next } as Partial<TaxAnswers>)
          }}
        />
      )}

      {screen.kind === 'counter' && (
        <Counter
          label="деца"
          value={answers.childrenCount}
          min={screen.min ?? 1}
          max={screen.max ?? 10}
          onChange={(value) => onChange({ childrenCount: value })}
        />
      )}

      {screen.kind === 'number' && (
        <NumberField
          id={screen.id}
          unit={screen.unit}
          placeholder={screen.placeholder}
          min={screen.min}
          max={screen.max}
          value={answers[screen.field] as number | undefined}
          onChange={(value) => onChange({ [screen.field]: value } as Partial<TaxAnswers>)}
        />
      )}

      {screen.kind === 'support' && (
        <div className="flex flex-col gap-5">
          <TextField
            id="supportCountry"
            label="В коя държава живее човекът?"
            placeholder="напр. България"
            value={answers.supportCountry}
            onChange={(value) => onChange({ supportCountry: value })}
          />
          <NumberField
            id="supportAmount"
            label="Приблизително колко пари си изпратил през 2025 г.?"
            unit="EUR"
            placeholder="напр. 2400"
            min={0}
            value={answers.supportAmount}
            onChange={(value) => onChange({ supportAmount: value })}
          />
        </div>
      )}
    </div>
  )
}
