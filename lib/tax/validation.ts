import { matchesRule, type TaxAnswers, type TaxQuestion, type TaxCaseStatus } from './schema.ts'
import type { TaxDocumentRecord, TaxValidationIssueRecord } from './persistence.ts'

export type ValidationIssue = {
  id: string
  questionId?: string
  severity: 'ERROR' | 'WARNING' | 'INFO'
  code: string
  messageBg: string
  fixBg: string
}

const complexGates = [
  ['self_employed', 'Самостоятелна дейност или Gewerbe'],
  ['foreign_income', 'Доходи от чужбина'],
  ['complex_rental_income', 'По-сложни доходи от наем'],
  ['complex_capital_gains', 'Сложни капиталови доходи'],
  ['multiple_country_residency', 'Повече от една държава'],
] as const

function empty(value: unknown) {
  return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)
}

function issue(questionId: string | undefined, severity: ValidationIssue['severity'], code: string, messageBg: string, fixBg: string): ValidationIssue {
  return { id: `${code}_${questionId ?? 'case'}`, questionId, severity, code, messageBg, fixBg }
}

export function detectComplexCase(answers: TaxAnswers) {
  return complexGates.filter(([id]) => answers[id] === 'yes').map(([, label]) => label)
}

export function validateTaxCase(questions: TaxQuestion[], answers: TaxAnswers, documents: TaxDocumentRecord[] = []): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  for (const question of questions) {
    if (!matchesRule(question.conditionalRule, answers)) continue
    const value = answers[question.id]
    if (question.required && empty(value)) {
      issues.push(issue(question.id, 'ERROR', 'required_missing', `${question.labelBg} липсва.`, 'Върни се към въпроса и въведи стойност или остави случая за по-късно.'))
      continue
    }
    if (empty(value)) continue
    if (question.validationRule === 'non_negative_currency' && typeof value === 'number' && (value < 0 || !Number.isFinite(value))) {
      issues.push(issue(question.id, 'ERROR', 'invalid_currency', 'Сумата трябва да е нула или положително число.', 'Провери сумата в документа и въведи стойност в EUR.'))
    }
    if (question.validationRule === 'range_0_366' && typeof value === 'number' && (value < 0 || value > 366 || !Number.isInteger(value))) {
      issues.push(issue(question.id, 'ERROR', 'invalid_days', 'Броят дни трябва да е цяло число между 0 и 366.', 'Провери календара или данните от работодателя.'))
    }
    if (question.validationRule === 'range_0_500' && typeof value === 'number' && (value < 0 || value > 500 || !Number.isFinite(value))) {
      issues.push(issue(question.id, 'ERROR', 'invalid_distance', 'Разстоянието трябва да е между 0 и 500 km.', 'Въведи разстоянието в едната посока.'))
    }
    if (question.validationRule === 'range_1_10' && typeof value === 'number' && (value < 1 || value > 10 || !Number.isInteger(value))) {
      issues.push(issue(question.id, 'ERROR', 'invalid_counter', 'Стойността трябва да е цяло число в допустимия диапазон.', 'Провери броя и опитай отново.'))
    }
    if (question.validationRule === 'german_tax_id' && typeof value === 'string' && !/^\d{11}$/.test(value.replace(/\s/g, ''))) {
      issues.push(issue(question.id, 'ERROR', 'invalid_tax_id', 'Steuer-ID трябва да съдържа 11 цифри.', 'Премахни интервалите и провери номера в писмото от Bundeszentralamt für Steuern.'))
    }
    if (question.validationRule === 'date_of_birth' && typeof value === 'string') {
      const date = new Date(value)
      if (Number.isNaN(date.getTime()) || date > new Date('2025-12-31')) {
        issues.push(issue(question.id, 'ERROR', 'invalid_birth_date', 'Датата на раждане не е валидна.', 'Въведи реална дата преди края на 2025 г.'))
      }
    }
    if (question.validationRule === 'address_complete' && typeof value === 'object' && value !== null) {
      const address = value as { street?: string; postalCode?: string; city?: string }
      if (!address.street || !address.postalCode || !address.city) {
        issues.push(issue(question.id, 'ERROR', 'incomplete_address', 'Адресът е непълен.', 'Попълни улица, пощенски код и град.'))
      }
    }
  }

  if (answers.worked_in_germany === 'yes' && answers.lohnsteuerbescheinigung === 'yes' && !documents.some((document) => document.document_type === 'Lohnsteuerbescheinigung 2025')) {
    issues.push(issue('lohnsteuerbescheinigung', 'WARNING', 'document_not_uploaded', 'Посочи, че разполагаш с Lohnsteuerbescheinigung, но файлът още не е качен.', 'Можеш да качиш документа от секцията „Документи“.'))
  }

  return issues
}

export function toValidationRecords(caseId: string, issues: ValidationIssue[]): TaxValidationIssueRecord[] {
  return issues.map((item) => ({
    id: `${caseId}_${item.id}`,
    tax_case_id: caseId,
    question_id: item.questionId,
    severity: item.severity,
    code: item.code,
    message_bg: item.messageBg,
    fix_bg: item.fixBg,
  }))
}

export function statusAfterReview(answers: TaxAnswers, issues: ValidationIssue[], completionPercentage: number): TaxCaseStatus {
  if (detectComplexCase(answers).length > 0) return 'BLOCKED_COMPLEX_CASE'
  if (issues.some((item) => item.severity === 'ERROR')) return 'WAITING_FOR_INFORMATION'
  if (completionPercentage < 100) return 'READY_FOR_REVIEW'
  return 'READY_FOR_FORM_GENERATION'
}

