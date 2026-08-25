import type {
  AnswerSource,
  TaxAnswerValue,
  TaxAnswers,
  TaxCaseStatus,
  TaxQuestion,
  VerificationStatus,
} from './schema.ts'

export const TAX_STORAGE_KEY = 'danachen-tax-storage-v1'
export const TAX_STORAGE_VERSION = 1

export type TaxCaseRecord = {
  id: string
  user_id: string
  tax_year: number
  status: TaxCaseStatus
  created_at: string
  updated_at: string
  completion_percentage: number
  last_completed_step: number
}

export type TaxAnswerRecord = {
  id: string
  tax_case_id: string
  question_id: string
  value: TaxAnswerValue
  answered_at: string
  source: AnswerSource
  verification_status: VerificationStatus
}

export type TaxDocumentRecord = {
  id: string
  tax_case_id: string
  document_type: string
  file_name: string
  mime_type: string
  size_bytes: number
  uploaded_at: string
  storage_key: string
  processing_status: 'uploaded_not_processed'
  evidence_status: VerificationStatus
}

export type TaxRequiredEvidenceRecord = {
  id: string
  tax_case_id: string
  question_id: string
  document_type: string
  status: 'OPTIONAL' | 'REQUIRED_LATER' | 'BLOCKING'
  reason_bg: string
  where_to_find_bg: string
}

export type TaxFormAssignmentRecord = {
  id: string
  tax_case_id: string
  form_id: string
  tax_year: number
  reason_bg: string
  selection_status: 'selected' | 'not_selected' | 'blocked'
}

export type TaxFormFieldMappingRecord = {
  id: string
  tax_case_id: string
  internal_field: string
  tax_year: number
  form_id: string
  official_field_id: string | null
  mapping_status: 'verified' | 'unverified'
}

export type TaxValidationIssueRecord = {
  id: string
  tax_case_id: string
  question_id?: string
  severity: 'ERROR' | 'WARNING' | 'INFO'
  code: string
  message_bg: string
  fix_bg: string
}

export type TaxGeneratedFormRecord = {
  id: string
  tax_case_id: string
  form: string
  tax_year: number
  form_version: string
  generation_timestamp: string
  data_version: string
  mapping_version: string
  status: 'blocked_unverified' | 'generated'
  file_name?: string
}

export type TaxStorage = {
  schema_version: number
  user_id: string
  tax_cases: TaxCaseRecord[]
  tax_answers: TaxAnswerRecord[]
  tax_questions: TaxQuestion[]
  tax_documents: TaxDocumentRecord[]
  tax_required_evidence: TaxRequiredEvidenceRecord[]
  tax_form_assignments: TaxFormAssignmentRecord[]
  tax_form_field_mappings: TaxFormFieldMappingRecord[]
  tax_validation_issues: TaxValidationIssueRecord[]
  tax_generated_forms: TaxGeneratedFormRecord[]
}

export type TaxCaseState = {
  taxCase: TaxCaseRecord
  answers: TaxAnswers
  answersByQuestion: TaxAnswerRecord[]
  documents: TaxDocumentRecord[]
  requiredEvidence: TaxRequiredEvidenceRecord[]
  formAssignments: TaxFormAssignmentRecord[]
  validationIssues: TaxValidationIssueRecord[]
  generatedForms: TaxGeneratedFormRecord[]
}

const now = () => new Date().toISOString()

function id(prefix: string) {
  const uuid = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  return `${prefix}_${uuid}`
}

function emptyStorage(userId: string): TaxStorage {
  return {
    schema_version: TAX_STORAGE_VERSION,
    user_id: userId,
    tax_cases: [],
    tax_answers: [],
    tax_questions: [],
    tax_documents: [],
    tax_required_evidence: [],
    tax_form_assignments: [],
    tax_form_field_mappings: [],
    tax_validation_issues: [],
    tax_generated_forms: [],
  }
}

export function getLocalUserId() {
  if (typeof window === 'undefined') return 'local-user'
  const key = 'danachen-tax-local-user-v1'
  const current = window.localStorage.getItem(key)
  if (current) return current
  const next = id('user')
  window.localStorage.setItem(key, next)
  return next
}

export function readTaxStorage(): TaxStorage {
  if (typeof window === 'undefined') return emptyStorage('local-user')
  const raw = window.localStorage.getItem(TAX_STORAGE_KEY)
  if (!raw) return emptyStorage(getLocalUserId())
  try {
    const parsed = JSON.parse(raw) as TaxStorage
    if (parsed.schema_version !== TAX_STORAGE_VERSION) return emptyStorage(getLocalUserId())
    return parsed
  } catch {
    return emptyStorage(getLocalUserId())
  }
}

export function writeTaxStorage(storage: TaxStorage) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(TAX_STORAGE_KEY, JSON.stringify(storage))
}

