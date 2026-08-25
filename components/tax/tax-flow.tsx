'use client'

import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, Clock, ListChecks, Undo2 } from 'lucide-react'
import { TOTAL_STEPS, isAnswered, visibleScreens } from '@/lib/tax/flow'
import type { FlowStage, TaxAnswers, UploadStatus, UploadedDocument } from '@/lib/tax/types'
import { AnalysisLoader } from './analysis-loader'
import { DocumentExtractionPreview } from './document-extraction-preview'
import { DocumentUploader } from './document-uploader'
import { PrivacyNote } from './privacy-note'
import { Eyebrow } from './primitives'
import { TaxProgress } from './tax-progress'
import { TaxQuestion } from './tax-question'
import { TaxResultDashboard } from './tax-result-dashboard'

export function TaxFlow() {
  const [stage, setStage] = useState<FlowStage>('intro')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<TaxAnswers>({})
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('empty')
  const [document, setDocument] = useState<UploadedDocument | null>(null)

  const screens = useMemo(() => visibleScreens(answers), [answers])
  const screen = screens[Math.min(index, screens.length - 1)]

  const update = useCallback((patch: Partial<TaxAnswers>) => {
    setAnswers((current) => ({ ...current, ...patch }))
  }, [])

  const goNext = useCallback(() => {
    if (index < screens.length - 1) {
      setIndex(index + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setStage(answers.lohnsteuer === 'upload' ? 'upload' : 'analysis')
    window.scrollTo({ top: 0 })
  }, [answers.lohnsteuer, index, screens.length])

  const goBack = useCallback(() => {
    if (index === 0) {
      setStage('intro')
      return
    }
    setIndex(index - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [index])

  function handleFile(file: UploadedDocument) {
    setDocument(file)
    setUploadStatus('uploading')
    setTimeout(() => setUploadStatus('done'), 1500)
  }

  function restart() {
    setAnswers({})
    setIndex(0)
    setDocument(null)
    setUploadStatus('empty')
    setStage('intro')
    window.scrollTo({ top: 0 })
  }

  // ── Intro ───────────────────────────────────────────────────────
  if (stage === 'intro') {
    return (
      <Shell>
        <div className="animate-rise flex flex-col gap-8 py-6">
          <div className="flex flex-col gap-4">
            <Eyebrow>Данъчен анализ • 2025</Eyebrow>
            <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Нека проверим твоята данъчна ситуация
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground text-pretty">
              Ще ти зададем няколко въпроса за работата, семейството и разходите ти през 2025 г.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              Не е необходимо да разбираш от данъци.
            </p>
          </div>

          <ul className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: Clock, title: '5–7 минути', hint: 'приблизително време' },
              { icon: ListChecks, title: `${TOTAL_STEPS} стъпки`, hint: 'кратки въпроси' },
              { icon: Undo2, title: 'Назад по всяко време', hint: 'отговорите се запазват' },
            ].map(({ icon: Icon, title, hint }) => (
              <li
                key={title}
                className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 shadow-card"
              >
                <Icon className="size-4 text-primary" aria-hidden="true" />
                <span className="leading-6 font-semibold text-pretty">{title}</span>
                <span className="text-sm text-muted-foreground">{hint}</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => {
              setStage('questions')
              setIndex(0)
            }}
            className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 text-base font-semibold text-primary-foreground transition-colors outline-none hover:bg-primary-strong focus-visible:ring-3 focus-visible:ring-ring/40 sm:w-fit"
          >
            Започни анализа
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>

          <PrivacyNote />
        </div>
      </Shell>
    )
  }

  // ── Questionnaire ───────────────────────────────────────────────
  if (stage === 'questions' && screen) {
    const answered = isAnswered(screen, answers)
    const percent = ((index + 1) / screens.length) * 100

    return (
      <Shell
        top={<TaxProgress step={screen.step} stepLabel={screen.stepLabel} percent={percent} />}
        footer={
          <FlowFooter
            onBack={goBack}
            onNext={goNext}
            nextDisabled={!answered}
            nextLabel={index === screens.length - 1 ? 'Продължи' : 'Продължи'}
            hint={!answered ? 'Избери отговор, за да продължиш' : undefined}
          />
        }
      >
        <div className="py-6">
          <TaxQuestion screen={screen} answers={answers} onChange={update} />
        </div>
      </Shell>
    )
  }

  // ── Upload ──────────────────────────────────────────────────────
  if (stage === 'upload') {
    return (
      <Shell
        footer={
          <FlowFooter
            onBack={() => setStage('questions')}
            onNext={() => setStage('analysis')}
            nextLabel={uploadStatus === 'done' ? 'Продължи към анализа' : 'Продължи без документ'}
            nextDisabled={uploadStatus === 'uploading'}
          />
        }
      >
        <div className="animate-rise flex flex-col gap-6 py-6">
          <div className="flex flex-col gap-3">
            <Eyebrow>Стъпка {TOTAL_STEPS} от {TOTAL_STEPS} · Документи</Eyebrow>
            <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              Качи Lohnsteuerbescheinigung
            </h1>
            <p className="leading-relaxed text-muted-foreground text-pretty">
              Този документ съдържа основните данни за доходите и удържаните данъци през годината.
            </p>
          </div>

          <DocumentUploader
            status={uploadStatus}
            document={document}
            onFile={handleFile}
            onRemove={() => {
              setDocument(null)
              setUploadStatus('empty')
            }}
          />

          {uploadStatus === 'done' && <DocumentExtractionPreview />}

          <PrivacyNote />
        </div>
      </Shell>
    )
  }

  // ── Analysis ────────────────────────────────────────────────────
  if (stage === 'analysis') {
    return (
      <Shell>
        <AnalysisLoader onDone={() => setStage('result')} />
      </Shell>
    )
  }

  // ── Result ──────────────────────────────────────────────────────
  return (
    <Shell wide>
      <div className="pt-6">
        <TaxResultDashboard
          answers={answers}
          documentUploaded={uploadStatus === 'done'}
          onRestart={restart}
          onAddMissing={() => {
            setStage('upload')
            window.scrollTo({ top: 0 })
          }}
        />
      </div>
    </Shell>
  )
}

function Shell({
  children,
  top,
  footer,
  wide = false,
}: {
  children: React.ReactNode
  top?: React.ReactNode
  footer?: React.ReactNode
  wide?: boolean
}) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className={container(wide)}>
          <div className="flex h-14 items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg text-sm font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
            >
              <span className="flex size-6 items-center justify-center rounded-md bg-primary text-[0.6rem] font-bold text-primary-foreground">
                MD
              </span>
              Данъчен анализ
            </Link>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Check className="size-3 text-success" strokeWidth={3} aria-hidden="true" />
              Прототип
            </span>
          </div>
          {top && <div className="pb-4">{top}</div>}
        </div>
      </header>

      <main className={`flex-1 ${container(wide)}`}>{children}</main>

      {footer && (
        <div className="sticky bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur">
          <div className={container(wide)}>{footer}</div>
        </div>
      )}
    </div>
  )
}

function container(wide: boolean) {
  return `mx-auto w-full ${wide ? 'max-w-4xl' : 'max-w-2xl'} px-5 sm:px-8`
}

function FlowFooter({
  onBack,
  onNext,
  nextLabel,
  nextDisabled,
  hint,
}: {
  onBack: () => void
  onNext: () => void
  nextLabel: string
  nextDisabled?: boolean
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-2 py-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-medium transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Назад
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors outline-none hover:bg-primary-strong focus-visible:ring-3 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-45"
        >
          {nextLabel}
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
      {hint && <p className="text-center text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
