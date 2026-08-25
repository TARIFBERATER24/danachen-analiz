import type { TaxFormFieldMappingRecord } from './persistence.ts'

export const MAPPING_VERSION = '2025-v1-unverified'

export type MappingCandidate = {
  internalField: string
  formId: string
  officialFieldId: string | null
  status: 'unverified'
  noteBg: string
}

/** No official line numbers are guessed here. Fill these only after the official
 * 2025 FMS/ELSTER form artifacts have been downloaded and inspected. */
export const MAPPING_CANDIDATES: MappingCandidate[] = [
  'full_name', 'address', 'date_of_birth', 'tax_id', 'gross_income', 'lohnsteuer', 'solidarity_surcharge', 'church_tax', 'tax_class',
  'distance_one_way_km', 'working_days', 'home_office_days', 'equipment_amount', 'training_amount', 'insurance_contributions',
].map((internalField) => ({
  internalField,
  formId: internalField === 'full_name' || internalField === 'address' || internalField === 'date_of_birth' || internalField === 'tax_id' ? 'est1a' : 'anlage-n',
  officialFieldId: null,
  status: 'unverified',
  noteBg: 'Официалният field/line identifier за 2025 не е потвърден.',
}))

export function createUnverifiedMappingRecords(caseId: string, formIds: string[]): TaxFormFieldMappingRecord[] {
  return MAPPING_CANDIDATES.filter((item) => formIds.includes(item.formId)).map((item) => ({
    id: `${caseId}_${item.formId}_${item.internalField}`,
    tax_case_id: caseId,
    internal_field: item.internalField,
    tax_year: 2025,
    form_id: item.formId,
    official_field_id: null,
    mapping_status: 'unverified',
  }))
}