export function createTaxCase(questions: TaxQuestion[]): TaxCaseState {
  const storage = readTaxStorage()
  const timestamp = now()
  const taxCase: TaxCaseRecord = {
    id: id('case'),
    user_id: storage.user_id || getLocalUserId(),
    tax_year: 2025,
    status: 'NOT_STARTED',
    created_at: timestamp,
    updated_at: timestamp,
    completion_percentage: 0,
    last_completed_step: 0,
  }
  storage.tax_cases = [taxCase, ...storage.tax_cases]
  storage.tax_questions = questions
  writeTaxStorage(storage)
  return hydrateCase(storage, taxCase.id)
}

export function loadLatestTaxCase(): TaxCaseState | null {
  const storage = readTaxStorage()
  const latest = storage.tax_cases[0]
  return latest ? hydrateCase(storage, latest.id) : null
}

export function loadTaxCase(caseId: string): TaxCaseState | null {
  const storage = readTaxStorage()
  return storage.tax_cases.some((item) => item.id === caseId) ? hydrateCase(storage, caseId) : null
}

export function updateTaxCase(caseId: string, patch: Partial<Pick<TaxCaseRecord, 'status' | 'completion_percentage' | 'last_completed_step'>>) {
  const storage = readTaxStorage()
  const taxCase = storage.tax_cases.find((item) => item.id === caseId)
  if (!taxCase) return
  Object.assign(taxCase, patch, { updated_at: now() })
  writeTaxStorage(storage)
}

export function saveTaxAnswer(caseId: string, questionId: string, value: TaxAnswerValue, source: AnswerSource = 'user_input', verificationStatus: VerificationStatus = 'user_confirmed') {
  const storage = readTaxStorage()
  const existing = storage.tax_answers.find((item) => item.tax_case_id === caseId && item.question_id === questionId)
  const record: TaxAnswerRecord = {
    id: existing?.id ?? id('answer'),
    tax_case_id: caseId,
    question_id: questionId,
    value,
    answered_at: now(),
    source,
    verification_status: verificationStatus,
  }
  storage.tax_answers = existing ? storage.tax_answers.map((item) => item.id === existing.id ? record : item) : [...storage.tax_answers, record]
  writeTaxStorage(storage)
}

export function saveRequiredEvidence(caseId: string, items: TaxRequiredEvidenceRecord[]) {
  const storage = readTaxStorage()
  storage.tax_required_evidence = [...storage.tax_required_evidence.filter((item) => item.tax_case_id !== caseId), ...items]
  writeTaxStorage(storage)
}

export function saveValidationIssues(caseId: string, issues: TaxValidationIssueRecord[]) {
  const storage = readTaxStorage()
  storage.tax_validation_issues = [...storage.tax_validation_issues.filter((item) => item.tax_case_id !== caseId), ...issues]
  writeTaxStorage(storage)
}

export function saveFormAssignments(caseId: string, assignments: TaxFormAssignmentRecord[]) {
  const storage = readTaxStorage()
  storage.tax_form_assignments = [...storage.tax_form_assignments.filter((item) => item.tax_case_id !== caseId), ...assignments]
  writeTaxStorage(storage)
}

export function saveDocumentMetadata(document: TaxDocumentRecord) {
  const storage = readTaxStorage()
  storage.tax_documents = [...storage.tax_documents.filter((item) => item.id !== document.id), document]
  writeTaxStorage(storage)
}

export function deleteDocumentMetadata(documentId: string) {
  const storage = readTaxStorage()
  storage.tax_documents = storage.tax_documents.filter((item) => item.id !== documentId)
  writeTaxStorage(storage)
}

export function saveGeneratedForm(record: TaxGeneratedFormRecord) {
  const storage = readTaxStorage()
  storage.tax_generated_forms = [...storage.tax_generated_forms, record]
  writeTaxStorage(storage)
}

function hydrateCase(storage: TaxStorage, caseId: string): TaxCaseState {
  const taxCase = storage.tax_cases.find((item) => item.id === caseId)
  if (!taxCase) throw new Error(`Tax case not found: ${caseId}`)
  const answersByQuestion = storage.tax_answers.filter((item) => item.tax_case_id === caseId)
  const answers = Object.fromEntries(answersByQuestion.map((item) => [item.question_id, item.value]))
  return {
    taxCase,
    answers,
    answersByQuestion,
    documents: storage.tax_documents.filter((item) => item.tax_case_id === caseId),
    requiredEvidence: storage.tax_required_evidence.filter((item) => item.tax_case_id === caseId),
    formAssignments: storage.tax_form_assignments.filter((item) => item.tax_case_id === caseId),
    validationIssues: storage.tax_validation_issues.filter((item) => item.tax_case_id === caseId),
    generatedForms: storage.tax_generated_forms.filter((item) => item.tax_case_id === caseId),
  }
}

