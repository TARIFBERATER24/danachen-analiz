import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Eyebrow } from './primitives'
import { ResultMockup } from './result-mockup'
import { TrustStrip } from './trust-strip'

export function TaxAnalysisHero() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-14 px-5 pt-12 pb-16 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pt-20 lg:pb-24">
        <div className="flex flex-col gap-6">
          <Eyebrow>Данъци в Германия • 2025</Eyebrow>

          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
              Данъчен анализ
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-foreground/80 text-pretty sm:text-xl">
              Разбери за няколко минути колко пари е възможно да си върнеш след годишната данъчна
              декларация.
            </p>
            <p className="max-w-xl leading-relaxed text-muted-foreground text-pretty">
              Отговори на няколко лесни въпроса и виж кои разходи и данъчни облекчения може да са
              релевантни за теб.
            </p>
            <p className="inline-flex w-fit items-center rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground">
              На български. Без сложни немски формуляри.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-start">
            <Link
              href="/analiz"
              className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 text-base font-semibold text-primary-foreground transition-colors outline-none hover:bg-primary-strong focus-visible:ring-3 focus-visible:ring-ring/40 sm:w-auto"
            >
              Направи безплатен анализ
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <p className="text-sm text-muted-foreground">Отнема около 5–7 минути</p>
          </div>

          <TrustStrip className="pt-2" />
        </div>

        <div className="lg:pl-6">
          <ResultMockup />
        </div>
      </div>
    </section>
  )
}
