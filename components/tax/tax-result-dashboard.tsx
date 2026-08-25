'use client'

import { useMemo, useState } from 'react'
import { Check, RotateCcw } from 'lucide-react'
import { buildAnalysis } from '@/lib/tax/analysis'
import type { TaxAnswers } from '@/lib/tax/types'
import { MeinDeutschlandCrossSell } from './mein-deutschland-cross-sell'
import { LegalNote, PrivacyNote } from './privacy-note'
import { Eyebrow } from './primitives'
import {
  DocumentReadiness,
  NextStepCard,
  PotentialRefundCard,
  RelevantAreaCard,
  TaxResultHero,
  type NextStep,
} from './result-cards'

const NEXT_STEPS: NextStep[] = [
  {
    id: 'self',
    title: 'Искам да подам сам',
    description:
      'Получаваш структурирана информация и стъпки, които да използваш при подаване чрез ELSTER.',
    cta: 'Виж стъпките',
  },
  {
    id: 'pro',
    title: 'Искам професионална помощ',
    description:
      'Предай подготвената информация към лицензиран Steuerberater или друг оторизиран специалист.',
    cta: 'Заяви професионална помощ',
    trustLabel: 'Работа с оторизиран партньор',
    featured: true,
  },
  {
    id: 'package',
    title: 'Подготви документите ми',
    description:
      'Организирай информацията и документите си в структуриран пакет за последваща обработка.',
    cta: 'Подготви пакет',
  },
]

export function TaxResultDashboard({
  answers,
  documentUploaded,
  onRestart,
  onAddMissing,
}: {
  answers: TaxAnswers
  documentUploaded: boolean
  onRestart: () => void
  onAddMissing: () => void
}) {
  const analysis = useMemo(() => buildAnalysis(answers, documentUploaded), [answers, documentUploaded])
  const [chosen, setChosen] = useState<string | null>(null)

  return (
    <div className="animate-rise flex flex-col gap-10 pb-20">
      <header className="flex flex-col gap-3">
        <Eyebrow>Данъчен анализ • 2025</Eyebrow>
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Твоят данъчен анализ
        </h1>
      </header>

      <TaxResultHero areaCount={analysis.areas.length} />

      <PotentialRefundCard />

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-lg font-semibold tracking-tight">Релевантни области</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Изведени са на база отговорите ти. Всяка позиция подлежи на допълнителна проверка.
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {analysis.areas.map((area) => (
            <RelevantAreaCard key={area.id} area={area} />
          ))}
        </ul>
        {analysis.areas.length === 0 && (
          <p className="rounded-2xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
            На база отговорите ти не открихме конкретни области за проверка. Можеш да минеш анализа
            отново и да добавиш повече информация.
          </p>
        )}
      </section>

      <DocumentReadiness
        available={analysis.availableDocuments}
        missing={analysis.missingDocuments}
        onAddMissing={onAddMissing}
      />

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-lg font-semibold tracking-tight">Как искаш да продължиш?</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Избери един от трите начина. Можеш да смениш избора си по всяко време.
          </p>
        </div>
        <ul className="grid gap-3 lg:grid-cols-3">
          {NEXT_STEPS.map((step) => (
            <NextStepCard
              key={step.id}
              step={step}
              selected={chosen === step.id}
              onSelect={() => setChosen(step.id)}
            />
          ))}
        </ul>
        {chosen && (
          <p
            className="animate-rise flex items-start gap-2.5 rounded-xl border border-border bg-success-muted px-4 py-3.5 text-sm leading-relaxed"
            role="status"
          >
            <Check className="mt-0.5 size-4 shrink-0 text-success" strokeWidth={3} aria-hidden="true" />
            Избраният път е записан в прототипа. В реалната версия оттук започва подготовката на
            следващите стъпки.
          </p>
        )}
      </section>

      <PrivacyNote />

      <MeinDeutschlandCrossSell />

      <div className="flex flex-col gap-5 border-t border-border pt-8">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex h-11 w-fit items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Започни анализа отначало
        </button>
        <LegalNote />
      </div>
    </div>
  )
}
