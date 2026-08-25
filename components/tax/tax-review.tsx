'use client'

import { AlertTriangle, ArrowLeft, ArrowRight, Check, CircleHelp, FileText, Lock, UploadCloud } from 'lucide-react'
import type { MissingInformation } from '@/lib/tax/missing'
import type { SelectedForm } from '@/lib/tax/form-selection'
import type { ValidationIssue } from '@/lib/tax/validation'
import type { TaxCaseStatus } from '@/lib/tax/schema'
import { Badge, ProgressBar } from './primitives'

const STATUS_LABELS: Record<TaxCaseStatus, string> = {
  NOT_STARTED: 'Не е започнато',
  IN_PROGRESS: 'В обработка',
  WAITING_FOR_INFORMATION: 'Липсва информация',
  READY_FOR_REVIEW: 'Готово за проверка',
  READY_FOR_FORM_GENERATION: 'Готово за формуляри',
  FORM_GENERATED: 'Формулярите са готови',
  COMPLETED: 'Завършено',
  BLOCKED_COMPLEX_CASE: 'Нужна е професионална проверка',
}

export function TaxReview({
  status,
  completionPercentage,
  missing,
  issues,
  forms,
  onBack,
  onDocuments,
  onForms,
}: {
  status: TaxCaseStatus
  completionPercentage: number
  missing: MissingInformation[]
  issues: ValidationIssue[]
  forms: SelectedForm[]
  onBack: () => void
  onDocuments: () => void
  onForms: () => void
}) {
  const blocking = missing.filter((item) => item.severity === 'BLOCKING')
  const complex = status === 'BLOCKED_COMPLEX_CASE'

  return (
    <div className="animate-rise flex flex-col gap-8 py-6 pb-20">
      <header className="flex flex-col gap-3">
        <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Преглед преди създаване на формулярите</p>
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Виж какво е готово и какво липсва</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={complex ? 'demo' : status === 'READY_FOR_FORM_GENERATION' ? 'success' : 'accent'}>{STATUS_LABELS[status]}</Badge>
          <span className="text-sm text-muted-foreground">2025 · Arbeitnehmer V1</span>
        </div>
      </header>

      <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-lg font-semibold">Напредък на случая</h2>
          <span className="font-mono text-sm tabular text-muted-foreground">{completionPercentage}%</span>
        </div>
        <ProgressBar value={completionPercentage} />
        <p className="text-sm leading-relaxed text-muted-foreground">Отговорите се запазват автоматично на това устройство. Можеш да се върнеш към всеки въпрос.</p>
      </section>

      {complex && (
        <section className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-5" role="alert">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold">Този случай изисква допълнителна професионална проверка.</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">Открити са данни извън V1 employee workflow. Не се избира автоматично хартиено подаване.</p>
          </div>
        </section>
      )}

      {blocking.length > 0 && (
        <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
          <div className="flex items-start gap-3">
            <CircleHelp className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h2 className="font-semibold">Какво е блокиращо</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Тези отговори са нужни преди безопасен избор на формуляри.</p>
            </div>
          </div>
          <MissingList items={blocking} />
        </section>
      )}

      {issues.length > 0 && (
        <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
          <h2 className="text-lg font-semibold">Проверки</h2>
          <ul className="flex flex-col gap-3">
            {issues.map((item) => (
              <li key={item.id} className="flex items-start gap-3 text-sm">
                <span className={item.severity === 'ERROR' ? 'mt-1 size-2 shrink-0 rounded-full bg-destructive' : 'mt-1 size-2 shrink-0 rounded-full bg-primary'} />
                <span className="flex flex-col gap-1"><strong>{item.messageBg}</strong><span className="text-muted-foreground">{item.fixBg}</span></span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-semibold">Допълнителна информация</h2><p className="mt-1 text-sm text-muted-foreground">Не всяка позиция изисква документ още сега.</p></div><UploadCloud className="size-5 text-primary" aria-hidden="true" /></div>
        <MissingList items={missing.filter((item) => item.severity !== 'BLOCKING').slice(0, 8)} />
        <button type="button" onClick={onDocuments} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 text-sm font-semibold transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40 sm:w-fit"><UploadCloud className="size-4" aria-hidden="true" />Управление на документите</button>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex items-start gap-3"><FileText className="mt-0.5 size-5 text-primary" aria-hidden="true" /><div><h2 className="text-lg font-semibold">Избрани формуляри</h2><p className="mt-1 text-sm text-muted-foreground">Изборът е детерминистичен според отговорите. Официалните field mappings още се проверяват.</p></div></div>
        <ul className="grid gap-3 sm:grid-cols-2">{forms.map((form) => <li key={form.formId} className="rounded-xl border border-border bg-card p-4"><p className="font-medium">{form.officialName}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{form.reasonBg}</p><Badge className="mt-3" tone="demo">Mapping unverified</Badge></li>)}</ul>
      </section>

      <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
        <button type="button" onClick={onBack} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-semibold hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40"><ArrowLeft className="size-4" aria-hidden="true" />Назад към въпросите</button>
        <button type="button" onClick={onForms} disabled={complex || blocking.length > 0} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary-strong focus-visible:ring-3 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-45">Към формулярите<ArrowRight className="size-4" aria-hidden="true" /></button>
      </div>
    </div>
  )
}

function MissingList({ items }: { items: MissingInformation[] }) {
  if (items.length === 0) return <p className="rounded-xl bg-success-muted px-4 py-3 text-sm text-success">Няма открита липсваща информация в този раздел.</p>
  return <ul className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">{items.map((item) => <li key={item.questionId} className="flex flex-col gap-1 p-4"><div className="flex items-center justify-between gap-3"><p className="font-medium">{item.labelBg}</p><Badge tone={item.severity === 'BLOCKING' ? 'demo' : 'neutral'}>{item.severity === 'BLOCKING' ? 'Блокиращо' : item.severity === 'REQUIRED_LATER' ? 'По-късно' : 'По избор'}</Badge></div><p className="text-sm leading-relaxed text-muted-foreground"><strong>Защо:</strong> {item.whyBg}</p><p className="text-sm leading-relaxed text-muted-foreground"><strong>Къде:</strong> {item.whereBg}</p></li>)}</ul>
}

