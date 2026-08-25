import { Check } from 'lucide-react'
import { Badge } from './primitives'

const DEMO_FIELDS = [
  { label: 'Работодател', german: 'Arbeitgeber', value: 'Muster GmbH, München' },
  { label: 'Брутен доход', german: 'Bruttoarbeitslohn', value: '38 400,00 €' },
  { label: 'Удържан данък', german: 'Lohnsteuer', value: '5 120,00 €' },
  { label: 'Солидарна надбавка', german: 'Solidaritätszuschlag', value: '0,00 €' },
  { label: 'Църковен данък', german: 'Kirchensteuer', value: '409,60 €' },
]

export function DocumentExtractionPreview() {
  return (
    <div className="animate-rise flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-medium">
          <span className="flex size-5 items-center justify-center rounded-full bg-success-muted">
            <Check className="size-3 text-success" strokeWidth={3} aria-hidden="true" />
          </span>
          Документът е разпознат
        </p>
        <Badge tone="demo">Примерни данни</Badge>
      </div>

      <dl className="divide-y divide-border">
        {DEMO_FIELDS.map((field) => (
          <div key={field.label} className="flex items-start justify-between gap-4 py-3">
            <dt className="flex flex-col">
              <span className="text-sm font-medium">{field.label}</span>
              <span className="text-xs text-muted-foreground">{field.german}</span>
            </dt>
            <dd className="font-mono text-sm tabular text-foreground/70">{field.value}</dd>
          </div>
        ))}
      </dl>

      <p className="rounded-xl bg-secondary px-3.5 py-3 text-sm leading-relaxed text-muted-foreground">
        Показаните стойности са примерни и служат само за демонстрация на интерфейса. В реалната
        версия данните се извличат от твоя документ и се потвърждават от теб.
      </p>
    </div>
  )
}
