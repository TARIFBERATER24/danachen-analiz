import type { SelectedForm } from './form-selection.ts'
import { MAPPING_VERSION } from './form-mappings.ts'

export type PdfGenerationResult = {
  ok: false
  status: 'blocked_unverified'
  reasonBg: string
  forms: Array<{ formId: string; formVersion: string }>
  mappingVersion: string
}

/**
 * Deliberate safety boundary: no PDF is generated until official 2025 fields
 * and the official PDF structure have been inspected and verified.
 */
export function prepareOfficialPdfGeneration(forms: SelectedForm[]): PdfGenerationResult {
  return {
    ok: false,
    status: 'blocked_unverified',
    reasonBg: 'Генерирането на официален PDF е спряно: официалните 2025 field identifiers и попълваемата структура още не са проверени. Няма да създаваме имитация или PDF с приблизителни координати.',
    forms: forms.map((form) => ({ formId: form.formId, formVersion: '2025 catalog entry; mapping unverified' })),
    mappingVersion: MAPPING_VERSION,
  }
}

