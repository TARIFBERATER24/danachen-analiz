'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, Clock, ListChecks, Undo2 } from 'lucide-react'
import { TAX_QUESTIONS, SUPPORTED_TAX_YEAR, visibleTaxQuestions, type TaxAnswers } from '@/lib/tax/schema'
import { countAnswered, getMissingInformation, toRequiredEvidenceRecords } from '@/lib/tax/missing'
import {
  createTaxCase,
  deleteDocumentMetadata,
  loadLatestTaxCase,
  saveDocumentMetadata,
  saveFormAssignments,
  saveGeneratedForm,
  saveRequiredEvidence,
  saveTaxAnswer,
  saveValidationIssues,
  updateTaxCase,
  type TaxCaseState,
  type TaxDocumentRecord,
} from '@/lib/tax/persistence'
import { deleteDocumentBlob, saveDocumentBlob } from '@/lib/tax/document-store'
import { selectForms } from '@/lib/tax/form-selection'
import { prepareOfficialPdfGeneration, type PdfGenerationResult } from '@/lib/tax/pdf'
import { statusAfterReview, toValidationRecords, validateTaxCase } from '@/lib/tax/validation'
import { DocumentUploader } from './document-uploader'
import { PrivacyNote } from './privacy-note'
import { SchemaQuestion } from './schema-question'
import { TaxFormGeneration } from './tax-form-generation'
import { TaxProgress } from './tax-progress'
import { TaxReview } from './tax-review'
import type { UploadedDocument, UploadStatus } from '@/lib/tax/types'

type FlowStage = 'intro' | 'questions' | 'review' | 'documents' | 'forms'

