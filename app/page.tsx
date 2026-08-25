import Link from 'next/link'
import { ArrowRight, FileText, ListChecks, Sparkle, Upload } from 'lucide-react'
import { MeinDeutschlandCrossSell } from '@/components/tax/mein-deutschland-cross-sell'
import { Eyebrow } from '@/components/tax/primitives'
import { LegalNote, PrivacyNote } from '@/components/tax/privacy-note'
import { TaxAnalysisHero } from '@/components/tax/tax-analysis-hero'

const STEPS = [
  {
    icon: ListChecks,
    title: 'Отговаряш на кратки въпроси',
    text: 'Един въпрос на екран, на български. Без данъчен жаргон и без формуляри.',
  },
  {
    icon: Upload,
    title: 'Качваш документите си',
    text: 'Започваш с Lohnsteuerbescheinigung — годишното удостоверение от работодателя.',
  },
  {
    icon: Sparkle,
    title: 'Виждаш анализа си',
    text: 'Кои области са релевантни за теб и какви данни още липсват.',
  },
  {
    icon: FileText,
    title: 'Избираш как да продължиш',
    text: 'Сам чрез ELSTER, с оторизиран специалист или като подготвен пакет документи.',
  },
]

const AREAS = [
  { title: 'Пътуване до работа', german: 'Pendlerpauschale' },
  { title: 'Работа от вкъщи', german: 'Homeoffice' },
  { title: 'Професионални разходи', german: 'Werbungskosten' },
  { title: 'Второ жилище заради работа', german: 'Doppelte Haushaltsführung' },
  { title: 'Застраховки', german: 'Vorsorgeaufwendungen' },
  { title: 'Семейство и деца', german: 'Familienstand' },
]

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-[0.65rem] font-bold text-primary-foreground">
              MD
            </span>
            <span className="text-sm font-semibold tracking-tight">Mein Deutschland</span>
          </div>
          <Link
            href="/analiz"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            Започни
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <TaxAnalysisHero />

        <section className="border-b border-border bg-surface">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-16 md:px-8 lg:py-20">
            <div className="flex flex-col gap-3">
              <Eyebrow>Как работи</Eyebrow>
              <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                Четири стъпки от въпросите до ясен план
              </h2>
            </div>
            <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map(({ icon: Icon, title, text }) => (
                <li
                  key={title}
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-card"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-accent">
                    <Icon className="size-4 text-primary" aria-hidden="true" />
                  </span>
                  <h3 className="leading-6 font-semibold text-pretty">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
            <div className="flex flex-col gap-4">
              <Eyebrow>Какво проверяваме</Eyebrow>
              <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                Немските термини — обяснени на български
              </h2>
              <p className="leading-relaxed text-muted-foreground text-pretty">
                Показваме оригиналното понятие, за да го разпознаваш в документите си, и веднага до
                него — какво означава на практика.
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {AREAS.map((area) => (
                <li
                  key={area.title}
                  className="flex flex-col gap-0.5 rounded-xl border border-border bg-card px-4 py-3.5"
                >
                  <span className="text-sm font-medium text-pretty">{area.title}</span>
                  <span className="text-xs text-muted-foreground">{area.german}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-b border-border bg-surface">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-16 md:px-8 lg:py-20">
            <PrivacyNote className="max-w-2xl bg-card" />
            <MeinDeutschlandCrossSell />
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 lg:py-20">
          <div className="flex flex-col items-start gap-5 rounded-2xl border border-border bg-card p-8 shadow-card sm:p-10">
            <h2 className="max-w-xl text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              Провери какво е възможно да си върнеш за 2025 г.
            </h2>
            <p className="max-w-xl leading-relaxed text-muted-foreground text-pretty">
              Безплатна първоначална проверка, без ангажимент. На български, стъпка по стъпка.
            </p>
            <Link
              href="/analiz"
              className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 text-base font-semibold text-primary-foreground transition-colors outline-none hover:bg-primary-strong focus-visible:ring-3 focus-visible:ring-ring/40 sm:w-auto"
            >
              Направи безплатен анализ
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <p className="text-sm text-muted-foreground">Отнема около 5–7 минути</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-10 md:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex size-6 items-center justify-center rounded-md bg-primary text-[0.6rem] font-bold text-primary-foreground">
              MD
            </span>
            <span className="text-sm font-semibold tracking-tight">Mein Deutschland</span>
          </div>
          <LegalNote className="max-w-2xl" />
          <p className="text-xs text-muted-foreground">
            Прототип за валидиране на продукта. Данните не се запазват.
          </p>
        </div>
      </footer>
    </div>
  )
}
