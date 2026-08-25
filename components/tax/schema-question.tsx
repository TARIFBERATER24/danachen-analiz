'use client'

import { Info } from 'lucide-react'
import { MultiChoiceGrid, SingleChoiceList } from './choice-card'
import { Counter, NumberField, TextField } from './conditional-field'
import type { AddressValue, TaxAnswerValue, TaxQuestion } from '@/lib/tax/schema'

export function SchemaQuestion({
  question,
  value,
  onChange,
}: {
  question: TaxQuestion
  value: TaxAnswerValue | undefined
  onChange: (value: TaxAnswerValue | undefined) => void
}) {
  const options = (question.options ?? []).map((option) => ({
    value: option.value,
    label: option.labelBg,
    german: option.labelDe,
    hint: option.helpBg,
  }))

  return (
    <div className="animate-rise flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">{question.category}</p>
        <h1 className="text-2xl leading-snug font-semibold tracking-tight text-balance sm:text-3xl">{question.labelBg}</h1>
        {question.helpBg && (
          <p className="flex items-start gap-2 rounded-xl bg-secondary px-3.5 py-3 text-sm leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            {question.helpBg}
          </p>
        )}
      </div>

      {(question.fieldType === 'yes_no' || question.fieldType === 'single_select') && (
        <SingleChoiceList
          name={question.id}
          options={options}
          value={typeof value === 'string' ? value : undefined}
          onSelect={onChange}
        />
      )}

      {question.fieldType === 'multi_select' && (
        <MultiChoiceGrid
          name={question.id}
          options={options}
          values={Array.isArray(value) ? value : []}
          onToggle={(nextValue) => {
            const current = Array.isArray(value) ? value : []
            if (nextValue === 'none') {
              onChange(current.includes('none') ? [] : ['none'])
              return
            }
            onChange(current.includes(nextValue)
              ? current.filter((item) => item !== nextValue)
              : [...current.filter((item) => item !== 'none'), nextValue])
          }}
        />
      )}

      {question.fieldType === 'counter' && (
        <Counter
          label={question.unit ?? 'брой'}
          value={typeof value === 'number' ? value : undefined}
          min={question.min ?? 1}
          max={question.max ?? 10}
          onChange={onChange}
        />
      )}

      {(question.fieldType === 'number' || question.fieldType === 'currency') && (
        <NumberField
          id={question.id}
          label={question.fieldType === 'currency' ? 'Сума' : undefined}
          value={typeof value === 'number' ? value : undefined}
          onChange={onChange}
          unit={question.unit}
          min={question.min}
          max={question.max}
          placeholder={question.placeholder}
        />
      )}

      {question.fieldType === 'text' && (
        <TextField
          id={question.id}
          label="Отговор"
          value={typeof value === 'string' ? value : undefined}
          onChange={onChange}
          placeholder={question.placeholder}
        />
      )}

      {question.fieldType === 'date' && (
        <div className="flex flex-col gap-2">
          <label htmlFor={question.id} className="text-sm font-medium">Дата</label>
          <input
            id={question.id}
            type="date"
            value={typeof value === 'string' ? value : ''}
            onChange={(event) => onChange(event.target.value || undefined)}
            className="h-13 w-full rounded-xl border border-input bg-card px-4 text-base outline-none transition-colors focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/30"
          />
        </div>
      )}

      {question.fieldType === 'address' && <AddressFields value={value} onChange={onChange} />}
    </div>
  )
}

function AddressFields({ value, onChange }: { value: TaxAnswerValue | undefined; onChange: (value: TaxAnswerValue) => void }) {
  const address: AddressValue = typeof value === 'object' && value !== null && !Array.isArray(value) ? value : {}
  const update = (field: keyof AddressValue, next: string) => onChange({ ...address, [field]: next })
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextField id="street" label="Улица и номер" value={address.street} onChange={(next) => update('street', next)} placeholder="напр. Hauptstraße 10" />
      <TextField id="postal-code" label="Пощенски код" value={address.postalCode} onChange={(next) => update('postalCode', next)} placeholder="напр. 80331" />
      <TextField id="city" label="Град" value={address.city} onChange={(next) => update('city', next)} placeholder="напр. München" />
      <TextField id="country" label="Държава" value={address.country ?? 'Deutschland'} onChange={(next) => update('country', next)} placeholder="Deutschland" />
    </div>
  )
}