export function TaxFlow() {
  const [stage, setStage] = useState<FlowStage>('intro')
  const [index, setIndex] = useState(0)
  const [caseState, setCaseState] = useState<TaxCaseState | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('empty')
  const [uploadedDocument, setUploadedDocument] = useState<UploadedDocument | null>(null)
  const [targetDocumentType, setTargetDocumentType] = useState('Lohnsteuerbescheinigung 2025')
  const [pdfResult, setPdfResult] = useState<PdfGenerationResult | null>(null)

  useEffect(() => {
    const existing = loadLatestTaxCase()
    const loaded = existing ?? createTaxCase(TAX_QUESTIONS)
    setCaseState(loaded)
    const questions = visibleTaxQuestions(loaded.answers)
    const firstUnanswered = questions.findIndex((question) => loaded.answers[question.id] === undefined)
    const resumeIndex = loaded.taxCase.last_completed_step > 0
      ? Math.min(loaded.taxCase.last_completed_step, Math.max(0, questions.length - 1))
      : firstUnanswered >= 0 ? firstUnanswered : Math.max(0, questions.length - 1)
    setIndex(resumeIndex)
    if (loaded.taxCase.status === 'READY_FOR_REVIEW' || loaded.taxCase.status === 'READY_FOR_FORM_GENERATION' || loaded.taxCase.status === 'BLOCKED_COMPLEX_CASE') setStage('review')
    else if (Object.keys(loaded.answers).length > 0 || loaded.taxCase.status === 'WAITING_FOR_INFORMATION') setStage('questions')
    setHydrated(true)
  }, [])

  const answers = caseState?.answers ?? {}
  const questions = useMemo(() => visibleTaxQuestions(answers), [answers])
  const currentQuestion = questions[Math.min(index, Math.max(questions.length - 1, 0))]
  const missing = useMemo(() => getMissingInformation(TAX_QUESTIONS, answers, caseState?.documents ?? []), [answers, caseState?.documents])
  const issues = useMemo(() => validateTaxCase(TAX_QUESTIONS, answers, caseState?.documents ?? []), [answers, caseState?.documents])
  const selectedForms = useMemo(() => selectForms(caseState?.taxCase.id ?? 'preview', answers).selected, [answers, caseState?.taxCase.id])
  const progress = useMemo(() => countAnswered(TAX_QUESTIONS, answers), [answers])

  const refreshCaseState = useCallback((nextAnswers: TaxAnswers, nextDocuments = caseState?.documents ?? [], lastCompletedStep = caseState?.taxCase.last_completed_step ?? 0) => {
    if (!caseState) return
    const nextMissing = getMissingInformation(TAX_QUESTIONS, nextAnswers, nextDocuments)
    const nextIssues = validateTaxCase(TAX_QUESTIONS, nextAnswers, nextDocuments)
    const nextProgress = countAnswered(TAX_QUESTIONS, nextAnswers)
    const nextStatus = statusAfterReview(nextAnswers, nextIssues, nextProgress.percentage)
    const updatedCase = { ...caseState.taxCase, completion_percentage: nextProgress.percentage, status: nextStatus, last_completed_step: lastCompletedStep }
    updateTaxCase(caseState.taxCase.id, { completion_percentage: nextProgress.percentage, status: nextStatus, last_completed_step: lastCompletedStep })
    setCaseState({ ...caseState, taxCase: updatedCase, answers: nextAnswers, requiredEvidence: toRequiredEvidenceRecords(caseState.taxCase.id, nextMissing), validationIssues: toValidationRecords(caseState.taxCase.id, nextIssues) })
    saveRequiredEvidence(caseState.taxCase.id, toRequiredEvidenceRecords(caseState.taxCase.id, nextMissing))
    saveValidationIssues(caseState.taxCase.id, toValidationRecords(caseState.taxCase.id, nextIssues))
  }, [caseState])

  const answerQuestion = useCallback((questionId: string, value: unknown) => {
    if (!caseState) return
    const nextAnswers = { ...caseState.answers, [questionId]: value } as TaxAnswers
    saveTaxAnswer(caseState.taxCase.id, questionId, value as never)
    refreshCaseState(nextAnswers, caseState.documents, index + 1)
  }, [caseState, index, refreshCaseState])

  const openReview = useCallback(() => {
    if (!caseState) return
    const selected = selectForms(caseState.taxCase.id, answers)
    saveFormAssignments(caseState.taxCase.id, selected.records)
    const nextStatus = statusAfterReview(answers, issues, progress.percentage)
    setCaseState((current) => current ? { ...current, taxCase: { ...current.taxCase, status: nextStatus }, formAssignments: selected.records, validationIssues: toValidationRecords(current.taxCase.id, issues) } : current)
    setStage('review')
    window.scrollTo({ top: 0 })
  }, [answers, caseState, issues, progress.percentage])

  const goNext = useCallback(() => {
    if (index < questions.length - 1) {
      setIndex((current) => current + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    openReview()
  }, [index, openReview, questions.length])

  const goBack = useCallback(() => {
    if (index === 0) {
      setStage('intro')
      return
    }
    setIndex((current) => Math.max(0, current - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [index])

  const startNewCase = useCallback(() => {
    const next = createTaxCase(TAX_QUESTIONS)
    setCaseState(next)
    setStage('intro')
    setIndex(0)
    setPdfResult(null)
    setUploadedDocument(null)
    setUploadStatus('empty')
    window.scrollTo({ top: 0 })
  }, [])

  async function handleFile(file: File) {
    if (!caseState) return
    const storageKey = `${caseState.taxCase.id}/${crypto.randomUUID()}`
    setUploadStatus('uploading')
    await saveDocumentBlob(storageKey, file)
    const document: TaxDocumentRecord = {
      id: crypto.randomUUID(),
      tax_case_id: caseState.taxCase.id,
      document_type: targetDocumentType,
      file_name: file.name,
      mime_type: file.type || 'application/octet-stream',
      size_bytes: file.size,
      uploaded_at: new Date().toISOString(),
      storage_key: storageKey,
      processing_status: 'uploaded_not_processed',
      evidence_status: 'user_confirmed',
    }
    saveDocumentMetadata(document)
    const nextDocuments = [...caseState.documents, document]
    setUploadedDocument({ name: file.name, size: file.size })
    setUploadStatus('done')
    refreshCaseState(caseState.answers, nextDocuments)
  }

  async function removeCurrentDocument() {
    const target = caseState?.documents.at(-1)
    if (target) {
      await deleteDocumentBlob(target.storage_key)
      deleteDocumentMetadata(target.id)
      setCaseState((current) => current ? { ...current, documents: current.documents.filter((item) => item.id !== target.id) } : current)
    }
    setUploadedDocument(null)
    setUploadStatus('empty')
  }

  function preparePdf() {
    const result = prepareOfficialPdfGeneration(selectedForms)
    setPdfResult(result)
    if (!caseState) return
    for (const form of selectedForms) {
      saveGeneratedForm({
        id: `${caseState.taxCase.id}_${form.formId}_${Date.now()}`,
        tax_case_id: caseState.taxCase.id,
        form: form.formId,
        tax_year: SUPPORTED_TAX_YEAR,
        form_version: '2025 catalog entry; mapping unverified',
        generation_timestamp: new Date().toISOString(),
        data_version: 'tax-storage-v1',
        mapping_version: result.mappingVersion,
        status: 'blocked_unverified',
      })
    }
  }

  if (!hydrated || !caseState) return <div className="min-h-svh bg-background" aria-busy="true" />

  if (stage === 'intro') {
    return <Shell><Intro onStart={() => { setStage('questions'); setIndex(Math.max(0, questions.findIndex((question) => answers[question.id] === undefined))); }} onNewCase={startNewCase} hasAnswers={Object.keys(answers).length > 0} /></Shell>
  }

  if (stage === 'questions' && currentQuestion) {
    return <Shell top={<TaxProgress step={index + 1} total={questions.length} stepLabel={currentQuestion.category} percent={((index + 1) / questions.length) * 100} />} footer={<FlowFooter onBack={goBack} onNext={goNext} nextLabel={index === questions.length - 1 ? 'Към прегледа' : 'Продължи'} />}>
      <div className="py-6"><SchemaQuestion question={currentQuestion} value={answers[currentQuestion.id]} onChange={(value) => answerQuestion(currentQuestion.id, value)} /><button type="button" onClick={goNext} className="mt-8 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">Пропусни засега</button></div>
    </Shell>
  }

  if (stage === 'review') {
    return <Shell wide><TaxReview status={caseState.taxCase.status} completionPercentage={progress.percentage} missing={missing} issues={issues} forms={selectedForms} onBack={() => setStage('questions')} onDocuments={() => setStage('documents')} onForms={() => { setStage('forms'); window.scrollTo({ top: 0 }) }} /></Shell>
  }

  if (stage === 'documents') {
    const documentOptions = Array.from(new Set(missing.filter((item) => item.documentType).map((item) => item.documentType as string)))
    return <Shell footer={<FlowFooter onBack={() => setStage('review')} onNext={() => setStage('review')} nextLabel="Към прегледа" />}>
      <div className="animate-rise flex flex-col gap-6 py-6">
        <div className="flex flex-col gap-3"><p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Документи</p><h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">Качи само документите, които са нужни</h1><p className="leading-relaxed text-muted-foreground">Ако няма OCR provider, оригиналният файл се пази като `uploaded_not_processed` и стойностите не се извличат автоматично.</p></div>
        <label className="flex flex-col gap-2 text-sm font-medium">Какъв документ качваш?<select value={targetDocumentType} onChange={(event) => setTargetDocumentType(event.target.value)} className="h-12 rounded-xl border border-input bg-card px-4 font-normal outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/30">{(documentOptions.length > 0 ? documentOptions : ['Lohnsteuerbescheinigung 2025']).map((option) => <option key={option}>{option}</option>)}</select></label>
        <DocumentUploader status={uploadStatus} document={uploadedDocument} onFile={handleFile} onRemove={removeCurrentDocument} />
        <PrivacyNote />
      </div>
    </Shell>
  }

  return <Shell wide><TaxFormGeneration forms={selectedForms} result={pdfResult} onBack={() => setStage('review')} onPrepare={preparePdf} /></Shell>
}

function Intro({ onStart, onNewCase, hasAnswers }: { onStart: () => void; onNewCase: () => void; hasAnswers: boolean }) {
  return <div className="animate-rise flex flex-col gap-8 py-6"><div className="flex flex-col gap-4"><p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Данъчен анализ · 2025</p><h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Нека обработим твоята данъчна информация стъпка по стъпка</h1><p className="text-lg leading-relaxed text-muted-foreground text-pretty">Започни с това, което знаеш. Пропуснатите полета остават видими с обяснение какво липсва, защо е нужно и къде да го намериш.</p></div><ul className="grid gap-3 sm:grid-cols-3">{[{ icon: Clock, title: '5–10 минути', hint: 'първоначален intake' }, { icon: ListChecks, title: `${TAX_QUESTIONS.length} въпроса`, hint: 'schema-driven' }, { icon: Undo2, title: 'Продължаваш по-късно', hint: 'локално запазване' }].map(({ icon: Icon, title, hint }) => <li key={title} className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 shadow-card"><Icon className="size-4 text-primary" aria-hidden="true" /><span className="leading-6 font-semibold text-pretty">{title}</span><span className="text-sm text-muted-foreground">{hint}</span></li>)}</ul><div className="flex flex-wrap gap-3"><button type="button" onClick={onStart} className="inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-primary px-7 text-base font-semibold text-primary-foreground hover:bg-primary-strong focus-visible:ring-3 focus-visible:ring-ring/40">{hasAnswers ? 'Продължи случая' : 'Започни случая'}<ArrowRight className="size-4" aria-hidden="true" /></button>{hasAnswers && <button type="button" onClick={onNewCase} className="inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-semibold hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40">Нов случай</button>}</div><PrivacyNote /></div>
}

function Shell({ children, top, footer, wide = false }: { children: React.ReactNode; top?: React.ReactNode; footer?: React.ReactNode; wide?: boolean }) {
  return <div className="flex min-h-svh flex-col bg-background"><header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur"><div className={container(wide)}><div className="flex h-14 items-center justify-between"><Link href="/" className="flex items-center gap-2 rounded-lg text-sm font-semibold tracking-tight focus-visible:ring-3 focus-visible:ring-ring/40"><span className="flex size-6 items-center justify-center rounded-md bg-primary text-[0.6rem] font-bold text-primary-foreground">MD</span>Данъчен анализ</Link><span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Check className="size-3 text-success" strokeWidth={3} aria-hidden="true" />Локално запазено</span></div>{top && <div className="pb-4">{top}</div>}</div></header><main className={`flex-1 ${container(wide)}`}>{children}</main>{footer && <div className="sticky bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur"><div className={container(wide)}>{footer}</div></div>}</div>
}

function container(wide: boolean) { return `mx-auto w-full ${wide ? 'max-w-4xl' : 'max-w-2xl'} px-5 sm:px-8` }

function FlowFooter({ onBack, onNext, nextLabel }: { onBack: () => void; onNext: () => void; nextLabel: string }) {
  return <div className="flex flex-col gap-2 py-4"><div className="flex items-center gap-3"><button type="button" onClick={onBack} className="inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-medium hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40"><ArrowLeft className="size-4" aria-hidden="true" />Назад</button><button type="button" onClick={onNext} className="inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground hover:bg-primary-strong focus-visible:ring-3 focus-visible:ring-ring/40">{nextLabel}<ArrowRight className="size-4" aria-hidden="true" /></button></div><p className="text-center text-xs text-muted-foreground">Можеш да пропуснеш поле и да го попълниш по-късно.</p></div>
}

