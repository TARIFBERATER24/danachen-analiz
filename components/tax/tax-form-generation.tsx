'use client'

import { AlertTriangle, ArrowLeft, Download, FileText, Printer } from 'lucide-react'
import type { SelectedForm } from '@/lib/tax/form-selection'
import type { PdfGenerationResult } from '@/lib/tax/pdf'
import { Badge } from './primitives'

export function TaxFormGeneration({ forms, result, onBack, onPrepare }: { forms: SelectedForm[]; result: PdfGenerationResult | null; onBack: () => void; onPrepare: () => void }) {
  return (
    <div className="animate-rise flex flex-col gap-8 py-6 pb-20">
      <header className="flex flex-col gap-3">
        <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Формуляри · 2025</p>
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Подготовка на официалните формуляри</h1>
        <p className="max-w-2xl leading-relaxed text-muted-foreground">Тук ще се появят оригиналните формуляри на германската данъчна администрация. Преди да се създаде файл, полетата трябва да бъдат проверени срещу официалния формуляр.</p>
      </header>

      <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
        <h2 className="text-lg font-semibold">Избрани формуляри</h2>
        <ul className="flex flex-col divide-y divide-border">{forms.map((form) => <li key={form.formId} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0"><FileText className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" /><div className="min-w-0"><p className="font-medium">{form.officialName}</p><p className="mt-1 text-sm text-muted-foreground">{form.reasonBg}</p><Badge className="mt-2" tone="demo">Mapping unverified</Badge></div></li>)}</ul>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-alert-line bg-alert-bg p-6 sm:p-8" role="alert">
        <div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 size-5 shrink-0 text-alert-ink" aria-hidden="true" /><div><h2 className="font-semibold text-alert-ink">PDF генерацията е защитено блокирана</h2><p className="mt-2 text-sm leading-relaxed text-alert-ink">Не създаваме PDF с измислени line/field идентификатори или с приблизителни координати. Официалните 2025 формуляри трябва първо да бъдат изтеглени, инспектирани и визуално проверени.</p></div></div>
        {result && <p className="rounded-xl bg-white/70 px-4 py-3 text-sm leading-relaxed text-alert-ink">{result.reasonBg}</p>}
      </section>

      <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
        <button type="button" onClick={onBack} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-semibold hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40"><ArrowLeft className="size-4" aria-hidden="true" />Назад към прегледа</button>
        <button type="button" onClick={onPrepare} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary-strong focus-visible:ring-3 focus-visible:ring-ring/40"><Download className="size-4" aria-hidden="true" />Провери готовността за PDF</button>
      </div>

      <section className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-5"><Printer className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" /><p className="text-sm leading-relaxed text-muted-foreground">След като field mappings бъдат потвърдени, тук ще има: преглед, изтегляне на PDF и инструкции за принтиране и подписване. Електронно подаване към Finanzamt не се извършва в тази фаза.</p></section>
    </div>
  )
}

