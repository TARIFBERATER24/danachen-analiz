import { matchesRule, type TaxAnswers, type TaxQuestion, type MissingSeverity } from './schema.ts'
import type { TaxDocumentRecord, TaxRequiredEvidenceRecord } from './persistence.ts'

export type MissingInformation = {
  questionId: string
  labelBg: string
  severity: MissingSeverity
  whyBg: string
  whereBg: string
  evidenceStatus: TaxQuestion['evidenceRequirement']['status']
  documentType?: string
}

function isEmpty(value: unknown) {
  return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)
}

export function getMissingInformation(questions: TaxQuestion[], answers: TaxAnswers, documents: TaxDocumentRecord[]): MissingInformation[] {
  const missing = questions.flatMap((question) => {
    if (!matchesRule(question.conditionalRule, answers) || !isEmpty(answers[question.id])) return []
    const evidence = question.evidenceRequirement
    const hasDocument = Boolean(evidence.documentType && documents.some((document) => document.document_type === evidence.documentType))
    if (hasDocument) return []
    const severity: MissingSeverity = question.required
      ? 'BLOCKING'
      : evidence.status === 'evidence_required_now'
        ? 'REQUIRED_LATER'
        : evidence.status === 'evidence_may_be_requested'
          ? 'OPTIONAL'
          : 'OPTIONAL'
    return [{
      questionId: question.id,
      labelBg: question.labelBg,
      severity,
      whyBg: evidence.whyBg,
      whereBg: evidence.whereBg,
      evidenceStatus: evidence.status,
      documentType: evidence.documentType,
    }]
  })
  return missing.sort((left, right) => {
    const rank = { BLOCKING: 0, REQUIRED_LATER: 1, OPTIONAL: 2 }
    return rank[left.severity] - rank[right.severity]
  })
}

export function toRequiredEvidenceRecords(caseId: string, items: MissingInformation[]): TaxRequiredEvidenceRecord[] {
  return items.filter((item) => item.documentType).map((item) => ({
    id: `evidence_${caseId}_${item.questionId}`,
    tax_case_id: caseId,
    question_id: item.questionId,
    document_type: item.documentType as string,
    status: item.severity,
    reason_bg: item.whyBg,
    where_to_find_bg: item.whereBg,
  }))
}

export function countAnswered(questions: TaxQuestion[], answers: TaxAnswers) {
  const active = questions.filter((question) => matchesRule(question.conditionalRule, answers))
  const answered = active.filter((question) => !isEmpty(answers[question.id]))
  return { answered: answered.length, total: active.length, percentage: active.length === 0 ? 0 : Math.round((answered.length / active.length) * 100) }
}

